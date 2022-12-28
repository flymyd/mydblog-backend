import {FC, useEffect, useState} from "react";
import {Col, Form, Input, message, Modal, Row, Select, Upload, UploadFile, UploadProps} from "antd";
import {BasicFormParams} from "@/types/BasicForm";
import {RcFile} from "antd/es/upload";
import {InboxOutlined, PlusOutlined} from "@ant-design/icons";
import Dragger from "antd/es/upload/Dragger";

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
const BasicForm: FC<BasicFormParams> = ({
                                          formInstance,
                                          formName,
                                          elements,
                                          initialValues,
                                          onSubmit = () => {
                                          },
                                          externalSlot,
                                          inlineSlot,
                                          resetAfterSubmit = true,
                                          gutter
                                        }) => {
  const space = '20px';
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const searchCellList = elements.map(el => {
    let formItem;
    switch (el.type) {
      case "input":
        formItem = <Input placeholder="请输入"/>
        break;
      case "select":
        formItem = <Select placeholder="请选择" options={el.dataSource as Array<any>} fieldNames={el.selectMap}/>
        break;
      case "datetime":
        //TODO
        break;
      case "multiSelect":
        formItem = <Select mode="multiple" placeholder="请选择" allowClear options={el.dataSource as Array<any>}
                           fieldNames={el.selectMap}/>
        break;
      case "file":
        const props: UploadProps = {
          name: 'file',
          multiple: el.fileNumLimit && el.fileNumLimit > 1 ? true : false,
          action: el.fileAction || undefined,
          customRequest: el.fileCustomRequest || undefined,
          onChange: el.fileCallback || undefined,
          onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
          },
        };
        formItem = <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined/>
          </p>
          <p className="ant-upload-text">拖动文件到此处或点击</p>
        </Dragger>
        break;
      case "pic":
        //TODO
        const handlePreview = async (file: UploadFile) => {
          if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as RcFile);
          }

          setPreviewImage(file.url || (file.preview as string));
          setPreviewOpen(true);
        };
        const uploadButton = (
          <div>
            <PlusOutlined/>
            <div style={{marginTop: 8}}>Upload</div>
          </div>
        );
        formItem = <Upload
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          listType="picture-card"
          onPreview={handlePreview}
        >
          {/*{fileList.length >= 8 ? null : uploadButton}*/}
          {uploadButton}
        </Upload>
        break;
    }
    return <Col span={el.col || 6} key={el.name}>
      <Form.Item label={el.label}
                 labelCol={el.labelCol}
                 labelAlign={el.labelAlign}
                 name={el.name}
                 valuePropName={(el.type === "pic" || el.type == "file") ? 'fileList' : undefined}
                 getValueFromEvent={(el.type === "pic" || el.type == "file") ? e => {
                   if (Array.isArray(e)) {
                     return e;
                   }
                   return e?.fileList;
                   // return e && e.fileList;
                 } : undefined}
                 rules={el.validate || []}>
        {formItem}
      </Form.Item>
    </Col>
  })
  // useEffect(() => {
  //   return () => formInstance.resetFields();
  // }, [])
  useEffect(() => {
    if (resetAfterSubmit) {
      formInstance.resetFields();
    }
  })
  return (
    <>
      <Modal open={previewOpen} title="预览" footer={null} onCancel={() => setPreviewOpen(false)}>
        <img alt="preview" style={{width: '100%'}} src={previewImage}/>
      </Modal>
      <Form
        form={formInstance}
        style={{marginBottom: space}}
        name={formName}
        initialValues={initialValues || {}}
        onFinish={onSubmit}
        autoComplete="off"
        layout="inline"
      >
        <Row style={{width: '100%'}} gutter={gutter}>
          {searchCellList}
          {inlineSlot ? <Row>{inlineSlot}</Row> : <></>}
        </Row>
        {externalSlot ? <Row style={{marginTop: space}}>{externalSlot}</Row> : <></>}
      </Form>
    </>
  )
}
export default BasicForm;