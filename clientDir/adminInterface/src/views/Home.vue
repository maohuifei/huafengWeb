<!-- 
   主页
   Template部分注释:
   - app-container: 应用容器，设置全屏布局
   - main-container: 主内容容器，包含布局结构
   - el-container: Element Plus布局容器
   - Aside: 侧边栏组件
   - Header: 顶部导航栏组件
   - Main: 主内容区域组件
-->
<template>
    <div class="app-container">
        <div class="main-container">
            <el-container>
                <Aside />
                <el-container>
                    <el-header height="64px" style="padding: 0;">
                        <Header />
                    </el-header>
                    <el-main>
                        <Main />
                    </el-main>
                </el-container>
            </el-container>
        </div>
    </div>
</template>

<script setup lang="ts">
/*
  Script部分注释:
  - Aside: 导入侧边栏组件
  - Header: 导入顶部导航栏组件
  - Main: 导入主内容区域组件
  - onMounted: 生命周期钩子，检查用户登录状态
  - router: 路由实例，用于页面跳转
*/
import Aside from '../components/inHome/Aside.vue'
import Header from '../components/inHome/Header.vue'
import Main from '../components/inHome/Main.vue'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
        router.push('/login')
    }
})
</script>

<style lang="less" scoped>
/*
  Style部分注释:
  - app-container: 应用容器样式，设置全屏和背景
  - main-container: 主内容容器样式
  - el-container相关样式: 布局容器样式
  - el-main: 主内容区域样式
*/
.app-container {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background-color: #ffffff;
}

.main-container {
    width: 100%;
    height: 100%;

    .el-container {
        height: 100%;
    }

    .el-main {
        padding: var(--spacing-lg);
        background-color: #ffffff;
        height: calc(100vh - 64px);
        overflow-y: auto;
    }
}
</style>