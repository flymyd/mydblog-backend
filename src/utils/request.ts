import axios from "axios";
import {AppState} from "@/store";
import {message} from "antd";
import {FreeObject} from "@/types/FreeObject";

axios.defaults.timeout = 100000;
axios.defaults.baseURL = import.meta.env.VITE_API_URL;

axios.interceptors.request.use((config: any) => {
  if (AppState.token) {
    config.headers['Authorization'] = 'Bearer ' + AppState.token
  }
  return config;
}, error => Promise.reject(error));

axios.interceptors.response.use(response => response, error => {
  handleError(error)
  return Promise.resolve(error.response)
});

/**
 * 封装get
 * @param url  请求url
 * @param params  请求参数
 * @returns {Promise}
 */
export function get(url: any, params?: Object): Promise<unknown> {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params,
    }).then((response) => {
      resolve(response.data);
    }).catch((err) => {
      reject(err);
    });
  });
}

const handleJson = (data: Object | string) => {
  let config = Object.create(null);
  if (typeof data == "string") {
    config.headers = {
      "Content-Type": "application/json",
    };
    config.data = data;
  }
  return {config, data}
}

/**
 * 封装post
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post(url: any, data: Object | string, options?: FreeObject): Promise<unknown> {
  if (!options) {
    const {config, data: dt} = handleJson(data);
    return new Promise((resolve, reject) => {
      axios.post(url, dt, config).then((response) => {
          resolve(response.data);
        }, (err) => {
          reject(err);
        }
      );
    });
  } else {
    return new Promise((resolve, reject) => {
      axios.post(url, data, options).then((response) => {
          resolve(response.data);
        }, (err) => {
          reject(err);
        }
      );
    });
  }
}

/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function patch(url: any, data: Object): Promise<unknown> {
  const {config, data: dt} = handleJson(data);
  return new Promise((resolve, reject) => {
    axios.patch(url, dt, config).then(
      (response) => {
        resolve(response.data);
      }, (err) => {
        reject(err);
      }
    );
  });
}

/**
 * 封装delete请求
 * @param url
 * @param params
 * @returns {Promise}
 */
export function del(url: any, params?: Object): Promise<unknown> {
  return new Promise((resolve, reject) => {
    axios.delete(url, {
      params: params,
    }).then((response) => {
      resolve(response.data);
    }).catch((err) => {
      reject(err);
    });
  });
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function put(url: any, data: Object): Promise<unknown> {
  const {config, data: dt} = handleJson(data);
  return new Promise((resolve, reject) => {
    axios.put(url, dt, config).then(
      (response) => {
        resolve(response.data);
      }, (err) => {
        reject(err);
      }
    );
  });
}

//统一接口处理，返回数据
export default function (fetch: any, url: any, param: Object | string): Promise<unknown> {
  let _data = "";
  return new Promise((resolve, reject) => {
    switch (fetch) {
      case "get":
        console.log("begin a get request,and url:", url);
        get(url, param)
          .then(function (response) {
            resolve(response);
          })
          .catch(function (error) {
            console.log("get request GET failed.", error);
            reject(error);
          });
        break;
      case "post":
        post(url, param)
          .then(function (response) {
            resolve(response);
          })
          .catch(function (error) {
            console.log("get request POST failed.", error);
            reject(error);
          });
        break;
      default:
        break;
    }
  });
}

//失败提示
function handleError(err: any) {
  if (err && err.response) {
    if (err.response?.data?.message) {
      message.error(err.response?.data?.message)
    } else {
      switch (err.response.status) {
        case 400:
          message.error(err.response.data.error.details);
          break;
        case 401:
          message.error("请求未授权");
          break;
        case 403:
          message.error("拒绝访问");
          break;
        case 404:
          message.error("请求地址出错");
          break;
        case 408:
          message.error("请求超时");
          break;
        case 500:
          message.error("服务器内部错误");
          break;
        case 501:
          message.error("服务未实现");
          break;
        case 502:
          message.error("网关错误");
          break;
        case 503:
          message.error("服务不可用");
          break;
        case 504:
          message.error("网关超时");
          break;
        case 505:
          message.error("HTTP版本不受支持");
          break;
        default:
      }
    }
  }
}

