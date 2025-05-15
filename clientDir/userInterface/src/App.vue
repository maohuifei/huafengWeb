<!-- 
主应用模板 - 包含整个应用的布局结构
1. tage_box: 顶部导航栏，包含logo和占位空间
   - logo_box: 包含网站logo的容器
   - placeholder: 右侧占位空间，保持布局平衡
2. menu-toggle: 菜单切换按钮
   - hamburger: 三条横线组成的菜单图标
   - active状态: 点击后变为X图标
3. nav_box: 侧边导航菜单
   - nav-content: 导航链接容器
   - 包含首页、文章、关于、声明四个路由链接
4. content_box: 主内容区域
   - 使用router-view显示当前路由组件
   - 包含页面切换的淡入淡出过渡动画
5. icon_box: 滚动控制按钮
   - 根据滚动位置显示向上或向下箭头
   - 点击后平滑滚动到页面顶部或底部
6. foot_box: 页脚信息
   - 包含版权信息和备案号
-->
<template>
  <div class="tage_box" :class="{ 'with-shadow': showNavShadow }">
    <div class="logo_box">
      <RouterLink to="/">
        <img class="logo_class" src="/portrait.png" alt="Logo" />
      </RouterLink>
    </div>

    <div class="placeholder"></div>
  </div>

  <div class="menu-toggle" @click.stop="toggleMenu" :class="{ 'active': isMenuOpen }">
    <div class="hamburger">
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>

  <div class="nav_box" :class="{ 'open': isMenuOpen }" ref="navBox" @click.stop>
    <div class="nav-content" :style="{ opacity: isMenuOpen ? 1 : 0 }">
      <RouterLink to="/" :style="{ '--i': 0 }">首页</RouterLink>
      <RouterLink to="/article" :style="{ '--i': 1 }">文章</RouterLink>
      <RouterLink to="/about" :style="{ '--i': 2 }">关于</RouterLink>
      <RouterLink to="/privacy" :style="{ '--i': 3 }">声明</RouterLink>
    </div>
  </div>

  <div style="height: 60px;"></div>

  <div class="content_box" :class="{ 'shifted': isMenuOpen }">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>

  <div class="icon_box" :class="{ 
    'scrolled': isScrolled || !isHomePage,
    'home': isHomePage,
    'hidden': !hasScroll
  }">
    <div class="icon" 
         :class="{ 'is-up': isAtBottom }" 
         @click="handleScrollClick">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 5v14M5 12l7 7 7-7"/>
      </svg>
    </div>
  </div>

  <div class="foot_box">
    <p>© 2023-2025 画风(huafeng)</p>
    <p class="beian">
      <img src="/Unknown.png" alt="工业和信息化部政务服务平台">
      <a style="line-height:100%" href="https://beian.miit.gov.cn" target="_blank">鲁ICP备2024118017号</a>
    </p>
  </div>
</template>

<!-- 
脚本部分 - 包含所有组件逻辑
1. 导入依赖
   - Vue组合式API: ref, onMounted等
   - vue-router: 路由相关功能
   - GSAP: 用于菜单和滚动按钮的动画效果
   - 状态管理: 从stores/counter导入
2. 响应式变量
   - showBackTop: 控制返回顶部按钮显示
   - isMenuOpen: 菜单展开状态
   - navBox: 导航菜单DOM引用
   - showNavShadow: 导航栏阴影显示状态
   - isScrolled: 页面是否已滚动
   - isAtBottom: 是否滚动到底部
   - hasScroll: 页面是否有滚动条
3. 计算属性
   - isHomePage: 判断当前路由是否为首页
4. 方法
   - toggleMenu: 切换菜单展开/收起状态
   - closeMenu: 关闭菜单并执行动画
   - handleClick: 处理外部点击关闭菜单
   - checkScroll: 检查滚动位置并更新状态
   - handleScrollClick: 处理滚动按钮点击
   - scrollToTop/Bottom: 平滑滚动到顶部/底部
   - checkDeviceType: 检测设备类型
5. 生命周期钩子
   - onMounted: 初始化事件监听和状态检查
   - onUnmounted: 清理事件监听
-->
<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import gsap from 'gsap'
import { myStore } from './stores/counter';

const showBackTop = ref(false)
const route = useRoute()
const isMenuOpen = ref(false)
const navBox = ref<HTMLElement | null>(null)
const showNavShadow = ref(false)
const isScrolled = ref(false)
const isAtBottom = ref(false)
const hasScroll = ref(false)

const isHomePage = computed(() => route.path === '/')

const toggleMenu = () => {
 // console.log('Toggling menu. Current state:', isMenuOpen.value);
  if (isMenuOpen.value) {
    closeMenu();
  } else {
    isMenuOpen.value = true;
   // console.log('Menu opened.');
    gsap.to('.nav-content', {
      duration: 0.2,
      opacity: 1,
      x: 0,
      ease: "power2.out"
    });
    gsap.to('.nav-content a', {
      duration: 0.2,
      opacity: 1,
      x: 0,
      stagger: 0.05,
      ease: "power2.out"
    });
    gsap.to('.content_box', {
      duration: 0.2,
      marginRight: '300px',
      ease: "power2.out"
    });
  }
};

const closeMenu = () => {
  //console.log('Closing menu. Current state:', isMenuOpen.value);
  if (!isMenuOpen.value) return;
  isMenuOpen.value = false;
  //console.log('Menu closed.');
  gsap.to('.nav-content', {
    duration: 0.2,
    opacity: 0,
    x: 300,
    ease: "power2.in"
  });
  gsap.to('.nav-content a', {
    duration: 0.2,
    opacity: 0,
    x: 20,
    stagger: 0.03,
    ease: "power2.in"
  });
  gsap.to('.content_box', {
    duration: 0.2,
    marginRight: '0px',
    ease: "power2.in"
  });
};

const handleClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  const menuToggle = document.querySelector('.menu-toggle')
  const navBox = document.querySelector('.nav_box')
  
  if (isMenuOpen.value && 
      !menuToggle?.contains(target) && 
      !navBox?.contains(target)) {
    closeMenu()
  }
}

const checkScroll = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop
  const windowHeight = window.innerHeight
  const documentHeight = document.documentElement.scrollHeight
  
  isAtBottom.value = (windowHeight + scrollTop) >= (documentHeight - 10)
  showBackTop.value = isAtBottom.value
  showNavShadow.value = scrollTop > 0
  
  if (!isScrolled.value && scrollTop > 50) {
    isScrolled.value = true
    const iconBox = document.querySelector('.icon_box')
    if (iconBox) {
      gsap.timeline()
        .to(iconBox, {
          duration: 0.3,
          scale: 0.8,
          ease: "power2.in"
        })
        .to(iconBox, {
          duration: 0.8,
          left: 'calc(100% - 64px)',
          ease: "power3.inOut"
        })
        .to(iconBox, {
          duration: 0.3,
          scale: 1,
          ease: "back.out(1.7)"
        })
        .set(iconBox, {
          left: 'auto',
          right: '20px',
          clearProps: "transform"
        })
    }
  }
}

// 修改滚动按钮点击处理
const handleScrollClick = () => {
  if (isAtBottom.value) {
    scrollToTop()
  } else {
    scrollToBottom()
  }
}

// 检查页面是否有滚动条
const checkScrollable = () => {
  hasScroll.value = document.documentElement.scrollHeight > (window.innerHeight + 20)
}

// 监听窗口大小变化
window.addEventListener('resize', checkScrollable)

// 在路由变化时检查
watch(route, () => {
  // 关闭菜单
  closeMenu()
  
  // 重置滚动按钮状态
  isScrolled.value = false
  isAtBottom.value = false
  
  // 重置按钮位置和样式
  const iconBox = document.querySelector('.icon_box')
  if (iconBox) {
    gsap.set(iconBox, {
      clearProps: 'all'
    })
  }
  
  // 等待 DOM 更新后再检查
  nextTick(() => {
    checkScrollable()
    // 初始化滚动检查
    checkScroll()
  })
})

// 在组件挂载时检查
onMounted(() => {
  checkScrollable()

  const stores = myStore()
  if(!stores.debugStart){
   // 禁用F12键
   document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'F12') e.preventDefault()
  })

  // 新增右键禁用
  document.addEventListener('contextmenu', (e: MouseEvent) => {
    e.preventDefault()
  })

  }
  

  // 检查设备类型
  if (checkDeviceType()) {
    //console.log('移动设备')
  }

  // 初始化滚动检查
  setTimeout(checkScroll, 100)
  window.addEventListener('scroll', checkScroll)

  // 添加点击事件监听
  document.addEventListener('click', handleClick)
})

onUnmounted(() => {
  window.removeEventListener('scroll', checkScroll)
  window.removeEventListener('resize', checkScrollable)
  
  // 移除点击事件监听
  document.removeEventListener('click', handleClick)
})

// 滚动到底部
const scrollToBottom = () => {
  window.scrollTo({
    top: document.documentElement.scrollHeight,
    behavior: 'smooth'
  })
}

// 返回顶部
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// 检查设备类型
const checkDeviceType = () => {
  const userAgent = navigator.userAgent.toLowerCase()
  const mobileAgents = [
    /android/i,
    /iphone|ipad|ipod/i,
    /blackberry/i,
    /iemobile/i,
    /opera mini/i,
    /windows phone/i,
    /mobile/i,
    /touch/i
  ]
  return mobileAgents.some(agent => agent.test(userAgent))
}
</script>

<!-- 样式部分 - 组件作用域样式 -->
<style scoped lang="less">
/* 
过渡动画 - 用于页面切换时的淡入淡出效果
1. fade-enter-active/fade-leave-active: 定义过渡持续时间和属性
2. fade-enter/fade-leave-to: 定义进入和离开的初始/结束状态
*/
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

/* 
导航栏样式 - 固定在顶部的导航栏
1. tage_box: 主容器，使用flex布局
2. with-shadow: 滚动时添加阴影效果
3. logo_box: logo容器，左对齐
4. placeholder: 右侧占位空间，保持布局平衡
*/
.tage_box {
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, .9);
  padding: 0 20px;
  z-index: 998;
  transition: box-shadow 0.3s ease;
  
  &.with-shadow {
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }

  .logo_box {
    flex: 1;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    a:hover {
      background-color: transparent;
    }

    .logo_class {
      width: 130px;
      height: auto;
    }
  }

  .placeholder {
    width: 44px;
  }
}

/* 
菜单按钮样式 - 汉堡菜单按钮
1. menu-toggle: 固定定位在右上角
2. hamburger: 三条横线组成的菜单图标
3. active状态: 点击后变为X图标
4. hover效果: 背景色变化
*/
.menu-toggle {
  position: fixed;
  top: 8px;
  right: 20px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1005;
  border-radius: 12px;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: black;
    .hamburger span {
      background: white;
    }
  }

  .hamburger {
    width: 26px;
    height: 22px;
    position: relative;
    
    span {
      display: block;
      position: absolute;
      height: 3px;
      width: 100%;
      background: var(--elementColor);
      border-radius: 3px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      
      &:nth-child(1) { top: 0; }
      &:nth-child(2) { top: 9.5px; }
      &:nth-child(3) { top: 19px; }
    }
  }
  
  &.active {
    .hamburger span {
      background: #ffffff;
      
      &:nth-child(1) {
        transform: rotate(45deg);
        top: 9.5px;
      }
      &:nth-child(2) {
        opacity: 0;
      }
      &:nth-child(3) {
        transform: rotate(-45deg);
        top: 9.5px;
      }
    }
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }
}

/* 导航菜单样式 */
.nav_box {
  position: fixed;
  top: 0;
  right: 0;
  width: 300px;
  height: 100%;
  background: black;
  transform: translateX(100%);
  transition: transform 0.3s ease;
  z-index: 1000;
}

.nav_box.open {
  transform: translateX(0);
}

.content_box {
  transition: margin-right 0.3s ease;
}

.content_box.shifted {
  margin-right: 300px;
}

.nav-content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 30px;
  padding-left: 10px;
  opacity: 0;
  transition: opacity 0.2s ease;
  color: white;
  text-align: center;
}

.nav_box.open .nav-content {
  opacity: 1;
}

.nav-content a {
  color: white !important;
  text-decoration: none;
  font-size: 18px;
}

.nav-content a:hover {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
}

/* 滚动控制按钮样式 */
.icon_box {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2000;
  will-change: transform;
  
  .icon {
    width: 44px;
    height: 44px;
    background: rgba(0, 0, 0, 0.8);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    animation: gentleBounce 2s infinite;
    
    svg {
      width: 24px;
      height: 24px;
      stroke: #fff;
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    &.is-up svg {
      transform: rotate(180deg);
    }

    &:hover {
      transform: scale(1.1);
      background: rgba(0, 0, 0, 0.9);
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      animation-play-state: paused;
    }
  }

  &.hidden {
    display: none;
  }
}

/* 轻柔的跳跃动画 */
@keyframes gentleBounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-6px);
  }
  60% {
    transform: translateY(-3px);
  }
}

/* 
过渡动画 - 用于页面切换时的淡入淡出效果
1. fade-enter-active/fade-leave-active: 定义过渡持续时间和属性
2. fade-enter/fade-leave-to: 定义进入和离开的初始/结束状态
*/
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* 页脚样式 */
.foot_box {
  width: 100%;
  padding: 20px 0;
  text-align: center;
  color: var(--elementColor);
  font-size: 0.9em;
  border-top: var(--systemColor) 1px solid;
  .beian{
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 5px;
  }
}
</style>
