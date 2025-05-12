<!-- 
个人信息管理页面模板部分
功能：展示用户信息并提供编辑功能

组件结构说明:
1. page-container - 页面容器
2. page-header - 头部区域
   - page-title - 页面标题
   - el-button - 编辑按钮
3. page-content - 主要内容区域
   - user-info - 用户信息展示区
     - el-avatar - 用户头像
     - info-content - 信息内容区
       - info-item - 信息项
         - label: 信息标签
         - span: 信息值
4. el-dialog - 编辑对话框
   - el-form - 表单区域
     - el-form-item - 表单项
       - username: 用户名输入框
       - password: 密码输入框
       - nickname: 昵称输入框
       - avatar: 头像URL输入框
       - declaration: 个人简介输入框
       - address: 地址输入框
       - position: 职位输入框
   - footer - 底部按钮区域

方法绑定说明:
- handleEdit(): 打开编辑对话框
-->
<template>
    <div class="page-container">
        <div class="page-header">
            <h2 class="page-title">个人信息管理</h2>
            <el-button type="black" @click="handleEdit" :icon="Edit">编辑信息</el-button>
        </div>
        <div class="page-content" v-loading="loading">
            <div class="user-info">
                <el-avatar 
                    :size="120" 
                    :src="userInfo.avatar" 
                    :icon="Avatar"
                    class="user-avatar"
                />
                <div class="info-content">
                    <div class="info-item">
                        <label>用户名：</label>
                        <span>{{ userInfo.username }}</span>
                    </div>
                    <div class="info-item">
                        <label>昵称：</label>
                        <span v-if="userInfo.nickname">{{ userInfo.nickname }}</span>
                        <span v-else class="empty-value">未设置</span>
                    </div>
                    <div class="info-item">
                        <label>个人简介：</label>
                        <span v-if="userInfo.declaration">{{ userInfo.declaration }}</span>
                        <span v-else class="empty-value">暂无简介</span>
                    </div>
                    <div class="info-item">
                        <label>地址：</label>
                        <span v-if="userInfo.address">{{ userInfo.address }}</span>
                        <span v-else class="empty-value">未设置</span>
                    </div>
                    <div class="info-item">
                        <label>职位：</label>
                        <span v-if="userInfo.position">{{ userInfo.position }}</span>
                        <span v-else class="empty-value">未设置</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 编辑信息对话框 -->
    <el-dialog 
        v-model="editDialog" 
        title="编辑个人信息"
        width="500px"
        destroy-on-close
        class="edit-dialog"
    >
        <el-form 
            ref="formRef"
            :model="editForm" 
            :rules="formRules"
            label-width="100px"
            class="edit-form"
        >
            <el-form-item label="用户名" prop="username">
                <el-input 
                    v-model="editForm.username" 
                    placeholder="请输入用户名"
                    maxlength="20"
                    show-word-limit
                />
            </el-form-item>

            <el-form-item label="密码" prop="password">
                <el-input 
                    v-model="editForm.password" 
                    type="password" 
                    placeholder="如需修改密码请输入新密码"
                    show-password 
                    maxlength="20"
                />
            </el-form-item>

            <el-form-item label="昵称" prop="nickname">
                <el-input 
                    v-model="editForm.nickname" 
                    placeholder="请输入昵称"
                    maxlength="20"
                    show-word-limit
                />
            </el-form-item>

            <el-form-item label="头像" prop="avatar">
                <el-input 
                    v-model="editForm.avatar" 
                    placeholder="请输入头像URL"
                />
            </el-form-item>

            <el-form-item label="个人简介" prop="declaration">
                <el-input 
                    v-model="editForm.declaration" 
                    type="textarea" 
                    :rows="3"
                    placeholder="请输入个人简介"
                    maxlength="200"
                    show-word-limit
                />
            </el-form-item>

            <el-form-item label="地址" prop="address">
                <el-input 
                    v-model="editForm.address" 
                    placeholder="请输入地址"
                />
            </el-form-item>

            <el-form-item label="职位" prop="position">
                <el-input 
                    v-model="editForm.position" 
                    placeholder="请输入职位"
                />
            </el-form-item>
        </el-form>

        <template #footer>
            <span class="dialog-footer">
                <button 
                    class="cancel-button"
                    @click="handleCancel"
                >
                    取消
                </button>
                <el-button 
                    type="black" 
                    @click="handleSubmit" 
                    :loading="submitting"
                >
                    确定
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<!-- 
个人信息管理页面脚本部分
功能：处理用户信息相关逻辑

类型定义说明:
- UserInfo: 用户信息数据结构
  - id: 用户ID
  - username: 用户名
  - nickname: 昵称
  - avatar: 头像URL
  - declaration: 个人简介
  - address: 地址
  - position: 职位
- EditForm: 编辑表单数据结构
  - 继承UserInfo所有字段
  - 新增password字段
- ApiResponse: API响应格式

主要方法说明:
1. getUserIdFromToken(): 从token解析用户ID
2. getUserInfo(): 获取用户信息
3. handleEdit(): 初始化编辑表单
4. handleCancel(): 取消编辑
5. handleSubmit(): 提交编辑

状态管理说明:
- store: 全局状态
- formRef: 表单引用
- loading: 加载状态
- submitting: 提交状态
- editDialog: 对话框可见性
- userInfo: 用户信息
- editForm: 编辑表单
- formRules: 表单验证规则
-->
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Edit, Avatar } from '@element-plus/icons-vue'
import http from '@/axios'
import { myStore } from '@/stores'
import type { FormInstance, FormRules } from 'element-plus'

// 类型定义
interface UserInfo {
    id: number
    username: string
    nickname: string
    avatar: string
    declaration: string
    address: string
    position: string
}

interface EditForm extends Omit<UserInfo, 'id'> {
    id: number
    password: string
}

interface ApiResponse<T> {
    success: boolean
    data: T
    message?: string
}

// 状态管理
const store = myStore()
const formRef = ref<FormInstance>()
const loading = ref(false)
const submitting = ref(false)
const editDialog = ref(false)

// 用户信息
const userInfo = ref<UserInfo>({
    id: 0,
    username: '',
    nickname: '',
    avatar: '',
    declaration: '',
    address: '',
    position: ''
})

// 编辑表单
const editForm = ref<EditForm>({
    id: 0,
    username: '',
    password: '',
    nickname: '',
    avatar: '',
    declaration: '',
    address: '',
    position: ''
})

// 表单验证规则
const formRules: FormRules = {
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
    ],
    password: [
        { min: 6, message: '密码长度不能小于6个字符', trigger: 'blur' }
    ],
    nickname: [
        { max: 20, message: '昵称不能超过20个字符', trigger: 'blur' }
    ],
    declaration: [
        { max: 200, message: '个人简介不能超过200个字符', trigger: 'blur' }
    ]
}

// 从token中获取用户ID
const getUserIdFromToken = (): number => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
        throw new Error('未登录，请先登录')
    }
    
    try {
        const base64Url = token.split('.')[1]
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        const payload = JSON.parse(window.atob(base64))
        
        if (!payload.id) {
            throw new Error('token无效，请重新登录')
        }
        
        return payload.id
    } catch (error) {
        throw new Error('token解析失败，请重新登录')
    }
}

// 获取用户信息
const getUserInfo = async () => {
    loading.value = true
    try {
        const userId = getUserIdFromToken()
        console.log('获取用户信息，用户ID:', userId)
        
        const response = await http.get<ApiResponse<UserInfo>>('user/query', {
            params: { id: userId }
        })
        
        console.log('API响应:', response.data)
        
        // 不再检查 success 字段，因为后端总是返回 success: true
        const data = response.data.data
        if (!data) {
            throw new Error('未找到用户信息')
        }

        // console.log('用户信息数据:', data)
        userInfo.value = data
        // console.log('更新后的用户信息:', userInfo.value)
    } catch (error) {
        console.error('获取用户信息出错:', error)
        // 只有在真正的错误情况下才显示错误消息
        if (error instanceof Error && 
            error.message !== '查询用户信息成功' && 
            error.message !== '未找到用户信息') {
            ElMessage.error(error.message)
        }
    } finally {
        loading.value = false
    }
}

// 打开编辑对话框
const handleEdit = () => {
    editForm.value = {
        id: userInfo.value.id,
        username: userInfo.value.username,
        password: '',
        nickname: userInfo.value.nickname,
        avatar: userInfo.value.avatar,
        declaration: userInfo.value.declaration,
        address: userInfo.value.address,
        position: userInfo.value.position
    }
    editDialog.value = true
}

// 取消编辑
const handleCancel = () => {
    formRef.value?.resetFields()
    editDialog.value = false
}

// 提交编辑
const handleSubmit = async () => {
    if (!formRef.value) return
    
    try {
        await formRef.value.validate()
        submitting.value = true
        
        // 构建更新数据
        const updateData: Record<string, any> = {
            id: userInfo.value.id,
            username: editForm.value.username.trim(),
            nickname: editForm.value.nickname?.trim() ?? null,
            avatar: editForm.value.avatar?.trim() ?? null,
            declaration: editForm.value.declaration?.trim() ?? null,
            address: editForm.value.address?.trim() ?? null,
            position: editForm.value.position?.trim() ?? null
        }
        
        // 如果有设置新密码，才包含密码字段
        if (editForm.value.password?.trim()) {
            updateData.password = editForm.value.password.trim()
        }
        
        console.log('提交更新数据:', updateData)
        const response = await http.put<ApiResponse<void>>('user/revise', updateData)
        console.log('更新响应:', response.data)
        
        // 不再检查 success 字段，因为后端总是返回 success: true
        ElMessage.success('更新成功')
        handleCancel()
        await getUserInfo() // 刷新用户信息
    } catch (error) {
        console.error('更新用户信息出错:', error)
        if (error instanceof Error && error.message !== '修改用户信息成功') {
            ElMessage.error(error.message || '更新失败')
        }
    } finally {
        submitting.value = false
    }
}

// 初始化
onMounted(() => {
    getUserInfo()
})
</script>

<!-- 
个人信息管理页面样式部分
功能：定义页面样式

样式结构说明:
1. page-container - 页面容器样式
   - padding: 内边距
   - height: 高度
   - display: 布局方式
   - flex-direction: 主轴方向
   - background-color: 背景色
2. page-header - 头部区域样式
3. page-content - 内容区域样式
4. user-info - 用户信息区域样式
5. edit-dialog - 编辑对话框样式
6. 响应式设计 - 移动端适配
-->
<style scoped lang="less">
.page-container {
    padding: 20px;
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: var(--el-bg-color);
    
    .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        
        .page-title {
            margin: 0;
            font-size: 1.5em;
            color: var(--el-text-color-primary);
        }
    }
    
    .page-content {
        flex: 1;
        background-color: var(--el-bg-color-overlay);
        border-radius: 8px;
        padding: 30px;
        box-shadow: var(--el-box-shadow-light);
        
        .user-info {
            display: flex;
            gap: 40px;
            
            .user-avatar {
                flex-shrink: 0;
                border: 4px solid var(--el-border-color-lighter);
                box-shadow: var(--el-box-shadow-light);
                background-color: var(--el-bg-color-overlay);
                
                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            }
            
            .info-content {
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 20px;
                
                .info-item {
                    display: flex;
                    align-items: baseline;
                    gap: 12px;
                    padding-bottom: 12px;
                    border-bottom: 1px solid var(--el-border-color-lighter);
                    
                    label {
                        color: var(--el-text-color-secondary);
                        font-weight: 500;
                        min-width: 80px;
                    }
                    
                    span {
                        color: var(--el-text-color-primary);
                        flex: 1;
                        
                        &.empty-value {
                            color: var(--el-text-color-placeholder);
                            font-style: italic;
                        }
                    }
                }
            }
        }
    }
}

// 对话框样式
.edit-dialog {
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
            
            .dialog-footer {
                display: flex;
                justify-content: flex-end;
                gap: 12px;
                
                .el-button {
                    margin: 0;
                    min-width: 80px;
                }
            }
        }
    }
    
    .edit-form {
        :deep(.el-form-item) {
            margin-bottom: 24px;
            
            &:last-child {
                margin-bottom: 0;
            }
            
            .el-form-item__label {
                font-weight: 500;
                color: var(--el-text-color-primary);
            }
        }
    }
}

// 响应式设计
@media screen and (max-width: 768px) {
    .page-container {
        padding: 16px;
        
        .page-content {
            padding: 20px;
            
            .user-info {
                flex-direction: column;
                align-items: center;
                gap: 24px;
                
                .user-avatar {
                    width: 100px;
                    height: 100px;
                }
                
                .info-content {
                    width: 100%;
                }
            }
        }
    }
    
    .edit-dialog {
        :deep(.el-dialog) {
            width: 90% !important;
            margin: 0 auto;
        }
    }
}

:deep(.el-button--black) {
    --el-button-bg-color: var(--el-color-black);
    --el-button-border-color: var(--el-color-black);
    --el-button-hover-bg-color: var(--el-color-black);
    --el-button-hover-border-color: var(--el-color-black);
    --el-button-active-bg-color: var(--el-color-black);
    --el-button-active-border-color: var(--el-color-black);
    --el-button-text-color: var(--el-color-white);
}

.dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    
    .el-button {
        margin: 0;
        min-width: 80px;
    }
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