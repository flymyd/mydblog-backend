import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import {BrowserRouter, HashRouter} from "react-router-dom";
import {Provider} from "mobx-react";
import * as store from './store'
import {ConfigProvider} from "antd";
import zhCN from 'antd/locale/zh_CN';

const baseUrl = `/${import.meta.env.BASE_URL}` || '/';
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <HashRouter basename={baseUrl}>
    <Provider {...store}>
      <ConfigProvider locale={zhCN}>
        <App/>
      </ConfigProvider>
    </Provider>
  </HashRouter>
)
