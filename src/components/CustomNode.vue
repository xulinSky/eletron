<template>
  <div class="custom-node" :class="{ 'busbar-node': isBusbar, 'line-node': isLine, 'connection-line-node': isConnectionLine }">
    <!-- 母线组件：只显示两个连接点，但可以多连接 -->
    <template v-if="isBusbar">
      <!-- 左侧连接点 -->
      <Handle 
        id="left" 
        type="source"
        :position="Position.Left" 
        :connectable="true"
      />
      
      <!-- 右侧连接点 -->
      <Handle 
        id="right" 
        type="source"
        :position="Position.Right" 
        :connectable="true"
      />
    </template>
    
    <!-- 线路组件：只显示两个连接点，但可以多连接 -->
    <template v-else-if="isLine">
      <!-- 左侧连接点 -->
      <Handle 
        id="left" 
        type="source"
        :position="Position.Left" 
        :connectable="true"
      />
      
      <!-- 右侧连接点 -->
      <Handle 
        id="right" 
        type="source"
        :position="Position.Right" 
        :connectable="true"
      />
    </template>
    
    <!-- 连接线路组件：只显示两个连接点，但可以多连接 -->
    <template v-else-if="isConnectionLine">
      <!-- 左侧连接点 -->
      <Handle 
        id="left" 
        type="source"
        :position="Position.Left" 
        :connectable="true"
      />
      
      <!-- 右侧连接点 -->
      <Handle 
        id="right" 
        type="source"
        :position="Position.Right" 
        :connectable="true"
      />
    </template>
    
    <!-- 普通组件：只有2个连接点（左右） -->
    <template v-else>
      <!-- 左侧连接点 -->
      <Handle 
        id="left" 
        type="source"
        :position="Position.Left" 
        :connectable="true"
      />
      
      <!-- 右侧连接点 -->
      <Handle 
        id="right" 
        type="source"
        :position="Position.Right" 
        :connectable="true"
      />
    </template>
    
    <div class="node-icon" v-if="!componentImage">{{ icon }}</div>
    <img v-else :src="componentImage" class="node-image" alt="component" />
    <div class="node-label">{{ label }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Handle, Position } from '@vue-flow/core'
import { getComponentByType } from '../config/components'

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  type: {
    type: String,
    required: true
  }
})

const componentDef = computed(() => getComponentByType(props.type))
const icon = computed(() => componentDef.value?.icon || '📦')
const label = computed(() => props.data?.label || componentDef.value?.name || props.type)
const isBusbar = computed(() => props.type === 'busbar')
const isLine = computed(() => props.type === 'line')
const isConnectionLine = computed(() => props.type === 'connection-line')

// 顯示組件自己的圖片
const componentImage = computed(() => componentDef.value?.image)
</script>

<style scoped>
.custom-node {
  padding: 16px;
  background: white;
  border: 2px solid #1a192b;
  border-radius: 8px;
  min-width: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

/* 母线组件特殊样式 */
.busbar-node {
  min-width: 160px;
  min-height: 100px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #5a67d8;
  position: relative;
}

.busbar-node .node-icon {
  background: rgba(255, 255, 255, 0.9);
  color: #5a67d8;
  font-weight: bold;
}

.busbar-node .node-label {
  color: white;
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* 线路组件特殊样式 */
.line-node {
  min-width: 140px;
  min-height: 80px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-color: #ec4899;
  position: relative;
}

.line-node .node-icon {
  background: rgba(255, 255, 255, 0.9);
  color: #ec4899;
  font-weight: bold;
}

.line-node .node-label {
  color: white;
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* 连接线路组件特殊样式 */
.connection-line-node {
  min-width: 140px;
  min-height: 80px;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  border-color: #00bcd4;
  position: relative;
}

.connection-line-node .node-icon {
  background: rgba(255, 255, 255, 0.9);
  color: #00bcd4;
  font-weight: bold;
}

.connection-line-node .node-label {
  color: white;
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.custom-node:hover {
  border-color: #409eff;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

.node-icon {
  font-size: 32px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border-radius: 8px;
}

.node-image {
  width: 48px;
  height: 48px;
  object-fit: contain;
  border-radius: 8px;
  background: #f5f5f5;
}

.node-label {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  text-align: center;
  word-break: break-word;
}

/* 连接点样式 - 默认隐藏 */
:deep(.vue-flow__handle) {
  width: 12px;
  height: 12px;
  border: 2px solid white;
  box-shadow: 0 0 0 1px #409eff;
  transition: all 0.2s;
  opacity: 0;
  pointer-events: none;
}

/* 显示连接点的情况 */
/* 1. 已经连接的连接点 */
:deep(.vue-flow__handle.connected) {
  opacity: 1;
  pointer-events: all;
}

/* 2. 节点被选中时显示所有连接点 */
.custom-node:hover :deep(.vue-flow__handle),
:deep(.selected) .vue-flow__handle {
  opacity: 1;
  pointer-events: all;
}

/* 3. 正在连接时显示所有连接点 */
:deep(.vue-flow__handle.connecting),
:deep(.vue-flow__handle.connectingfrom),
:deep(.vue-flow__handle.connectingto) {
  opacity: 1;
  pointer-events: all;
}

/* 所有连接点统一颜色 - 蓝色 */
:deep(.vue-flow__handle) {
  background: #409eff;
}

:deep(.vue-flow__handle:hover) {
  width: 16px;
  height: 16px;
  background: #66b1ff;
  box-shadow: 0 0 0 2px #409eff;
}

:deep(.vue-flow__handle-top) {
  top: -6px;
}

:deep(.vue-flow__handle-bottom) {
  bottom: -6px;
}

:deep(.vue-flow__handle-left) {
  left: -6px;
}

:deep(.vue-flow__handle-right) {
  right: -6px;
}
</style>

