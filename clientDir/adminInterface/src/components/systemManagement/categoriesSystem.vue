<!-- 
类别系统页面模板部分
功能：展示类别列表并提供管理操作

组件结构说明:
1. page-container - 页面容器
2. page-header - 头部区域
   - page-title - 标题文本
   - el-button - 添加类别按钮
3. page-content - 主要内容区域
   - table-container - 表格容器
     - el-table - 类别表格
       - el-table-column - 表格列定义
         - name: 类别名称列
         - type: 类别类型列
         - 操作列: 包含删除按钮
4. el-dialog - 添加类别弹窗
   - el-form - 表单区域
     - el-form-item - 表单项
       - name: 类型名称输入框
       - type: 类型类别输入框
   - footer - 底部按钮区域

方法绑定说明:
- handleAdd(): 添加类别
- handleDelete(row): 删除类别
- handleCancel(): 取消添加
- handleSubmit(): 提交添加
-->
<template>
    <div class="page-container">
        <div class="page-header">
            <h2 class="page-title">类别配置</h2>
            <el-button type="dark" :icon="Plus" @click="handleAdd">添加类别</el-button>
        </div>
        <div class="page-content">
            <div class="table-container">
                <el-table 
                    v-loading="loading"
                    :data="tableData" 
                    class="categories-table"
                    :style="{ width: '100%' }"
                >
                    <el-table-column prop="name" label="类别名称" min-width="200">
                        <template #default="{ row }">
                            <span class="category-name">{{ row.name }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="type" label="类别类型" min-width="200">
                        <template #default="{ row }">
                            <el-tag size="large" :type="row.type ? '' : 'info'">{{ row.type }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="150">
                        <template #default="scope">
                            <div class="operation-btns">
                                <el-button 
                                    type="danger" 
                                    :icon="Delete" 
                                    @click="handleDelete(scope.row)"
                                    size="small"
                                >删除</el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>

    <el-dialog 
        v-model="newSystemWin" 
        title="添加类别"
        width="500px"
        destroy-on-close
        class="category-dialog"
    >
        <el-form 
            :model="addSystemData" 
            ref="formRef" 
            :rules="rules"
            label-width="100px"
            class="category-form"
        >
            <el-form-item label="类型名称" prop="name">
                <el-input 
                    v-model="addSystemData.name" 
                    placeholder="请输入类型名称"
                    clearable
                />
            </el-form-item>
            <el-form-item label="类型类别" prop="type">
                <el-input 
                    v-model="addSystemData.type" 
                    placeholder="请输入类型类别"
                    clearable
                />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <button class="cancel-button" @click="handleCancel">取消</button>
                <el-button type="dark" @click="handleSubmit" :loading="submitting">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang='ts' setup>
import { ref, onMounted } from 'vue';
import { Plus, Delete } from '@element-plus/icons-vue';
import { myStore } from '@/stores';
import { ElMessage, ElMessageBox } from 'element-plus';
import http from '@/axios';
import type { FormInstance, FormRules } from 'element-plus'

/**
 * 类别数据结构
 * @property {number} id - 类别ID
 * @property {string} name - 类别名称
 * @property {string} type - 类别类型
 */
interface Category {
    id: number
    name: string
    type: string
}

/**
 * 类别表单数据结构
 * @property {string} name - 类型名称
 * @property {string} type - 类型类别
 */
interface CategoryForm {
    name: string
    type: string
}

/**
 * API响应数据结构
 * @template T - 数据类型
 * @property {boolean} success - 请求是否成功
 * @property {T} data - 返回数据
 * @property {string} [message] - 可选错误信息
 */
interface ApiResponse<T> {
    success: boolean
    data: T
    message?: string
}

// 状态管理
const store = myStore() // 全局状态管理
const formRef = ref<FormInstance>() // 表单引用
const loading = ref(false) // 表格加载状态
const submitting = ref(false) // 表单提交状态
const tableData = ref<Category[]>([]) // 表格数据
const newSystemWin = ref(false) // 添加弹窗可见性
const addSystemData = ref<CategoryForm>({ // 添加表单数据
    name: '',
    type: ''
})

/**
 * 表单验证规则
 * @property {Array} name - 名称验证规则
 *   - 必填
 *   - 长度2-20字符
 * @property {Array} type - 类型验证规则
 *   - 必填
 *   - 长度2-20字符
 */
const rules: FormRules = {
    name: [
        { required: true, message: '请输入类型名称', trigger: 'blur' },
        { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    type: [
        { required: true, message: '请输入类型类别', trigger: 'blur' },
        { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ]
}

// 获取类别列表
const getList = async (params?: any) => {
    loading.value = true
    try {
        const response = await http.get<ApiResponse<Category[]>>('categories/list', { 
            params 
        })
        
        if (!response.data.success) {
            throw new Error(response.data.message || '获取类别列表失败')
        }
        
        tableData.value = response.data.data
    } catch (error) {
        console.error('获取类别列表失败:', error)
        tableData.value = []
        ElMessage.error('获取类别列表失败')
    } finally {
        loading.value = false
    }
}

// 删除类别
const handleDelete = async (category: Category) => {
    try {
        await ElMessageBox.confirm(
            `确定要删除类别"${category.name}"吗？`,
            '警告',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }
        )
        
        const response = await http.delete<ApiResponse<void>>(`/categories/delete/${category.id}`)
        
        if (!response.data.success) {
            throw new Error(response.data.message || '删除类别失败')
        }
        
        ElMessage.success('删除成功')
        getList()
    } catch (error) {
        if (error !== 'cancel') {
            console.error('删除类别失败:', error)
            ElMessage.error('删除失败')
        }
    }
}

// 添加类别
const handleAdd = () => {
    addSystemData.value = {
        name: '',
        type: ''
    }
    newSystemWin.value = true
}

// 取消添加
const handleCancel = () => {
    formRef.value?.resetFields()
    newSystemWin.value = false
}

// 提交添加
const handleSubmit = async () => {
    if (!formRef.value) return
    
    try {
        await formRef.value.validate()
        submitting.value = true
        
        const response = await http.post<ApiResponse<void>>('/categories/add', addSystemData.value)
        
        if (!response.data.success) {
            throw new Error(response.data.message || '添加类别失败')
        }
        
        ElMessage.success('添加成功')
        handleCancel()
        getList()
    } catch (error) {
        if (error instanceof Error) {
            console.error('添加类别失败:', error)
            ElMessage.error(error.message)
        }
    } finally {
        submitting.value = false
    }
}

// 初始化
onMounted(() => {
    getList()
})
</script>

<!-- 
类别系统页面样式部分
功能：定义页面布局和样式

样式说明:
1. categories-table - 类别表格样式
   - el-table__header: 表头背景色
   - el-table__row: 行过渡动画
2. category-name - 类别名称样式
   - 字体粗细500
   - 主要文本颜色
3. operation-btns - 操作按钮区域
   - flex布局
   - 8px间距
   - 居中对齐
4. el-tag - 标签样式
   - 固定高度32px
   - 内边距0 12px
5. el-dialog - 弹窗样式
   - el-dialog__header: 头部样式
     - 无外边距
     - 内边距20px 24px
     - 底部边框
   - el-dialog__title: 标题样式
     - 字体大小18px
     - 字体粗细600
     - 主要文本颜色
-->
<style scoped lang="less">
.categories-table {
    :deep(.el-table__header) {
        background-color: var(--primary-bg);
    }

    :deep(.el-table__row) {
        transition: all var(--transition-fast);
    }
}

.category-name {
    font-weight: 500;
    color: var(--text-primary);
}

.operation-btns {
    display: flex;
    gap: 8px;
    justify-content: center;
}

:deep(.el-tag) {
    height: 32px;
    line-height: 32px;
    padding: 0 12px;
}

:deep(.el-dialog) {
    .el-dialog__header {
        margin: 0;
        padding: 20px 24px;
        border-bottom: 1px solid var(--border-color);

        .el-dialog__title {
            font-size: 18px;
            font-weight: 600;
            color: var(--text-primary);
        }
    }
}
</style>