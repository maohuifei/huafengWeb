/**
 * 用户界面路由配置
 * 功能：定义用户界面的所有路由规则和导航逻辑
 * 设计意图：
 * - 使用Vue Router实现SPA路由管理
 * - 采用懒加载优化性能
 * - 包含基础路由和404处理
 */
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  // 使用HTML5 history模式
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 首页路由
    {
      path: '/',
      name: '首页',
      component: () => import('@/views/HomeView.vue'),  // 懒加载首页组件
    },
    // 文章列表路由
    {
      path: '/article',
      name: '文章',
      component: () => import('@/views/ArticleView.vue')  // 懒加载文章列表组件
    },
    // 文章详情路由
    {
      path:'/articleParticulars',
      name:"文章详情",
      component:() => import('@/components/ArticleParticulars.vue')  // 懒加载文章详情组件
    },
    // 关于页面路由
    {
      path: '/about',
      name: '关于',
      component: () => import('@/views/AboutView.vue')  // 懒加载关于页面组件
    },
    // 隐私政策路由
    {
      path: '/privacy',
      name: '隐私政策',
      component: () => import('@/views/PrivacyView.vue')  // 懒加载隐私政策组件
    },
    // 系统维护路由
    {
      path: '/maintenance',
      name: '维护中',
      component: () => import('@/views/MaintenanceView.vue')  // 懒加载维护页面组件
    },
    // 404路由（必须放在最后）
    {
      path: '/:pathMatch(.*)*',  // 匹配所有未定义的路由
      name: '404',
      component: () => import('@/views/NotFoundView.vue')  // 懒加载404组件
    }
  ],
  // 页面滚动行为控制
  scrollBehavior(to, from, savedPosition) {
    // 始终滚动到顶部
    return { top: 0 }
  }
})

export default router
