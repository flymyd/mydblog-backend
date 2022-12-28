import '@/assets/css/Login.css'
import {FC} from "react";
import {observer, inject} from "mobx-react";
import {Button, Card, Form, Input} from "antd";
import {post} from "@/utils/request";
import {useNavigate} from "react-router-dom";

const Login: FC = ({AppState}: any) => {
  const navigator = useNavigate();
  const onFinish = (values: any) => {
    post('/user', JSON.stringify(values)).then((res: any) => {
      if (res.data) {
        AppState.setToken(res.data);
        navigator('/');
      }
    })
  };
  return (
    <div className="blog-login">
      <Card title="登录" bordered={false} style={{width: '30%'}}>
        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="on"
          labelCol={{span: 3}}
          labelAlign={'right'}
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[{required: true, message: '请输入用户名！'}]}
          >
            <Input/>
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[{required: true, message: '请输入密码！'}]}
          >
            <Input.Password/>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>登录</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
export default inject("AppState")(observer(Login))