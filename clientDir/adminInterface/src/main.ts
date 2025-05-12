/**
 * 应用入口文件 - 初始化Vue应用并配置核心功能
 * 主要功能:
 * 1. 创建Vue应用实例
 * 2. 注册核心插件(Pinia状态管理, Element Plus UI库)
 * 3. 配置全局属性和样式
 * 4. 挂载应用到DOM
 */

// 导入Vue核心功能
import { createApp } from 'vue' // Vue 3核心创建函数
import { createPinia } from 'pinia' // Pinia状态管理库

// 导入根组件
import App from './App.vue' // 应用根组件

// 导入路由配置
import router from './router' // 路由配置

// 导入Element Plus UI库及其图标
import ElementPlus from 'element-plus' // Element Plus主库
import * as ElementPlusIconsVue from '@element-plus/icons-vue' // Element Plus图标库
import 'element-plus/dist/index.css' // Element Plus默认样式

// 导入全局样式
import './assets/main.css' // 基础全局样式
import './assets/theme.css' // 主题定制样式

// 导入HTTP客户端
import axios from 'axios' // Axios HTTP请求库

// 创建Vue应用实例
const app = createApp(App) // 使用根组件创建应用
const pinia = createPinia() // 创建Pinia状态管理实例

// 注册Element Plus UI库
app.use(ElementPlus) // 全局注册Element Plus组件

// 注册Element Plus图标组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component) // 逐个注册所有图标组件
}

// 配置全局属性 - 将axios实例挂载到全局
app.config.globalProperties.$axios = axios

// 注册插件 - 注意注册顺序可能影响功能
app.use(pinia) // 1. 先注册状态管理
app.use(router) // 2. 再注册路由

// 挂载应用到DOM - 目标元素为index.html中的#app
app.mount('#app')
