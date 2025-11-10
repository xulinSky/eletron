<template>
  <div class="config-panel" v-if="selectedNode">
    <div class="panel-header">
      <h3>属性设置</h3>
      <el-button text @click="emit('close')" size="small">
        <el-icon><Close /></el-icon>
      </el-button>
    </div>
    
    <div class="panel-content">
      <div class="config-grid">
        <!-- 组件名称 - 占2列 -->
        <div class="config-item full-width">
          <label class="config-label">组件名称</label>
          <el-input
            v-model="nodeData.label"
            @input="updateNode"
            placeholder="请输入组件名称"
            size="small"
          />
        </div>
        
        <!-- 组件类型 - 占2列 -->
        <div class="config-item full-width">
          <label class="config-label">组件类型</label>
          <el-input :value="componentDef?.name" disabled size="small" />
        </div>
        
        <!-- 参数配置 - 2列布局 -->
        <template v-if="componentDef?.params && componentDef.params.length > 0">
          <div class="config-divider full-width">
            <span>可靠性参数</span>
          </div>
          
          <div
            v-for="param in componentDef.params"
            :key="param.key"
            class="config-item"
          >
            <label class="config-label" :title="param.name">{{ param.name }}</label>
            
            <el-select
              v-if="param.type === 'select'"
              v-model="nodeData.params[param.key]"
              @change="updateNode"
              placeholder="请选择"
              size="small"
            >
              <el-option
                v-for="option in param.options"
                :key="option"
                :label="option"
                :value="option"
              />
            </el-select>
            
            <el-input-number
              v-else-if="param.type === 'number'"
              v-model="nodeData.params[param.key]"
              @change="updateNode"
              :min="0"
              :controls="true"
              size="small"
              style="width: 100%"
            />
            
            <el-input
              v-else
              v-model="nodeData.params[param.key]"
              @input="updateNode"
              size="small"
            />
            
            <div class="param-note" v-if="param.note">
              {{ param.note }}
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
  <div v-else class="config-panel-empty">
    <el-empty description="请点击组件进行配置" :image-size="80" />
  </div>
</template>

<script setup>
import { computed, reactive, watch } from 'vue'
import { Close } from '@element-plus/icons-vue'
import { getComponentByType } from '../config/components'

const props = defineProps({
  selectedNode: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update', 'close'])

const componentDef = computed(() => {
  if (!props.selectedNode) return null
  return getComponentByType(props.selectedNode.type)
})

const nodeData = reactive({
  label: '',
  params: {}
})

watch(() => props.selectedNode, (newNode) => {
  if (newNode) {
    nodeData.label = newNode.data?.label || newNode.label || componentDef.value?.name || ''
    nodeData.params = { ...newNode.data?.params }
    
    // 初始化默认参数值
    if (componentDef.value?.params) {
      componentDef.value.params.forEach(param => {
        if (nodeData.params[param.key] === undefined) {
          nodeData.params[param.key] = param.default
        }
      })
    }
  }
}, { immediate: true })

const updateNode = () => {
  emit('update', {
    id: props.selectedNode.id,
    data: {
      label: nodeData.label,
      params: { ...nodeData.params }
    }
  })
}
</script>

<style scoped>
.config-panel {
  flex: 1;
  background: white;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.config-panel-empty {
  flex: 1;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.panel-header {
  padding: 12px 16px;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.panel-header h3 {
  margin: 0;
  font-size: 14px;
  color: #333;
  font-weight: 600;
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.config-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.config-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.config-item.full-width {
  grid-column: 1 / -1;
}

.config-label {
  font-size: 12px;
  color: #606266;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.param-note {
  font-size: 11px;
  color: #999;
  line-height: 1.3;
  margin-top: 2px;
}

.config-divider {
  grid-column: 1 / -1;
  padding: 8px 0;
  margin: 4px 0;
  border-top: 1px solid #e8e8e8;
  border-bottom: 1px solid #e8e8e8;
}

.config-divider span {
  font-size: 13px;
  color: #409eff;
  font-weight: 600;
}

/* 输入框样式调整 */
:deep(.el-input__inner) {
  font-size: 12px;
}

:deep(.el-input-number) {
  width: 100%;
}

:deep(.el-input-number__decrease),
:deep(.el-input-number__increase) {
  width: 24px;
}

:deep(.el-select) {
  width: 100%;
}
</style>

