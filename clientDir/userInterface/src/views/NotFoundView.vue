<!--
 * NotFoundView.vue - 404页面视图组件
 *
 * 功能：
 * 1. 显示404错误页面
 * 2. 提供返回首页和浏览文章的操作按钮
 *
 * 设计要点：
 * - 使用大号404错误码增强视觉冲击
 * - 背景动画效果提升用户体验
 * - 响应式布局适配不同设备
-->
<template>
  <!-- 404页面主容器 -->
  <div class="not-found-container">
    <!-- 404内容区域 -->
    <div class="not-found-content">
      <!-- 404错误码显示 -->
      <div class="error-code">404</div>
      <!-- 404标题 -->
      <h1>页面未找到</h1>
      <!-- 404描述文本 -->
      <p>抱歉，您访问的页面不存在或已被移除。</p>
      <!-- 操作按钮区域 -->
      <div class="action-buttons">
        <RouterLink to="/" class="button primary">返回首页</RouterLink>
        <RouterLink to="/article" class="button secondary">浏览文章</RouterLink>
      </div>
    </div>
    <!-- 背景动画效果 -->
    <div class="background-animation"></div>
  </div>
</template>

<!-- 组件样式区域 -->
<style scoped lang="less">
/* 404页面主容器样式 */
.not-found-container {
  min-height: calc(100vh - 180px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

/* 404内容区域样式 */
.not-found-content {
  text-align: center;
  max-width: 600px;
  padding: 3rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  z-index: 1;

  /* 404错误码样式 */
.error-code {
    font-size: 8rem;
    font-weight: 700;
    color: var(--elementColor);
    line-height: 1;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 0px var(--outElementColor);
  }

  h1 {
    font-size: 2.5rem;
    color: var(--elementColor);
    margin: 1rem 0;
  }

  p {
    color: var(--txtColor);
    font-size: 1.1rem;
    line-height: 1.6;
    margin: 1rem 0;
  }
}

/* 操作按钮区域样式 */
.action-buttons {
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
  justify-content: center;

  .button {
    padding: 0.8rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    transition: transform 0.2s;

    &:hover {
      transform: translateY(-2px);
    }

    &.primary {
      background: var(--elementColor);
      color: var(--outElementColor);
    }

    &.secondary {
      background: transparent;
      border: 2px solid var(--elementColor);
      color: var(--elementColor);
    }
  }
}

/* 背景动画效果样式 */
.background-animation {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, #f3f4f6 25%, transparent 25%),
              linear-gradient(-45deg, #f3f4f6 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #f3f4f6 75%),
              linear-gradient(-45deg, transparent 75%, #f3f4f6 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
  animation: slide 20s linear infinite;
  opacity: 0.5;
}

/* 背景滑动动画效果 */
@keyframes slide {
  from {
    background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
  }
  to {
    background-position: -20px 0, -20px 10px, -10px -10px, -30px 0px;
  }
}

/* 移动端响应式样式 */
@media (max-width: 768px) {
  /* 404页面主容器样式 */
.not-found-container {
    padding: 1rem;
  }

  /* 404内容区域样式 */
.not-found-content {
    padding: 2rem 1rem;

    /* 404错误码样式 */
.error-code {
      font-size: 6rem;
    }

    h1 {
      font-size: 2rem;
    }

    p {
      font-size: 1rem;
    }
  }

  /* 操作按钮区域样式 */
.action-buttons {
    flex-direction: column;
    gap: 0.5rem;

    .button {
      width: 100%;
    }
  }
}
</style>