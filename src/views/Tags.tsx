import React, {FC, useEffect, useRef, useState} from "react";
import {Button, message, Popconfirm, Space, Spin, Table} from "antd";
import {ColumnsType} from "antd/es/table";
import {FreeObject} from "@/types/FreeObject";
import {del, get, patch, post} from "@/utils/request";
import {PlusOutlined} from "@ant-design/icons";
import SearchToolBar from "@/components/SearchToolBar";
import EditModal from "@/components/EditModal";
import {dateRender} from "@/utils/DateRender";

interface DataType {
  id: number;
  name: string;
}

const apiURL = '/tags'
const Tags: FC = () => {
  const columns: ColumnsType<DataType> = [
    {
      title: 'Tag名',
      dataIndex: 'name',
      key: 'name',
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
            title="确定要删除该Tag吗？"
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
  const [tags, setTags] = useState([]);
  const [currentEdit, setCurrentEdit] = useState<FreeObject>({});
  const onSearch = (formParams: FreeObject) => {
    let resultObj: FreeObject = Object.create(null);
    type formParamsType = keyof typeof formParams;
    Object.keys(formParams).map(k => {
      if (typeof formParams[k as formParamsType] !== undefined) {
        resultObj[k] = formParams[k];
      }
    })
    setIsSpinning(true);
    get(apiURL, resultObj).then((res: any) => {
      setTags(res.data)
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
  useEffect(() => {
    onSearch({})
  }, [])
  const modalRef = useRef<FreeObject>(null);
  const callEditModal = (type: number, record?: any) => {
    type ? setCurrentEdit(record) : setCurrentEdit({});
    modalRef.current!.show(type ? '编辑' : '新增');
  }
  const [isSpinning, setIsSpinning] = useState(false);
  return (
    <>
      <Spin spinning={isSpinning}>
        <SearchToolBar onSearch={onSearch} standAloneButton={false} elements={[
          {
            name: 'name',
            label: 'Tag名',
            type: 'input'
          },
        ]}></SearchToolBar>
        <Button style={{marginBottom: 20}} icon={<PlusOutlined/>} type="primary"
                onClick={() => callEditModal(0)}>新增</Button>
        <Table columns={columns} dataSource={tags} rowKey="id" pagination={false}/>
        <EditModal ref={modalRef} centered={true} elements={[{
          name: 'name',
          label: 'Tag名',
          type: 'input',
          col: 24,
          validate: [{required: true, message: '请输入Tag名!'}]
        }]} onSubmit={onSubmitEditForm} initialValues={currentEdit}/>
      </Spin>
    </>
  )
}

export default Tags;