import {Menu, MenuProps} from "antd";
import React, {FC, useEffect, useState} from "react";
import Sider from "antd/es/layout/Sider";
import {FileTextOutlined, HomeOutlined, TagsOutlined, FolderOutlined, FileOutlined} from "@ant-design/icons";
import {useLocation, useNavigate} from "react-router-dom";

const LeftSider: FC = () => {
  const navigator = useNavigate();
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState(location.pathname);
  useEffect(() => {
    setSelectedKeys(location.pathname)
  }, [location])
  const navOptions: MenuProps['items'] = [
    {
      key: '/',
      icon: React.createElement(HomeOutlined),
      label: '首页',
      onClick: () => {
        navigator('/')
      },
    },
    {
      key: '/Articles',
      icon: React.createElement(FileTextOutlined),
      label: '文章管理',
      onClick: () => {
        navigator('/Articles')
      },
    },
    {
      key: '/Categories',
      icon: React.createElement(FolderOutlined),
      label: '分类管理',
      onClick: () => {
        navigator('/Categories')
      },
    },
    {
      key: '/Tags',
      icon: React.createElement(TagsOutlined),
      label: 'Tag管理',
      onClick: () => {
        navigator('/Tags')
      },
    },
    {
      key: '/Files',
      icon: React.createElement(FileOutlined),
      label: '文件管理',
      onClick: () => {
        navigator('/Files')
      },
    },
  ]
  return (
    <Sider width={200}>
      <Menu
        mode="inline"
        selectedKeys={[selectedKeys]}
        style={{height: '100%', borderRight: 0}}
        items={navOptions}
      />
    </Sider>
  )
}
export default LeftSider;