import {FC} from "react";
import {Button, Form} from "antd";
import BasicForm from "@/components/BasicForm";
import {SearchToolBarParams} from "@/types/SearchToolBar";

const SearchToolBar: FC<SearchToolBarParams> = ({
                                                  initialValues,
                                                  standAloneButton = true,
                                                  onSearch = () => {
                                                  },
                                                  elements
                                                }) => {
  const [form] = Form.useForm();
  const buttonGroup = <Form.Item>
    <Button type="primary" htmlType="submit" style={{marginRight: '10px'}} onClick={() => onSearch}>
      查询
    </Button>
    <Button htmlType="button" onClick={() => {
      form.resetFields();
      form.submit();
    }
    }>
      重置
    </Button>
  </Form.Item>
  return (
    <BasicForm formInstance={form} formName="searchToolBar" elements={elements}
               initialValues={initialValues}
               onSubmit={onSearch}
               resetAfterSubmit={false}
               externalSlot={standAloneButton ? buttonGroup : <></>}
               inlineSlot={standAloneButton ? <></> : buttonGroup}
    ></BasicForm>
  )
}
export default SearchToolBar;