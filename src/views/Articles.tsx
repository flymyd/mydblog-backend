import {FC, useEffect, useRef, useState} from "react";
import React from 'react';
import {Button, message, Popconfirm, Space, Spin, Switch, Table, Tag} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import {del, get, patch, post} from "@/utils/request";
import {Article} from "@/types/Article";
import SearchToolBar from "@/components/SearchToolBar";
import {PlusOutlined} from "@ant-design/icons";
import {FreeObject} from "@/types/FreeObject";
import {booleanSelect} from "@/utils/CONST";
import {dateRender} from "@/utils/DateRender";
import EditModal from "@/components/EditModal";
import {randomColor} from "@/utils/RandomColor";
import {useNavigate} from "react-router-dom";

const apiURL = '/article'
const Articles: FC = () => {
  const navigate = useNavigate();
  const columns: ColumnsType<Article> = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '文章',
      dataIndex: 'article',
      key: 'article',
      render: (_, record) => {
        return <a onClick={() => {
          navigate(`/Files?uuid=${_}`)
        }}>{_}</a>
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createdDate',
      key: 'createdDate',
      render: dateRender
    },
    {
      title: '更新时间',
      dataIndex: 'updatedDate',
      key: 'updatedDate',
      render: dateRender
    },
    {
      title: '分类',
      key: 'categories',
      dataIndex: 'categories',
      render: (_, {categories}: FreeObject) => (
        <>
          {(categories && Array.isArray(categories) && categories.length > 0) ? categories.map((category: FreeObject) => {
            return (
              <Tag color={randomColor()} key={category.id}>
                {category.name}
              </Tag>
            );
          }) : <a>无</a>}
        </>
      ),
    },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
      render: (_, {tags}: FreeObject) => (
        <>
          {(tags && Array.isArray(tags) && tags.length > 0) ? tags.map((tag: FreeObject) => {
            return (
              <Tag color={randomColor()} key={tag.id}>
                {tag.name}
              </Tag>
            );
          }) : <a>无</a>}
        </>
      ),
    },
    {
      title: '置顶',
      key: 'isTop',
      render: (_, record) => (
        <Switch defaultChecked={record.isTop} onChange={(checked) => onSwitchChange(0, checked, record.id)}></Switch>
      ),
    },
    {
      title: '禁用',
      key: 'isDisabled',
      render: (_, record) => (
        <Switch defaultChecked={record.isDisabled}
                onChange={(checked) => onSwitchChange(1, checked, record.id)}></Switch>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => callEditModal(1, record)}>编辑</a>
          <Popconfirm
            title="确定要删除该文章吗？"
            onConfirm={() => {
              if (record.id != null) {
                onDelete(record.id)
              }
            }}
            okText="是"
            cancelText="否"
          >
            <a href="#">删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  // 分页器配置
  const [pageSize, setPageSize] = useState(10);
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const pagination = {
    total,
    pageSize,
    current: pageNum,
    showSizeChanger: true,
    showQuickJumper: false,
    showTotal: (total: any, range: any[]) => `显示第 ${range[0]}-${range[1]} 条 , 共 ${total} 条`,
  }
  const onTableChange = (pagination: any) => {
    setPageNum(pagination.current)
    setPageSize(pagination.pageSize)
    setTotal(pagination.total)
  }
  useEffect(() => {
    onSearch({})
  }, [pageNum, pageSize])
  const onSearch = (formParams: FreeObject) => {
    formParams.pageNum = pagination.current;
    formParams.pageSize = pagination.pageSize;
    let resultObj: FreeObject = Object.create(null);
    type formParamsType = keyof typeof formParams;
    Object.keys(formParams).map(k => {
      if (typeof formParams[k as formParamsType] !== undefined) {
        if (formParams[k] === true) {
          resultObj[k] = 1
        } else if (formParams[k] === false) {
          resultObj[k] = 0
        } else resultObj[k] = formParams[k];
      }
    })
    setIsSpinning(true);
    get(apiURL, resultObj).then((res: any) => {
      setArticles(res.data.items)
      setTotal(res.data.meta.totalItems)
      setIsSpinning(false);
    })
  }
  const onCRUDFinish = (code: number) => {
    setIsSpinning(false);
    if (code === 200) {
      message.success("成功")
      onSearch({})
    }
  }
  const onDelete = (id: number) => {
    setIsSpinning(true);
    del(apiURL + `/${id}`).then((res: any) => {
      onCRUDFinish(res.statusCode);
    })
  }
  const onSwitchChange = (type: number, value: boolean, id: any) => {
    let formParams: FreeObject = Object.create(null);
    if (type) {
      formParams['isDisabled'] = value ? 1 : 0;
    } else {
      formParams['isTop'] = value ? 1 : 0;
    }
    patch(apiURL + `/${id}`, JSON.stringify(formParams)).then((res: any) => {
      onCRUDFinish(res.statusCode);
    })
  }
  const onSubmitEditForm = (formParams: FreeObject) => {
    const {id} = currentEdit;
    setIsSpinning(true);
    if (id) {
      patch(apiURL + `/${id}`, JSON.stringify(formParams)).then((res: any) => {
        onCRUDFinish(res.statusCode);
      })
    } else {
      post(apiURL, JSON.stringify(formParams)).then((res: any) => {
        onCRUDFinish(res.statusCode);
      })
    }
  }
  const [currentEdit, setCurrentEdit] = useState<FreeObject>({});
  const modalRef = useRef<FreeObject>(null);
  const callEditModal = (type: number, record?: any) => {
    const toEdit = {...record}
    if (type) {
      const {tags, categories} = record;
      if (categories.length > 0) {
        toEdit.categories = categories.map((obj: FreeObject) => {
          return obj.id
        })
      }
      if (tags.length > 0) {
        toEdit.tags = tags.map((obj: FreeObject) => {
          return obj.id
        })
      }
      setCurrentEdit(toEdit)
    } else setCurrentEdit({})
    modalRef.current!.show(type ? '编辑' : '新增');
  }
  //初始化分类列表
  useEffect(() => {
    get('/categories', {}).then((res: any) => {
      setCategories(res.data)
    })
    get('/tags', {}).then((res: any) => {
      setTags(res.data)
    })
  }, [])
  const [isSpinning, setIsSpinning] = useState(false);
  return (
    <Spin spinning={isSpinning}>
      <SearchToolBar onSearch={onSearch} standAloneButton={true} elements={[
        {
          name: 'title',
          label: '标题',
          type: 'input'
        },
        {
          name: 'categories',
          label: '分类',
          type: 'select',
          dataSource: categories,
          selectMap: {
            label: 'name',
            value: 'id'
          }
        },
        {
          name: 'isDisabled',
          label: '已禁用',
          type: 'select',
          dataSource: booleanSelect,
        },
        {
          name: 'isTop',
          label: '置顶',
          type: 'select',
          dataSource: booleanSelect
        },
      ]}></SearchToolBar>
      <Button style={{marginBottom: 20}} icon={<PlusOutlined/>} type="primary"
              onClick={() => callEditModal(0)}>新增</Button>
      <Table columns={columns} dataSource={articles} rowKey="id" onChange={onTableChange} pagination={pagination}/>
      <EditModal ref={modalRef} centered={true} gutter={[16, 20]} elements={[{
        name: 'title',
        label: '文章名',
        type: 'input',
        col: 24,
        labelCol: {span: 4},
        labelAlign: 'left',
        validate: [{required: true, message: '请输入文章名!'}]
      }, {
        name: 'article',
        label: '文章',
        type: 'input',
        col: 24,
        labelCol: {span: 4},
        labelAlign: 'left',
        validate: [{required: true, message: '请输入文章UUID!'}]
      }, {
        name: 'abstract',
        label: '摘要',
        type: 'input',
        col: 24,
        labelCol: {span: 4},
        labelAlign: 'left',
      }, {
        name: 'categories',
        label: '分类',
        type: 'multiSelect',
        col: 24,
        labelCol: {span: 4},
        labelAlign: 'left',
        dataSource: categories,
        selectMap: {
          label: 'name',
          value: 'id'
        },
        validate: [{required: true, message: '请选择分类!'}]
      }, {
        name: 'tags',
        label: 'Tags',
        type: 'multiSelect',
        col: 24,
        labelCol: {span: 4},
        labelAlign: 'left',
        dataSource: tags,
        selectMap: {
          label: 'name',
          value: 'id'
        },
      }, {
        name: 'poster',
        label: '封面图',
        type: 'input',
        col: 24,
        labelCol: {span: 4},
        labelAlign: 'left',
      },]} onSubmit={onSubmitEditForm} initialValues={currentEdit}/>
    </Spin>
  )
}

export default Articles;