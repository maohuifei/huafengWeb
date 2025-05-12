/**
 * 外部API请求配置
 * 功能：创建基础axios实例，用于外部API调用
 * 设计意图：
 * - 统一管理API基础配置
 * - 设置合理的默认超时时间
 * - 自动从store获取当前环境API地址
 */
import axios from 'axios';  
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
  baseURL: stores.API_URL, // 使用store中配置的API地址
  timeout: 5000, // 请求超时时间(5秒)
});
  
export default service;