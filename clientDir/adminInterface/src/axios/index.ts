/**
 * 核心API请求配置
 * 功能：创建带有拦截器的axios实例，用于内部API调用
 * 设计意图：
 * - 统一管理API基础配置
 * - 自动处理认证token
 * - 统一错误处理和认证过期逻辑
 */
import axios from 'axios';  
import { ElMessage } from 'element-plus';
import router from '@/router';
import { myStore } from '@/stores';
  
// 获取全局状态管理实例
const stores = myStore();

/**
 * 创建axios服务实例
 * 配置项说明：
 * - baseURL: API基础路径，从store动态获取
 * - timeout: 请求超时时间(毫秒)，超过此时间未响应则自动取消请求
 */
const service = axios.create({
  baseURL: stores.API_URL,
  timeout: 5000 // 请求超时时间(5秒)
});

/**
 * 请求拦截器
 * 功能：在请求发送前统一处理认证token
 * 处理逻辑：
 * 1. 从localStorage获取认证token
 * 2. 如果存在token，自动添加到请求头Authorization字段
 * 3. 如果token不存在，跳转登录页并提示错误
 */
service.interceptors.request.use(  
  (config) => {  
    const token = localStorage.getItem('auth_token');
    if (token) {  
      config.headers['Authorization'] = `Bearer ${token}`;  
    } else {
      router.push('/login');
      ElMessage.error('认证过期，请重新登录');
    }
    return config;  
  },  
  error => Promise.reject(error)
);

/**
 * 响应拦截器
 * 功能：统一处理API响应错误
 * 错误处理逻辑：
 * 1. 401/405状态码：认证过期，清除token并跳转登录页
 * 2. 其他错误状态：显示服务器返回的错误信息或默认提示
 * 3. 所有错误都会触发全局错误提示
 */
service.interceptors.response.use(
  response => response,
  error => {
    const status = error.response?.status;

    if (status === 401 || status === 405) {
      ElMessage.error('登录已过期，请重新登录');
      localStorage.removeItem('auth_token');
      setTimeout(() => router.push('/login'), 1500);
    } else {
      ElMessage.error(error.response?.data || '请求失败，请稍后重试');
    }

    return Promise.reject(error);
  }
);
  
export default service;