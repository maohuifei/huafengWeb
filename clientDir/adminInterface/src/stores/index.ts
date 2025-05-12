/**
 * 管理员界面全局状态管理
 * 功能：管理管理员界面的全局状态和业务逻辑
 * 设计意图：
 * - 使用Pinia进行集中式状态管理
 * - 区分生产环境和测试环境的API地址
 * - 提供状态更新和业务逻辑处理方法
 */
import { defineStore } from 'pinia'
// import { createRequest } from '@/axios'

export const myStore = defineStore('myStore', {
    state: () => ({
        /**
         * 主页面状态标识
         * 1: 首页
         * 2: 文章管理
         * 3: 用户管理
         * 4: 系统配置
         *   41: 文章配置
         *   42: 页面配置
         *   43: 用户配置
         */
        mainState: 1,
        /**
         * 文章编辑状态
         * 0: 新建文章
         * >0: 编辑文章(值为文章ID)
         */
        articleNewOrEdit: 0,
        // API响应数据缓存
        responseData: null,
        // 用户认证token
        token: "",
        // 生产环境API地址
        API_URL: "https://huafeng.website/api",
        // 测试环境API地址（开发时使用）
        // API_URL: 'http://localhost:3000/api', 
    }),
    actions: {
        /**
         * 更新主页面状态
         * @param {number} newState - 新的状态值
         */
        updataMainStateFun(newState: number) {
            this.mainState = newState
        },
    },
    getters: {
        //定义计算属性
    }
})