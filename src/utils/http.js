import axios from 'axios';
import auth from './auth';
import router from '../router/index'

// baseURL：后端IP
const BASE_URL = 'http://127.0.0.1:8000/';

class Http {
  constructor() {
    this.http = axios.create({
      baseURL: BASE_URL,
      timeout: 1000
    });
    
    // 请求拦截
    this.http.interceptors.request.use(config => {
      const token = auth.token;
      if (token) {
        config.headers.common.Authorization = 'JWT ' + token;
      }
      return config;
    });

    // 响应后拦截
    this.http.interceptors.response.use(response => {
      // 此处只处理 2xx 系列错误
      return response;
    }, (err) => {
      // 此处处理 4xx 系列错误
      // 默认是 403 错误
      auth.rmAll();
      router.replace('/');
      return Promise.reject(err);
    })
  }
  
  // 登录请求
  login(params) {
    const url = 'login/';
    return this.http.post(url, params);
  }

  // 登录请求
  modify(params) {
    const url = 'modify/';
    return this.http.post(url, params);
  }

  // 借用设备时，查询设备
  lend_device_query(params, page = 1) {
    const url = 'api/q_d/?page=' + page;
    return this.http.post(url, params);
  }

  // 借
  lend(params) {
    const url = 'lend/';
    return this.http.post(url, params);
  }

  // 归还设备时进行查询
  returnGetRecords(page = 1) {
    const url = 'return/?page=' + page;
    return this.http.get(url);
  }

  // 还
  returnPut(params, b_ID) {
    const url = 'return/' + b_ID + '/';
    return this.http.put(url, params);
  }
  
  // 设备管理-查
  manageDeviceQuery(params, page = 1) {
    const url = 'api/q_d/?page=' + page;
    return this.http.post(url, params);
  }

  // 设备管理-删
  manageDeviceDelete(d_ID) {
    const url = 'manage/devices/' + d_ID + '/';
    return this.http.delete(url);
  }

  // 设备管理-改
  manageDevicePut(params, d_ID) {
    const url = 'manage/devices/' + d_ID + '/';
    return this.http.put(url, params);
  }

  // 设备管理-增
  manageDeviceAdd(params) {
    const url = 'manage/devices/';
    return this.http.post(url, params);
  }

  // 记录管理-查
  manageRecordQuery(params, page = 1) {
    const url = 'api/q_r/?page=' + page;
    return this.http.post(url, params);
  }

  // 记录管理-删
  manageRecordDelete(r_ID) {
    const url = 'manage/records/' + r_ID + '/';
    return this.http.delete(url);
  }

  // 记录管理-改
  manageRecordPut(params, r_ID) {
    const url = 'manage/records/' + r_ID + '/';
    return this.http.put(url, params);
  }

  // 记录管理-增
  manageRecordAdd(params) {
    const url = 'manage/records/';
    return this.http.post(url, params);
  }

  // 用户管理-查
  manageUserQuery(params, page = 1) {
    const url = 'api/q_u/?page=' + page;
    return this.http.post(url, params);
  }

  // 用户管理-删
  manageUserDelete(u_ID) {
    const url = 'manage/users/' + u_ID + '/';
    return this.http.delete(url);
  }

  // 用户管理-改
  manageUserPut(params, u_ID) {
    const url = 'manage/users/' + u_ID + '/';
    return this.http.put(url, params);
  }

  // 用户管理-增
  manageUserAdd(params) {
    const url = 'manage/users/';
    return this.http.post(url, params);
  }
  
  // 重置密码
  reset(params) {
    const url = 'reset/';
    return this.http.post(url, params);
  }
} 

export default new Http();
