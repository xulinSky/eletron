<template>
  <div class="flow-list">
    <el-container>
      <el-header class="header">
        <h1>MxGraph 图形编辑器</h1>
        <el-button type="primary" @click="createNewFlow">
          <el-icon><Plus /></el-icon>
          新建流程图
        </el-button>
      </el-header>
      
      <el-main>
        <div class="flow-grid">
          <el-card
            v-for="flow in flows"
            :key="flow.id"
            class="flow-card"
            shadow="hover"
            @click="openFlow(flow.id)"
          >
            <template #header>
              <div class="card-header">
                <span class="flow-name">{{ flow.name }}</span>
                <el-button
                  type="danger"
                  size="small"
                  :icon="Delete"
                  circle
                  @click.stop="deleteFlowItem(flow.id)"
                />
              </div>
            </template>
            
            <div class="flow-info">
              <p>
                <el-icon><Clock /></el-icon>
                创建时间: {{ formatDate(flow.createdAt) }}
              </p>
              <p>
                <el-icon><Edit /></el-icon>
                更新时间: {{ formatDate(flow.updatedAt) }}
              </p>
              <p>
                <el-icon><Document /></el-icon>
                组件数量: {{ flow.nodes?.length || 0 }}
              </p>
            </div>
          </el-card>
          
          <el-empty
            v-if="flows.length === 0"
            description="暂无流程图，点击右上角新建"
          />
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useFlowStore } from '../store/flow'
import { ElMessageBox, ElMessage } from 'element-plus'
import { Plus, Delete, Clock, Edit, Document } from '@element-plus/icons-vue'

const router = useRouter()
const flowStore = useFlowStore()

const flows = computed(() => flowStore.flows)

const createNewFlow = () => {
  ElMessageBox.prompt('请输入流程图名称', '新建流程图', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputPattern: /.+/,
    inputErrorMessage: '流程图名称不能为空'
  }).then(({ value }) => {
    const id = flowStore.createFlow(value)
    router.push(`/editor/${id}`)
  }).catch(() => {})
}

const openFlow = (id) => {
  router.push(`/editor/${id}`)
}

const deleteFlowItem = (id) => {
  ElMessageBox.confirm('确定要删除这个流程图吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    flowStore.deleteFlow(id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN')
}
</script>

<style scoped>
.flow-list {
  width: 100%;
  height: 100vh;
  background: #f0f2f5;
}

.header {
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header h1 {
  font-size: 24px;
  color: #333;
  margin: 0;
}

.el-main {
  padding: 32px;
}

.flow-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.flow-card {
  cursor: pointer;
  transition: transform 0.2s;
}

.flow-card:hover {
  transform: translateY(-4px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.flow-name {
  font-weight: 600;
  font-size: 16px;
  color: #333;
}

.flow-info {
  color: #666;
  font-size: 14px;
}

.flow-info p {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 8px 0;
}
</style>

