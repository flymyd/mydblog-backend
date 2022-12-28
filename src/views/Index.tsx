import '@/assets/css/Framework.css'
import {FC} from "react";
import {Layout} from 'antd';
import MainBody from "@/Framework/MainBody";
import LeftSider from "@/Framework/LeftSider";
import CustomHeader from "@/Framework/CustomHeader";

export const Framework: FC = () => {
  return (
    <div>
      <Layout style={{minHeight: '100vh'}}>
        <CustomHeader/>
        <Layout>
          <LeftSider/>
          <MainBody/>
        </Layout>
      </Layout>
    </div>
  )
}