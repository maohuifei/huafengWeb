<!-- 
文章管理页面模板部分
功能：展示文章列表并提供管理操作

组件结构说明:
1. page-container - 页面容器
2. page-header - 页面标题区域
   - page-title - 标题文本
   - el-button - 新建文章按钮
3. page-content - 主要内容区域
   - el-table - 文章表格
     - el-table-column - 表格列定义
       - title: 文章标题列
       - category: 文章分类列
       - state: 文章状态列
       - recommend: 推荐状态列
       - 操作列: 包含四个操作按钮
4. table-pagination - 分页器区域
5. delete-dialog - 删除确认对话框

方法绑定说明:
- viewArticle(): 新建/编辑文章
- recommendBtn(): 推荐/取消推荐
- stateBtn(): 上架/下架
- deleBtn(): 删除文章
- handleCurrentChange(): 分页切换
-->
<template>
    <div class="page-container">
        <div class="page-header">
            <h2 class="page-title">文章管理</h2>
            <el-button type="dark" :icon="Plus" @click="viewArticle()">新建文章</el-button>
        </div>

        <div class="page-content">
            <el-table 
                :data="tableData" 
                v-loading="loading"
                style="width: 100%"
                class="table-container"
            >
                <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />
                <el-table-column prop="category" label="分类" width="120" />
                <el-table-column prop="state" label="状态" width="100">
                    <template #default="scope">
                        <el-tag :type="scope.row.state ? 'success' : 'info'">
                            {{ scope.row.state ? '已上架' : '已下架' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="recommend" label="推荐" width="100">
                    <template #default="scope">
                        <el-tag :type="scope.row.recommend ? 'warning' : 'info'">
                            {{ scope.row.recommend ? '已推荐' : '未推荐' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="320">
                    <template #default="scope">
                        <div class="operation-btns">
                            <el-button 
                                :type="scope.row.recommend ? 'warning' : 'info'"
                                :icon="Star"
                                size="small"
                                @click="recommendBtn(scope.row)"
                            >
                                {{ scope.row.recommend ? '取消' : '推荐' }}
                            </el-button>
                            <el-button 
                                :type="scope.row.state ? 'success' : 'danger'"
                                :icon="scope.row.state ? 'Hide' : 'View'"
                                size="small"
                                @click="stateBtn(scope.row)"
                            >
                                {{ scope.row.state ? '下架' : '上架' }}
                            </el-button>
                            <el-button 
                                type="dark" 
                                :icon="Edit"
                                size="small"
                                @click="viewArticle(scope.row)"
                            >
                                编辑
                            </el-button>
                            <el-button 
                                type="danger" 
                                :icon="Delete"
                                size="small"
                                @click="deleBtn(scope.row)"
                            >
                                删除
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页器 -->
            <div class="table-pagination">
                <el-pagination
                    background
                    @current-change="handleCurrentChange"
                    :current-page="parameter.page"
                    :page-size="parameter.pageSize"
                    layout="total, prev, pager, next"
                    :total="totalCount"
                >
                    <template #total>
                        共 {{ totalCount }} 条
                    </template>
                </el-pagination>
            </div>
        </div>

        <el-dialog 
            v-model="dialogVisible" 
            title="警告"
            :show-close="false"
            width="500px"
            class="delete-dialog"
        >
            <div class="dialog-content">
                确定要删除文章"{{ deleteArticle?.title }}"吗？
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <button 
                        class="cancel-button"
                        @click="dialogVisible = false"
                    >
                        取消
                    </button>
                    <el-button 
                        type="black" 
                        @click="handleConfirm"
                    >
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<!-- 
文章管理页面脚本部分
功能：处理文章管理相关逻辑

类型定义说明:
- Category: 分类数据结构
- Article: 文章数据结构
- PaginationParams: 分页参数
- ApiResponse: API响应格式

主要方法说明:
1. getActive(): 获取文章列表
2. getCategoryList(): 获取分类列表
3. updateCategoryNames(): 更新分类名称
4. viewArticle(article?: Article): 跳转编辑页面
5. deleBtn(article: Article): 显示删除确认
6. updateArticleStatus(article, field): 更新状态
7. stateBtn(article): 切换上架/下架
8. recommendBtn(article): 切换推荐状态
9. handleCurrentChange(page): 分页切换
10. handleConfirm(): 确认删除

状态管理说明:
- loading: 加载状态
- tableData: 表格数据
- articleList: 原始文章数据
- categoryList: 分类数据
- parameter: 分页参数
- totalCount: 总条数
- dialogVisible: 对话框可见性
- deleteArticle: 待删除文章
-->
<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus, Edit, Delete, Star, View, Hide } from '@element-plus/icons-vue';
import { myStore } from '@/stores';
import http from '@/axios';

// 类型定义
interface Category {
    id: number;
    name: string;
}

interface Article {
    id: number;
    title: string;
    categoryId: number;
    category?: string;
    state: boolean;
    recommend: boolean;
}

interface PaginationParams {
    page: number;
    pageSize: number;
}

interface ApiResponse<T> {
    success: boolean;
    data: T;
    totalCount?: number;
    message?: string;
}

// 状态定义
const store = myStore();
const loading = ref(false);
const tableData = ref<Article[]>([]);
const articleList = ref<Article[]>([]);
const categoryList = ref<Category[]>([]);
const parameter = ref<PaginationParams>({
    page: 1,
    pageSize: 20
});
const totalCount = ref(0);
const dialogVisible = ref(false);
const deleteArticle = ref<Article | null>(null);

// API 请求处理
const handleApiError = (error: any, message: string) => {
    console.error(message, error);
    ElMessage.error(message);
};

// 获取文章列表
const getActive = async () => {
    loading.value = true;
    try {
        const response = await http.get<ApiResponse<Article[]>>('article/list', {
            params: parameter.value
        });
        
        if (!response.data.success) {
            throw new Error(response.data.message || '获取文章列表失败');
        }
        
        articleList.value = response.data.data;
        totalCount.value = response.data.totalCount || 0;
        await getCategoryList();
    } catch (error) {
        handleApiError(error, '获取文章列表失败');
    } finally {
        loading.value = false;
    }
};

// 获取文章分类列表
const getCategoryList = async () => {
    try {
        const response = await http.get<ApiResponse<Category[]>>('categories/list', { 
            params: { type: "文章分类" } 
        });
        
        if (!response.data.success) {
            throw new Error(response.data.message || '获取分类列表失败');
        }
        
        categoryList.value = response.data.data;
        updateCategoryNames();
    } catch (error) {
        handleApiError(error, '获取分类列表失败');
    }
};

// 更新文章列表中的分类名称
const updateCategoryNames = () => {
    tableData.value = articleList.value.map(article => ({
        ...article,
        category: categoryList.value.find(cat => cat.id === article.categoryId)?.name || '未分类'
    }));
};

// 跳转到文章编辑页面
const viewArticle = (article?: Article) => {
    store.articleNewOrEdit = article ? article.id : 0;
    store.updataMainStateFun(21);
};

// 删除文章
const deleBtn = (article: Article) => {
    deleteArticle.value = article;
    dialogVisible.value = true;
};

// 更新文章状态
const updateArticleStatus = async (article: Article, field: 'state' | 'recommend') => {
    try {
        const response = await http.put<ApiResponse<void>>('article/put', {
            id: article.id,
            [field]: !article[field]
        });
        
        if (!response.data.success) {
            throw new Error(response.data.message || `修改${field === 'state' ? '状态' : '推荐状态'}失败`);
        }
        
        ElMessage.success(`修改${field === 'state' ? '状态' : '推荐状态'}成功`);
        getActive();
    } catch (error) {
        handleApiError(error, `修改${field === 'state' ? '状态' : '推荐状态'}失败`);
    }
};

// 切换文章状态（上架/下架）
const stateBtn = (article: Article) => updateArticleStatus(article, 'state');

// 切换文章推荐状态
const recommendBtn = (article: Article) => updateArticleStatus(article, 'recommend');

// 分页切换
const handleCurrentChange = (page: number) => {
    parameter.value.page = page;
    getActive();
};

// 初始化
onMounted(() => {
    getActive();
});

const handleConfirm = async () => {
    try {
        if (deleteArticle.value) {
            const response = await http.delete(`article/delete/${deleteArticle.value.id}`);
            
            if (response.data.success) {
                ElMessage.success('删除成功');
                await getActive();
            } else {
                throw new Error(response.data.message || '删除失败');
            }
        }
    } catch (error) {
        handleApiError(error, '删除文章失败');
    } finally {
        dialogVisible.value = false;
    }
};
</script>

<!-- 
文章管理页面样式部分
功能：定义页面布局和组件样式

样式作用域说明:
1. page-container: 页面整体布局
2. page-header: 标题区域样式
3. page-content: 内容区域样式
4. table-container: 表格容器样式
5. el-table: 表格全局样式
6. el-tag: 标签样式
7. operation-btns: 操作按钮组
8. table-pagination: 分页器样式
9. delete-dialog: 删除对话框样式
10. dialog-content: 对话框内容
11. cancel-button: 取消按钮

特殊样式说明:
- :deep(.el-table): 深度选择器修改element-plus表格样式
- var(--xxx): 使用CSS变量统一主题
-->
<style scoped lang="less">
.page-container {
    padding: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    flex-shrink: 0;

    .page-title {
        font-size: 20px;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0;
    }
}

.page-content {
    background-color: var(--primary-bg);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    padding: 24px;
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
}

.table-container {
    flex: 1;
    min-height: 0;
    margin-bottom: 16px;
    border-bottom: 1px solid var(--border-color);
}

:deep(.el-table) {
    height: 100%;
    
    .el-table__inner-wrapper {
        height: 100%;
    }
    
    .el-table__body-wrapper {
        overflow-y: auto;
        
        &::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }
        
        &::-webkit-scrollbar-thumb {
            border-radius: 3px;
            background-color: rgba(0, 0, 0, 0.1);
            
            &:hover {
                background-color: rgba(0, 0, 0, 0.2);
            }
        }
        
        &::-webkit-scrollbar-track {
            background-color: transparent;
        }
    }

    .el-table__fixed-right {
        height: 100% !important;
        bottom: 0 !important;
        
        .el-table__fixed-body-wrapper {
            height: 100% !important;
            background-color: var(--primary-bg);
        }
    }
}

:deep(.el-table) {
    --el-table-border-color: var(--border-color);
    --el-table-header-bg-color: var(--secondary-bg);
    --el-table-row-hover-bg-color: var(--hover-bg);
    
    .el-table__header-wrapper {
        th {
            background-color: var(--secondary-bg);
            font-weight: 600;
            color: var(--text-primary);
        }
    }
}

:deep(.el-tag) {
    width: 45px;
    text-align: center;
    padding: 0 4px;
}

.operation-btns {
    display: flex;
    gap: 4px;
    justify-content: flex-start;

    .el-button {
        margin: 0 !important;
        padding: 4px 6px;
        font-size: 12px;
        
        .el-icon {
            margin-right: 2px;
            font-size: 12px;
        }
    }
}

.table-pagination {
    padding: 16px 0 0 0;
    display: flex;
    justify-content: center;
    border-top: none;
}

:deep(.el-pagination) {
    justify-content: center;
    
    .el-pagination__total {
        font-size: 14px;
        color: var(--text-secondary);
    }
}

.dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    
    .el-button {
        margin: 0;
        min-width: 80px;
        
        &.el-button--black {
            --el-button-bg-color: var(--el-color-black);
            --el-button-border-color: var(--el-color-black);
            --el-button-hover-bg-color: var(--el-color-black);
            --el-button-hover-border-color: var(--el-color-black);
            --el-button-active-bg-color: var(--el-color-black);
            --el-button-active-border-color: var(--el-color-black);
            --el-button-text-color: var(--el-color-white);
        }
    }
}

.delete-dialog {
    :deep(.el-dialog) {
        border-radius: 8px;
        overflow: hidden;
        
        .el-dialog__header {
            margin: 0;
            padding: 20px 24px;
            border-bottom: 1px solid var(--el-border-color-lighter);
            
            .el-dialog__title {
                font-size: 18px;
                font-weight: 600;
                color: var(--el-text-color-primary);
            }
        }
        
        .el-dialog__body {
            padding: 24px;
        }
        
        .el-dialog__footer {
            padding: 16px 24px;
            border-top: 1px solid var(--el-border-color-lighter);
        }
    }
}

.dialog-content {
    font-size: 16px;
    color: var(--el-text-color-primary);
}

.cancel-button {
    min-width: 80px;
    height: 36px;
    padding: 0 16px;
    background-color: var(--el-bg-color);
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
    color: var(--el-text-color-regular);
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        border-color: var(--el-border-color-darker);
        color: var(--el-text-color-primary);
    }
}
</style>