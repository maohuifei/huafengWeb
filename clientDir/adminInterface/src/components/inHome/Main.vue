<!-- 
模板部分 - 组件结构和功能说明

1. 动态组件区域(content-wrapper): 
   - 根据store.mainState值显示不同功能组件
   - 组件映射关系:
     * 2: articleManagement(文章管理)
     * 21: newArticle(新建文章)
     * 3: userManagement(用户管理)
     * 5: linkManagement(链接管理)
     * 44: categoriesSystem(分类系统)

2. 仪表盘区域(dashboard-container):
   - 默认显示当store.mainState不匹配上述值时
   - 包含:
     * 页面标题(page-header/page-title)
     * 统计卡片(stats-section/stat-card): 显示stats.articleCount
     * 最近文章列表(articles-section/article-card): 显示recentArticles数据
       - article-item: 每篇文章包含title和created_at(通过formatDate格式化)
-->
<template>
    <!-- 主内容容器 -->
    <main class="main-content">
        <!-- 动态组件区域 -->
        <div class="content-wrapper">
            <!-- 文章管理模块 -->
            <articleManagement v-if="store.mainState === 2" />
            <!-- 新建文章模块 -->
            <newArticle v-else-if="store.mainState === 21" />
            <!-- 用户管理模块 -->
            <userManagement v-else-if="store.mainState === 3" />
            <!-- 链接管理模块 -->
            <linkManagement v-else-if="store.mainState === 5" />
            <!-- 分类系统模块 -->
            <categoriesSystem v-else-if="store.mainState === 44" />
            
            <!-- 默认显示仪表盘 -->
            <div v-else class="dashboard-container">
                <!-- 页面标题区域 -->
                <div class="page-header">
                    <h2 class="page-title">仪表盘</h2>
                </div>
                
                <!-- 仪表盘内容区域 -->
                <div class="dashboard" v-loading="loading">
                    <!-- 统计卡片区域 -->
                    <div class="stats-section">
                        <!-- 文章统计卡片 -->
                        <el-card class="stat-card" shadow="hover">
                            <template #header>
                                <div class="card-header">
                                    <el-icon><Document /></el-icon>
                                    <span>文章总数</span>
                                </div>
                            </template>
                            <div class="card-value">{{ stats.articleCount }}</div>
                        </el-card>
                    </div>

                    <!-- 最近文章区域 -->
                    <div class="articles-section">
                        <el-card class="article-card" shadow="hover">
                            <template #header>
                                <div class="card-header">
                                    <span>最近文章</span>
                                </div>
                            </template>
                            <div class="article-list">
                                <!-- 文章列表项 -->
                                <div 
                                    v-for="article in recentArticles" 
                                    :key="article.id" 
                                    class="article-item"
                                >
                                    <!-- 文章标题 -->
                                    <div class="article-title" :title="article.title">
                                        {{ article.title }}
                                    </div>
                                    <!-- 文章创建时间 -->
                                    <div class="article-time">
                                        {{ formatDate(article.created_at) }}
                                    </div>
                                </div>
                                <!-- 空状态提示 -->
                                <div v-if="recentArticles.length === 0" class="empty-state">
                                    暂无文章
                                </div>
                            </div>
                        </el-card>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { Document } from '@element-plus/icons-vue'
import { myStore } from '@/stores'
import http from '@/axios'

// 组件导入
import articleManagement from '../articleManagement/index.vue'
import userManagement from '../userManagement/index.vue'
import linkManagement from '../linkManagement/index.vue'
// import articleSystem from '../systemManagement/articleSystem.vue';
// import userSystem from '../systemManagement/userSystem.vue';
// import webSystem from '../systemManagement/webSystem.vue';
import newArticle from '../articleManagement/newArticle.vue'
import categoriesSystem from '../systemManagement/categoriesSystem.vue'

// 类型定义
/*
脚本部分 - 核心功能说明

1. 状态管理:
   - store: 使用myStore()管理应用状态
   - stats: 响应式数据，存储文章统计信息(articleCount)
   - recentArticles: 响应式数组，存储最近文章列表
   - loading: 加载状态控制

2. 核心方法:
   - fetchDashboardData(): 异步获取仪表盘数据
     * 调用API: 'article/list'
     * 参数: page=1, pageSize=10
     * 处理逻辑: 排序文章按created_at降序，取前5条
   - formatDate(): 格式化日期为'YYYY-MM-DD'格式

3. 生命周期:
   - onMounted: 组件挂载时自动调用fetchDashboardData()
*/
interface Article {
    id: number
    title: string
    content: string
    abstract: string
    category: string
    state: boolean
    created_at: string
    updated_at: string
}

interface DashboardStats {
    articleCount: number
}

interface ApiResponse<T> {
    success: boolean
    data: T
    totalCount?: number
    message?: string
}

// 状态管理
const store = myStore()
const stats = ref<DashboardStats>({
    articleCount: 0
})
const recentArticles = ref<Article[]>([])
const loading = ref(false)

// 获取仪表盘数据
const fetchDashboardData = async () => {
    loading.value = true
    try {
        const response = await http.get<ApiResponse<Article[]>>('article/list', {
            params: {
                page: 1,
                pageSize: 10
            }
        })
        
        if (!response.data?.success) {
            throw new Error(response.data.message || '获取数据失败')
        }
        
        const articles = response.data.data
        stats.value.articleCount = response.data.totalCount || articles.length
        recentArticles.value = articles
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 5)
    } catch (error) {
        console.error('获取仪表盘数据失败:', error)
    } finally {
        loading.value = false
    }
}

// 格式化日期
const formatDate = (dateStr: string) => {
    try {
        const date = new Date(dateStr)
        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        })
    } catch {
        return dateStr
    }
}

// 初始化
onMounted(() => {
    fetchDashboardData()
})
</script>

<!-- 
样式部分 - 详细样式规则

1. 主内容区域(main-content):
   - 宽度/高度: 100%
   - 背景: 使用Element Plus变量(--el-bg-color)

2. 仪表盘容器(dashboard-container):
   - 布局: 网格布局(grid)
   - 间距: gap=24px
   - 响应式: 移动端调整为16px间距和单列布局

3. 统计卡片(stat-card):
   - 悬停效果: translateY(-2px)
   - 数值样式: 36px字体，居中显示

4. 文章列表(article-card):
   - 文章项(article-item): 悬停背景色(--el-fill-color-light)
   - 标题(article-title): 单行省略显示
   - 时间(article-time): 次要文本色(--el-text-color-secondary)

5. 响应式设计:
   - 小于768px时调整间距和字体大小
-->
<style lang="less" scoped>
/* 主内容区域样式 */
.main-content {
    width: 100%;  /* 宽度100% */
    height: 100%; /* 高度100% */
    background-color: var(--el-bg-color); /* 使用Element Plus背景色变量 */
    
    /* 内容容器 */
    .content-wrapper {
        height: 100%; /* 高度100% */
    }
}

/* 仪表盘容器样式 */
.dashboard-container {
    padding: 20px; /* 内边距 */
    
    /* 页面标题区域 */
    .page-header {
        margin-bottom: 24px; /* 底部外边距 */
        
        /* 页面标题 */
        .page-title {
            margin: 0; /* 清除默认外边距 */
            font-size: 1.5em; /* 字体大小 */
            color: var(--el-text-color-primary); /* 使用Element Plus主文本色 */
        }
    }
}

/* 仪表盘网格布局 */
.dashboard {
    display: grid; /* 网格布局 */
    gap: 24px; /* 网格间距 */
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); /* 自适应列宽 */
    
    /* 统计卡片区域 */
    .stats-section {
        /* 统计卡片 */
        .stat-card {
            transition: transform 0.3s ease; /* 悬停动画过渡效果 */
            
            /* 悬停效果 */
            &:hover {
                transform: translateY(-2px); /* 上移2像素 */
            }
            
            /* 卡片头部 */
            .card-header {
                display: flex;
                align-items: center;
                gap: 8px;
                color: var(--el-text-color-primary);
                
                .el-icon {
                    font-size: 18px;
                }
            }
            
            .card-value {
                font-size: 36px;
                font-weight: 600;
                color: var(--el-text-color-primary);
                text-align: center;
                padding: 24px 0;
            }
        }
    }
    
    .articles-section {
        .article-card {
            height: 100%;
            transition: transform 0.3s ease;
            
            &:hover {
                transform: translateY(-2px);
            }
            
            .article-list {
                padding: 12px 0;
                
                .article-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px 20px;
                    transition: all 0.3s ease;
                    border-radius: 4px;
                    
                    &:hover {
                        background-color: var(--el-fill-color-light);
                    }
                    
                    .article-title {
                        flex: 1;
                        font-size: 14px;
                        color: var(--el-text-color-primary);
                        margin-right: 16px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                    
                    .article-time {
                        font-size: 13px;
                        color: var(--el-text-color-secondary);
                        flex-shrink: 0;
                    }
                }
                
                .empty-state {
                    text-align: center;
                    padding: 24px;
                    color: var(--el-text-color-secondary);
                    font-size: 14px;
                }
            }
        }
    }
}

// 响应式设计
@media screen and (max-width: 768px) {
    .dashboard-container {
        padding: 16px;
    }
    
    .dashboard {
        gap: 16px;
        grid-template-columns: 1fr;
        
        .stats-section {
            .stat-card {
                .card-value {
                    font-size: 28px;
                    padding: 16px 0;
                }
            }
        }
        
        .articles-section {
            .article-card {
                .article-list {
                    .article-item {
                        padding: 10px 16px;
                        
                        .article-title {
                            font-size: 13px;
                        }
                        
                        .article-time {
                            font-size: 12px;
                        }
                    }
                }
            }
        }
    }
}
</style>