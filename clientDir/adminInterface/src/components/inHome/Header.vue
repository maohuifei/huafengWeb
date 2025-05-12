<!-- 
  头部组件模板部分
  - header: 页面顶部固定导航栏容器
  - header-content: 头部内容区域，包含所有头部元素
  - logout-button: 退出登录按钮，点击触发handleLogout方法
-->
<template>
    <header class="header">
        <div class="header-content">
            <el-button class="logout-button" @click="handleLogout" title="退出登录">
                <el-icon>
                    <SwitchButton />
                </el-icon>
                <span>退出登录</span>
            </el-button>
        </div>
    </header>
</template>

<script lang="ts" setup>
/**
 * 头部组件脚本部分
 * 导入依赖:
 * - useRouter: Vue路由实例
 * - ElMessageBox: Element Plus的确认对话框组件
 * - SwitchButton: Element Plus的退出图标
 */
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { SwitchButton } from '@element-plus/icons-vue'

// 获取路由实例
const router = useRouter()

/**
 * 处理退出登录逻辑
 * 1. 显示确认对话框
 * 2. 用户确认后清除本地存储的token
 * 3. 跳转到登录页面
 * @async
 * @throws 捕获用户取消操作时不进行任何处理
 */
const handleLogout = async () => {
    try {
        await ElMessageBox.confirm(
            '确定要退出登录吗？',
            '提示',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }
        )

        localStorage.removeItem('auth_token')
        router.push('/login')
    } catch {

    }
}
</script>

<style lang="less" scoped>
/* 
  头部组件样式部分
  - .header: 头部容器样式
    - 固定定位在页面顶部
    - 黑色背景
    - 底部边框
    - 高z-index确保在最上层
*/
.header {
    /* 头部样式 */
    width: 100%;
    height: 64px;
    background-color: var(--el-color-black) !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    position: sticky;
    top: 0;
    z-index: 100;

    /* 
      .header-content: 头部内容区域样式
      - 右对齐
      - 内边距
      - flex布局
    */
    .header-content {
        height: 100%;
        padding: 0 24px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 16px;

        /* 操作按钮组样式 */
        .action-buttons {
            display: flex;
            gap: 12px;

            /* 按钮悬停效果 */
            .el-button {
                --el-button-hover-bg-color: rgba(255, 255, 255, 0.1);
                --el-button-hover-border-color: rgba(255, 255, 255, 0.2);

                &:hover {
                    transform: translateY(-1px);
                }

                &:active {
                    transform: translateY(0);
                }
            }
        }

        /* 
          .logout-button: 退出登录按钮样式
          - 透明背景
          - 白色文字
          - 悬停和点击效果
        */
        .logout-button {
            height: 36px;
            padding: 0 16px;
            font-size: 14px;
            border-radius: 4px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            background-color: transparent;
            color: rgba(255, 255, 255, 0.9);
            transition: all 0.2s ease;

            display: flex;
            align-items: center;
            gap: 8px;

            .el-icon {
                font-size: 16px;
            }

            &:hover {
                background-color: rgba(255, 255, 255, 0.1);
                border-color: rgba(255, 255, 255, 0.3);
                transform: translateY(-1px);
            }

            &:active {
                background-color: rgba(255, 255, 255, 0.15);
                transform: translateY(0);
            }
        }
    }
}

/* 移动端适配样式 */
@media screen and (max-width: 768px) {
    .header {
        .header-content {
            padding: 0 16px;

            .action-buttons {
                display: none;
            }

            .logout-button {
                padding: 0 12px;

                span {
                    display: none;
                }
            }
        }
    }
}
</style>