import React, {FC} from "react";
import {Breadcrumb, Layout} from "antd";
import {Content} from "antd/es/layout/layout";
import {Outlet} from "react-router-dom";

const MainBody: FC = () => {
  return (
    <Layout style={{padding: '24px'}}>
      <Content
        className="site-layout-background"
        style={{
          padding: 24,
          margin: 0,
          minHeight: 280,
        }}
      >
        <Outlet/>
      </Content>
    </Layout>
  )
}
export default MainBody;