import React, {FC} from "react";
import {Header} from "antd/es/layout/layout";
import {Button} from "antd";
import {LoginOutlined} from "@ant-design/icons";
import {AppState} from "@/store";

const CustomHeader: FC = () => {
  const logout = () => {
    AppState.setToken("")
    window.location.reload();
  }
  return (
    <Header className="header">
      <div style={{color: '#FFF', width: 200}}>下北沢COAT本社</div>
      <div style={{width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center'}}>
        <Button type="primary" icon={<LoginOutlined/>} onClick={() => logout()}>注销</Button>
      </div>
    </Header>
  )
}

export default CustomHeader;
