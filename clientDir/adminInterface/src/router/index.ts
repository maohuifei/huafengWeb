/**
 * 管理员界面路由配置
 * 功能：定义管理员界面的所有路由规则和导航逻辑
 * 设计意图：
 * - 使用Vue Router实现SPA路由管理
 * - 采用懒加载优化性能
 * - 包含基础路由、重定向和404处理
 */
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  routes: [
    // 根路径重定向到首页
    {
      path: '/',
      redirect: '/home'  // 自动跳转到home路由
    },
    // 登录页面路由
    {
      path: '/login',
      name: 'login',      // 路由名称，用于编程式导航
      component: () => import('../views/Login.vue')  // 懒加载登录组件
    },
    // 首页路由
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/Home.vue')  // 懒加载首页组件
    },
    // 系统维护页面路由
    {
      path: '/maintenance',
      name: 'maintenance',
      component: () => import('../views/MaintenanceView.vue')  // 懒加载维护页面组件
    },
    // 404页面路由（必须放在最后）
    {
      path: '/:pathMatch(.*)*',  // 匹配所有未定义的路由
      name: '404',
      component: () => import('../views/NotFoundView.vue')  // 懒加载404组件
    }
  ],
  // 使用HTML5 history模式
  history: createWebHistory(import.meta.env.BASE_URL)
})

export default router
