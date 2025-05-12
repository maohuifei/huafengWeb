<!-- 
应用根组件 - 主要功能:
1. 提供路由视图容器
2. 定义全局样式覆盖
3. 定制Element Plus主题变量
-->
<script setup lang="ts">
// 无需额外的逻辑 - 所有功能通过路由和全局样式实现
</script>

<template>
  <!-- 路由视图容器 - 显示当前路由对应的组件 -->
  <router-view></router-view>
</template>

<style lang="less">
/* 
全局样式覆盖 - 优先级高于组件默认样式
1. 头部容器样式
2. Element Plus主题变量覆盖
*/
.header_box {
  background-color: var(--primary-bg) !important;
  border-bottom: 1px solid var(--border-color) !important;
}

/* 
Element Plus主题变量覆盖 - 定制UI组件样式
1. 主色调使用文本主色
2. 按钮状态样式统一
*/
:root {
  /* 主要颜色 - 使用主题定义的主文本色 */
  --el-color-primary: var(--text-primary) !important;
  
  /* 按钮样式 - 定义不同状态下的背景和边框 */
  --el-button-bg-color: var(--primary-bg) !important;
  --el-button-border-color: var(--border-color) !important;
  --el-button-hover-bg-color: var(--hover-bg) !important;
  --el-button-hover-border-color: var(--border-dark) !important;
  --el-button-active-bg-color: var(--active-bg) !important;
  --el-button-active-border-color: var(--border-dark) !important;
}
</style>
