/**
 * 应用入口文件
 * 功能：初始化Vue应用并配置核心功能
 * 主要职责：
 * - 导入并注册全局依赖
 * - 配置应用实例
 * - 挂载应用到DOM
 */

// 导入全局样式
import './assets/main.css'  // 引入全局CSS样式表

// 导入Vue核心功能
import { createApp } from 'vue'  // Vue 3的createApp函数
import { createPinia } from 'pinia'  // 状态管理库Pinia

// 导入根组件
import App from './App.vue'  // 应用的根Vue组件

// 导入路由配置
import router from './router'  // 从router目录导入路由配置

// 导入HTTP客户端
import axios from 'axios'  // 用于发送HTTP请求

// 导入图标库
import './assets/icon/iconfont.js'  // 引入阿里巴巴矢量图标库

// 创建Vue应用实例
const app = createApp(App)  // 使用根组件创建Vue应用

// 配置全局属性
app.config.globalProperties.$axios = axios  // 将axios实例挂载到全局属性

// 注册插件
app.use(createPinia())  // 使用Pinia状态管理
app.use(router)  // 使用路由配置

// 挂载应用到DOM
app.mount('#app')  // 将Vue应用挂载到id为'app'的DOM元素
