import axios from "axios";
import Cookies from "js-cookie";
import qs from 'qs'
import {
  ElLoading,
  ElMessage
} from 'element-plus';

const instance = axios.create({
  baseURL:'',
  timeout:6000,
})

//请求拦截器 
instance.interceptors.request.use((config) => {
  //showLoading()
  if (Cookies.get('token')) config.headers.Authorization = Cookies.get('token')
  // if (config.method === 'post') {
  //   config.data = qs.stringify(config.data);
  //   console.log(config.data);
  // }
  return config;
}, (error) =>
  // 对请求错误做些什么
  Promise.reject(error));

  //响应拦截器
instance.interceptors.response.use((response) => {
  return response.data;
}, (error) => {
  console.log(error)
  //响应错误
  if (error.response && error.response.status) {
      const status = error.response.status
      let message;
      switch (status) {
          case 400:
              message.error('请求错误');
              break;
          case 401:
              message.error('请求错误')
              break;
          case 404:
              message.error('请求地址出错')
              break;
          case 408:
              message.error('请求超时')
              break;
          case 500:
              message.error('服务器内部错误!')
              break;
          case 501:
              message.error('服务未实现!')
              break;
          case 502:
              message.error('网关错误!')
              break;
          case 503:
              message.error('服务不可用!')
              break;
          case 504:
              message.error('网关超时!')
              break;
          case 505:
              message.error('HTTP版本不受支持')
              break;
          default:
              message.error('请求失败')
      }
      ElMessage.error(message);
      return Promise.reject(error);
  }
  return Promise.reject(error);
});

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

 export function get(url, params = {}) {
  return new Promise((resolve, reject) => {
    instance.get('/api'+url, params
    ).then(response => {
      resolve(response);
    }).catch(err => {
      reject(err);
    });
  });
}

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

 export function post(url, params = {}) {
  return new Promise((resolve, reject) => {
    instance.post('/api'+url,params
    ).then(response => {
      resolve(response);
    }).catch(err => {
      reject(err);
    });
  });
}