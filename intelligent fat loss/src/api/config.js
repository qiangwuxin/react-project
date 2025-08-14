// config.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5173/api',
});

// 请求拦截器
instance.interceptors.request.use(config => {
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
