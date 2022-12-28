import {useRoutes, RouteObject, Navigate, useLocation} from 'react-router-dom';
import React, {Suspense} from "react";

interface FunctionRule {
  (): any
}

//meta规则
type MetaRule = {
  auth?: boolean, //是否需要登录验证
  title?: string, //页面title
  [name: string]: string | boolean | undefined, //其他参数
}

//单个路由规则
type RouteObjectRule = RouteObject & {
  children?: RouteObjectRule[], //子路由
  page?: FunctionRule, //route导入页面的对象
  path?: string, //页面路径
  redirect?: string, //重定向地址 ，常用于设置页面默认地址
  meta?: MetaRule, //页面参数
}

interface onRouteBeforeRule<meta = MetaRule, to = string> {
  (meta: meta, to: to): any | never
}

type LoadingEleRule = React.ReactNode;

interface GuardRule {
  routers: RouteObjectRule[],
  onRouterBefore?: onRouteBeforeRule,
  loading?: LoadingEleRule,
}

let onRouterBefore: onRouteBeforeRule | undefined;
let RouterLoading: FunctionRule;

//路由导航，设置redirect重定向 和 auth权限
function Guard({element, meta}: any) {
  const {pathname} = useLocation();
  const nextPath = onRouterBefore ? onRouterBefore(meta, pathname) : pathname;
  if (nextPath && nextPath !== pathname) {
    element = <Navigate to={nextPath} replace={true}/>;
  }
  return element;
}


// 路由懒加载
function lazyLoadRouters(page: any, meta: {}) {
  meta = meta || {};
  const LazyElement = React.lazy(page);
  // const Component = lazy(() => import(`../views${path}`))
  const GetElement = () => {
    return (
      <Suspense fallback={<RouterLoading/>}>
        <LazyElement/>
      </Suspense>
    );
  };
  return <Guard element={<GetElement/>} meta={meta}/>;
}

function transRoutes(routes: RouteObjectRule[]) {
  const list: any = [];
  routes.forEach(route => {
    const obj = {...route} as any;
    if (obj.redirect) {
      obj.element = <Navigate to={obj.redirect} replace={true}/>
    }
    if (obj.page) {
      obj.element = lazyLoadRouters(obj.page, obj.meta)
    }
    if (obj.children) {
      obj.children = transRoutes(obj.children)
    }
    ['redirect', 'page', 'meta'].forEach(name => delete obj[name]);
    list.push(obj)
  });
  return list
}

export type {
  RouteObjectRule,
  MetaRule,
  FunctionRule,
  onRouteBeforeRule,
  LoadingEleRule,
}

function RouterGuard(params: GuardRule) {
  onRouterBefore = params.onRouterBefore;
  RouterLoading = () => params.loading || <></>;
  return useRoutes(transRoutes(params.routers));
}

export default RouterGuard;


