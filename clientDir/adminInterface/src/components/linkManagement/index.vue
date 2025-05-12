<!-- 
链接管理页面模板部分
功能：展示链接列表并提供管理操作

组件结构说明:
1. link-management - 页面容器
2. el-card - 卡片容器
   - header - 头部区域
     - el-button - 新建链接按钮
   - el-table - 链接表格
     - el-table-column - 表格列定义
       - category: 链接类别列
       - icon: 链接图标列
       - name: 链接名称列
       - summary: 链接摘要列
       - url: 链接地址列
       - 操作列: 包含编辑和删除按钮
3. el-dialog - 编辑弹窗
   - el-form - 表单区域
     - el-form-item - 表单项
       - category: 类别输入框
       - icon: 图标输入框
       - name: 名称输入框
       - summary: 摘要输入框
       - url: 地址输入框
   - footer - 底部按钮区域

方法绑定说明:
- handleCreate(): 新建链接
- handleEdit(row): 编辑链接
- handleDelete(row): 删除链接
- submitForm(): 提交表单
-->
<template>
  <div class="link-management">
    <el-card>
      <div class="header">
        <el-button type="primary" @click="handleCreate">新建链接</el-button>
      </div>
      
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column prop="category" label="类别" width="120" />
        <el-table-column prop="icon" label="图标" width="100">
          <template #default="scope">
            <el-icon :size="20">
              <component :is="iconOptions.includes(scope.row.icon) ? scope.row.icon : 'LinkIcon'" />
            </el-icon>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="summary" label="摘要" />
        <el-table-column prop="url" label="地址" />
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle">
      <el-form :model="formData" label-width="80px">
        <el-form-item label="类别" required>
          <el-input v-model="formData.category" />
        </el-form-item>
        <el-form-item label="图标" required>
            <el-input v-model="formData.icon" />
        </el-form-item>
        <el-form-item label="名称" required>
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="摘要">
          <el-input v-model="formData.summary" type="textarea" />
        </el-form-item>
        <el-form-item label="地址" required>
          <el-input v-model="formData.url" />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<!-- 
链接管理页面脚本部分
功能：处理链接管理相关逻辑

类型定义说明:
- Link: 链接数据结构
  - id: 链接ID
  - category: 链接类别
  - icon: 链接图标
  - name: 链接名称
  - summary: 链接摘要
  - url: 链接地址

主要方法说明:
1. fetchLinks(): 获取链接列表
2. handleCreate(): 初始化新建链接表单
3. handleEdit(row): 初始化编辑链接表单
4. submitForm(): 提交表单数据
5. handleDelete(row): 删除链接

状态管理说明:
- tableData: 表格数据
- loading: 加载状态
- dialogVisible: 对话框可见性
- dialogTitle: 对话框标题
- formData: 表单数据
- iconOptions: 可用图标列表
-->
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Document, Monitor, Setting, Link as LinkIcon } from '@element-plus/icons-vue'
import http from '@/axios';

interface Link {
  id?: number
  category: string
  icon: string
  name: string
  summary: string
  url: string
}

const tableData = ref<Link[]>([])
const loading = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref('新建链接')
const formData = ref<Link>({
  category: '',
  icon: '',
  name: '',
  summary: '',
  url: ''
})

const iconOptions = [Document, Monitor, Setting, LinkIcon].map(item => item.name)

/**
 * 获取链接列表
 * 1. 设置加载状态
 * 2. 调用API获取数据
 * 3. 更新表格数据
 * 4. 捕获错误并显示提示
 */
const fetchLinks = async () => {
  try {
    loading.value = true
    const response = await http.get('/link/list')
    tableData.value = response.data.data
  } catch (error) {
    ElMessage.error('获取链接列表失败')
  } finally {
    loading.value = false
  }
}

/**
 * 初始化新建链接表单
 * 1. 重置表单数据
 * 2. 设置对话框标题
 * 3. 显示对话框
 */
const handleCreate = () => {
  formData.value = {
    category: '',
    icon: '',
    name: '',
    summary: '',
    url: ''
  }
  dialogTitle.value = '新建链接'
  dialogVisible.value = true
}

/**
 * 初始化编辑链接表单
 * @param row 当前行数据
 * 1. 复制当前行数据到表单
 * 2. 设置对话框标题
 * 3. 显示对话框
 */
const handleEdit = (row: Link) => {
  formData.value = { ...row }
  dialogTitle.value = '编辑链接'
  dialogVisible.value = true
}

/**
 * 提交表单数据
 * 1. 根据ID判断是新增还是编辑
 * 2. 调用相应API
 * 3. 显示操作结果提示
 * 4. 关闭对话框
 * 5. 刷新表格数据
 */
const submitForm = async () => {
  try {
    if (formData.value.id) {
      await http.put(`/link/put`, formData.value)
    } else {
      await http.post('/link/add', formData.value)
    }
    ElMessage.success('操作成功')
    dialogVisible.value = false
    await fetchLinks()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

/**
 * 删除链接
 * @param row 当前行数据
 * 1. 显示确认对话框
 * 2. 用户确认后调用删除API
 * 3. 显示操作结果提示
 * 4. 刷新表格数据
 */
const handleDelete = (row: Link) => {
  ElMessageBox.confirm('确认删除该链接？', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await http.delete(`/link/delete/${row.id}`)
      ElMessage.success('删除成功')
      await fetchLinks()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  })
}

// 组件挂载时获取链接列表
onMounted(() => {
  fetchLinks()
})
</script>

<!-- 
链接管理页面样式部分
功能：定义页面布局和样式

样式说明:
1. .link-management - 页面容器样式
   - padding: 内边距
2. .header - 头部区域样式
   - margin-bottom: 底部外边距
   - display: flex布局
   - justify-content: 右对齐
-->
<style scoped>
.link-management {
  padding: 20px;
}
.header {
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>