// config.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5173/api',
});

// 请求拦截器
instance.interceptors.request.use(config => {
  console.log('Request interceptor - URL:', config.baseURL + config.url); // 調試日誌
  console.log('Request interceptor - data:', config.data); // 調試日誌
  const token = localStorage.getItem('token') || '';
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器
instance.interceptors.response.use(res => {
  console.log('Response intercepted');
  return res;
}, err => {
  // 可选：统一错误处理
  return Promise.reject(err);
});

export default instance;
