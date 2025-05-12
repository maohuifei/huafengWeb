<!-- 
  维护页面
  Template部分注释:
  - maintenance-container: 维护页面容器，设置全屏居中布局
  - maintenance-content: 维护内容区域，包含图标和文本
  - el-icon: Element Plus图标组件，显示维护图标
  - h1: 维护标题
  - p: 维护描述文本
-->
<template>
  <div class="maintenance-container">
    <div class="maintenance-content">
      <el-icon class="maintenance-icon"><Tools /></el-icon>
      <h1>维护中</h1>
      <p>该功能正在进行维护或者升级</p>
    </div>
  </div>
</template>

<!--
  Script部分注释:
  - 导入Element Plus的Tools图标组件
  - 使用Vue 3的setup语法糖
-->
<script setup lang="ts">
import { Tools } from '@element-plus/icons-vue'
</script>

<!--
  Style部分注释:
  - maintenance-container: 设置维护页面全屏布局和背景
  - maintenance-content: 维护卡片样式，包含边框和圆角
  - maintenance-icon: 维护图标样式和动画效果
  - 响应式设计: 适配不同设备屏幕
-->
<style scoped lang="less">
.maintenance-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--el-bg-color);
  padding: 2rem;
}

.maintenance-content {
  text-align: center;
  max-width: 500px;
  padding: 3rem;
  background: var(--el-bg-color-overlay);
  border-radius: 8px;
  box-shadow: var(--el-box-shadow-light);

  .maintenance-icon {
    font-size: 64px;
    color: var(--el-color-primary);
    margin-bottom: 1.5rem;
    animation: rotate 3s infinite linear;
  }

  h1 {
    font-size: 2rem;
    color: var(--el-text-color-primary);
    margin-bottom: 1rem;
  }

  p {
    color: var(--el-text-color-regular);
    margin-bottom: 0.5rem;
  }

  .action-buttons {
    margin-top: 2rem;
    display: flex;
    gap: 1rem;
    justify-content: center;
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .maintenance-container {
    padding: 1rem;
  }

  .maintenance-content {
    padding: 2rem 1rem;
    width: 90%;

    .maintenance-icon {
      font-size: 48px;
    }

    h1 {
      font-size: 1.5rem;
    }

    .action-buttons {
      flex-direction: column;
      gap: 0.5rem;
    }
  }
}
</style>