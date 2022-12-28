import {Framework} from "@/views/Index";
import {onRouteBeforeRule, RouteObjectRule} from "@/router/RouterGuard";
import {AppState} from "@/store";
const routes: RouteObjectRule[] = [
  {
    //TODO 404
    path: '*',
    redirect: '/',
  },
  {
    path: "/",
    element: <Framework/>,
    children: [
      {
        path: "",
        // element: <Home></Home>,
        page: () => import('../views/Home'),
        meta: {
          title: 'Blog管理'
        }
      },
      {
        path: "Articles",
        page: () => import('../views/Articles'),
        meta: {
          title: '文章管理'
        }
      },
      {
        path: "Categories",
        page: () => import('@/views/Categories'),
        meta: {
          title: '分类管理'
        }
      },
      {
        path: "Tags",
        page: () => import('@/views/Tags'),
        meta: {
          title: 'Tag管理'
        }
      },
      {
        path: "Files",
        page: () => import('@/views/Files'),
        meta: {
          title: '文件管理'
        }
      },
    ],
  },
  {
    path: '/login',
    page: () => import('@/views/Login'),
    meta: {
      title: '登录',
      auth: false
    }
  }
];
//根据路径获取路由
const checkAuth: any = (routers: Array<RouteObjectRule>, path: string) => {
  for (const data of routers) {
    if (data.path === path) return data;
    if (data.children) {
      const res = checkAuth(data.children, path);
      if (res) return res;
    }
  }
  return null
};

//全局路由守卫
const onRouteBefore: onRouteBeforeRule = (meta, to) => {
  const {auth, title} = meta;
  if (title) {
    document.title = title || 'Blog管理';
  }
  return (auth !== false && !AppState.token) ? '/login' : to;
  // return (auth !== false && !localStorage.getItem('token')) ? '/login' : to;
};

export default routes;
export {
  onRouteBefore
}