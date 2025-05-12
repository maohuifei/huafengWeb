/**
 * 用户界面全局状态管理
 * 功能：管理用户界面的全局状态和API交互方法
 * 设计意图：
 * - 使用Pinia进行集中式状态管理
 * - 封装常用的API请求方法
 * - 区分生产环境和测试环境配置
 */
import axios from 'axios'
import { defineStore } from 'pinia'

// 生产环境配置
const API_URL = 'https://huafeng.website/api'  // 生产环境API地址
//const debugStart = false                        生产环境关闭调试模式

// 测试环境配置（开发时使用）
// const API_URL = 'http://localhost:3000/api'  // 测试环境API地址
 const debugStart = true                      // 测试环境开启调试模式

export const myStore = defineStore('myStore', {
    state: () => ({
        /**
         * 是否开启调试模式
         * true: 开启调试模式
         * false: 关闭调试模式
         */
        debugStart: debugStart,
        /**
         * API请求地址
         */
        API_URL: API_URL,
        actions: {
            /**
             * GET请求方法
             * @param {string} url - API路径
             * @param {any} [params] - 请求参数
             * @returns {Promise<any>} 响应数据
             */
            async getDataToServer(url: string, params?: any) {
                const response = await axios.get(`${API_URL}/${url}`, { params })
                return response.data
            },
            /**
             * POST请求方法
             * @param {string} url - API路径
             * @param {any} body - 请求体
             * @returns {Promise<any>} 响应数据
             */
            async addDataToServer(url: string, body: any) {
                const response = await axios.post(`${API_URL}/${url}`, body)
                return response.data
            },
            /**
             * PUT请求方法
             * @param {string} url - API路径
             * @param {any} body - 请求体
             * @returns {Promise<any>} 响应数据
             */
            async putDataToServer(url: string, body: any) {
                const response = await axios.put(`${API_URL}/${url}`, body)
                return response.data
            },
            /**
             * DELETE请求方法
             * @param {string} url - API路径
             * @param {any} value - 要删除的资源ID
             * @returns {Promise<any>} 响应数据
             */
            async delDataToServer(url: string, value: any) {
                const response = await axios.delete(`${API_URL}/${url}/${value}`)
                return response.data
            }
        },
        getters: {
            //定义计算属性
        }
    })
})