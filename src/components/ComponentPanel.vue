<template>
  <div class="component-panel">
    <div class="panel-header">
      <h3>基本模块</h3>
    </div>
    
    <div class="component-list">
      <div
        v-for="component in componentTypes"
        :key="component.id"
        class="component-item"
        draggable="true"
        @dragstart="onDragStart($event, component)"
      >
        <div class="component-visual">
          <img 
            v-if="component.image" 
            :src="component.image" 
            :alt="component.name"
            class="component-image"
            @error="onImageError($event, component)"
          />
          <div v-else class="component-icon">{{ component.icon }}</div>
        </div>
        <div class="component-name">{{ component.name }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { componentTypes } from '../config/components'

const onDragStart = (event, component) => {
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('application/json', JSON.stringify(component))
}

const onImageError = (event, component) => {
  // 图片加载失败时，隐藏图片并显示图标
  event.target.style.display = 'none'
  const iconElement = event.target.parentElement.querySelector('.component-icon-fallback')
  if (iconElement) {
    iconElement.style.display = 'flex'
  }
}
</script>

<style scoped>
.component-panel {
  flex-shrink: 0;
  background: white;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
  max-height: 40vh;
  overflow: hidden;
}

.panel-header {
  padding: 10px 12px;
  border-bottom: 1px solid #e8e8e8;
  flex-shrink: 0;
}

.panel-header h3 {
  margin: 0;
  font-size: 13px;
  color: #333;
  font-weight: 600;
}

.component-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  align-content: start;
}

.component-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  padding: 6px 4px;
  background: #f5f5f5;
  border-radius: 6px;
  cursor: move;
  transition: all 0.2s;
  border: 2px solid transparent;
  min-height: 60px;
}

.component-item:hover {
  background: #e6f7ff;
  border-color: #409eff;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
}

.component-item:active {
  transform: scale(0.95);
}

.component-visual {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 4px;
  flex-shrink: 0;
  overflow: hidden;
}

.component-icon {
  font-size: 20px;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.component-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.component-name {
  font-size: 10px;
  color: #333;
  font-weight: 500;
  text-align: center;
  word-break: keep-all;
  line-height: 1.2;
  max-width: 100%;
  padding: 0 2px;
}
</style>

