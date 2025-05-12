<!-- 
   404页面
   Template部分注释:
   - not-found-container: 404页面容器，设置全屏居中布局
   - not-found-content: 404内容区域，包含错误码和操作按钮
   - error-code: 404错误码显示
   - h1: 404标题
   - p: 404描述文本
   - el-button: Element Plus按钮组件，提供返回操作
-->
<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <div class="error-code">404</div>
      <h1>页面不存在</h1>
      <p>您请求的页面未找到或无权限访问。</p>
      <div class="action-buttons">
        <el-button type="primary" @click="$router.push('/home')">
          返回首页
        </el-button>
        <el-button @click="$router.go(-1)">返回上页</el-button>
      </div>
    </div>
  </div>
</template>

<!--
   Style部分注释:
   - not-found-container: 设置404页面全屏布局和背景
   - not-found-content: 404卡片样式，包含边框和圆角
   - error-code: 404错误码样式
   - 响应式设计: 适配不同设备屏幕
-->
<style scoped lang="less">
.not-found-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--el-bg-color);
  padding: 2rem;
}

.not-found-content {
  text-align: center;
  max-width: 500px;
  padding: 3rem;
  background: var(--el-bg-color-overlay);
  border-radius: 8px;
  box-shadow: var(--el-box-shadow-light);

  .error-code {
    font-size: 6rem;
    font-weight: bold;
    color: var(--el-color-primary);
    line-height: 1;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 0px var(--el-color-primary-light-3);
  }

  h1 {
    font-size: 2rem;
    color: var(--el-text-color-primary);
    margin-bottom: 1rem;
  }

  p {
    color: var(--el-text-color-regular);
    margin-bottom: 2rem;
  }

  .action-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .not-found-container {
    padding: 1rem;
  }

  .not-found-content {
    padding: 2rem 1rem;
    width: 90%;

    .error-code {
      font-size: 4rem;
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