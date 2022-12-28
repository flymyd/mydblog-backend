import React, {forwardRef, useImperativeHandle, useState} from "react";
import {Form, Modal} from "antd";
import BasicForm from "@/components/BasicForm";
import {EditModalParams} from "@/types/EditModal";
import {FreeObject} from "@/types/FreeObject";

const EditModal = forwardRef((props: EditModalParams, modalRef) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [form] = Form.useForm();
  const show = (title?: string) => {
    if (title) {
      setTitle(title);
    }
    setIsModalOpen(true);
  }
  const hide = () => {
    setIsModalOpen(false)
  }
  useImperativeHandle(modalRef, () => ({
    show, hide
  }))
  const onSubmitForm = (formParams: FreeObject) => {
    props.onSubmit(formParams);
    setIsModalOpen(false)
  }
  return (
    <Modal title={title} open={isModalOpen} centered={props.centered} destroyOnClose={true} onOk={() => form.submit()}
           onCancel={() => setIsModalOpen(false)}>
      <BasicForm formInstance={form} formName="editModal" elements={props.elements} initialValues={props.initialValues}
                 gutter={props.gutter}
                 onSubmit={onSubmitForm}></BasicForm>
      {props.children}
    </Modal>
  )
})
export default EditModal;