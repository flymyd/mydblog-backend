import {FC, useEffect, useRef, useState} from "react";
import React from 'react';
import {Button, message, Popconfirm, Space, Spin, Switch, Table, Tag} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import {del, get, patch, post} from "@/utils/request";
import SearchToolBar from "@/components/SearchToolBar";
import {PlusOutlined} from "@ant-design/icons";
import {FreeObject} from "@/types/FreeObject";
import {dateRender} from "@/utils/DateRender";
import EditModal from "@/components/EditModal";
import Clipboard from 'clipboard';
import {useSearchParams} from "react-router-dom";

const apiURL = '/myfiles'
const Files: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const columns: ColumnsType<any> = [
    {
      title: '文件名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'UUID(点击复制)',
      dataIndex: 'uuid',
      key: 'uuid',
      render: (_) => {
        return <a className="copy-uuid" data-clipboard-text={_}>{_}</a>
      }
    },
    {
      title: '原始文件类型',
      dataIndex: 'originType',
      key: 'originType',
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      key: 'remarks',
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
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => callEditModal(1, record)}>编辑</a>
          <Popconfirm
            title="确定要删除该文件吗？"
            onConfirm={() => {
              onDelete(record.id)
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
  const copy = new Clipboard('.copy-uuid');
  const [files, setFiles] = useState([]);
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
  const [initParams, setInitParams] = useState<any>({});
  useEffect(() => {
    if (searchParams.get('uuid')) {
      initParams['uuid'] = searchParams.get('uuid')
    }
  }, [])
  useEffect(() => {
    if (Object.hasOwn(initParams, 'uuid')) {
      onSearch(initParams)
      delete initParams['uuid']
    } else {
      onSearch({})
    }
  }, [pageNum, pageSize])
  const onSearch = (formParams: FreeObject) => {
    formParams.pageNum = pagination.current;
    formParams.pageSize = pagination.pageSize;
    let resultObj: FreeObject = Object.create(null);
    type formParamsType = keyof typeof formParams;
    Object.keys(formParams).map(k => {
      if (typeof formParams[k as formParamsType] !== undefined) {
        resultObj[k] = formParams[k]
      }
    })
    setIsSpinning(true);
    get(apiURL, resultObj).then((res: any) => {
      setFiles(res.data.items)
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
  const createRef = useRef<FreeObject>(null);
  const editRef = useRef<FreeObject>(null);
  const callEditModal = (type: number, record?: any) => {
    const toEdit = {...record}
    if (type) {
      setCurrentEdit(toEdit)
    } else setCurrentEdit({})
    if (type) {
      editRef.current!.show('编辑');
    } else {
      createRef.current!.show('新增');
    }
  }
  const [isSpinning, setIsSpinning] = useState(false);
  return (
    <Spin spinning={isSpinning}>
      <SearchToolBar onSearch={onSearch} standAloneButton={true} elements={[
        {
          name: 'name',
          label: '文件名',
          type: 'input'
        },
        {
          name: 'uuid',
          label: 'UUID',
          type: 'input'
        },
      ]}></SearchToolBar>
      <Button style={{marginBottom: 20}} icon={<PlusOutlined/>} type="primary"
              onClick={() => callEditModal(0)}>新增</Button>
      <Table columns={columns} dataSource={files} rowKey="id" onChange={onTableChange} pagination={pagination}/>
      <EditModal ref={editRef} centered={true} gutter={[16, 20]} elements={[{
        name: 'name',
        label: '文件名',
        type: 'input',
        col: 24,
        labelCol: {span: 4},
        labelAlign: 'left',
      }, {
        name: 'remarks',
        label: '备注',
        type: 'input',
        col: 24,
        labelCol: {span: 4},
        labelAlign: 'left',
      },]} onSubmit={onSubmitEditForm} initialValues={currentEdit}/>
      <EditModal ref={createRef} centered={true} gutter={[16, 20]} elements={[{
        name: 'file',
        label: '',
        type: 'file',
        fileNumLimit: 1,
        fileCustomRequest: (e: any) => {
          const afterUpload = () => {
            createRef.current!.hide();
            setTimeout(() => {
              onSearch({})
            }, 100)
          }
          const {file} = e;
          const toPost = new FormData();
          toPost.append('file', file)
          toPost.append('name', file.name)
          toPost.append('originType', file.type || 'unknown')
          post(apiURL, toPost, {
            "Content-Type": "multipart/form-data",
          }).then(res => {
            console.log(res)
            e.onSuccess()
            message.success(`${file.name} 上传成功`);
            afterUpload()
          }).catch(err => {
            e.onError()
            message.error(`${file.name} 上传失败`);
            afterUpload()
          })
        },
        col: 24,
        labelCol: {span: 4},
        labelAlign: 'left',
      }]}/>
    </Spin>
  )
}

export default Files;