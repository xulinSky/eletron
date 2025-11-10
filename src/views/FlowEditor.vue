<template>
  <div class="flow-editor">
    <el-container>
      <!-- 顶部工具栏 -->
      <el-header class="editor-header">
        <div class="header-left">
          <el-button @click="goBack" :icon="ArrowLeft">返回</el-button>
          <el-input
            v-model="flowName"
            placeholder="流程图名称"
            style="width: 300px; margin-left: 16px"
            @blur="updateFlowName"
          />
        </div>
        <div class="header-right">
          <el-switch
            v-model="autoConnectEnabled"
            active-text="自动连接"
            inactive-text="手动连接"
            style="margin-right: 16px"
          />
          <el-popover
            placement="bottom"
            :width="280"
            trigger="click"
          >
            <template #reference>
              <el-button :icon="Setting">设置</el-button>
            </template>
            <div class="settings-panel">
              <div class="setting-item">
                <label>自动连接距离</label>
                <el-slider
                  v-model="autoConnectThreshold"
                  :min="50"
                  :max="300"
                  :step="10"
                  show-input
                  :input-size="'small'"
                />
                <span class="setting-note">节点间距小于此值时自动连接</span>
              </div>
            </div>
          </el-popover>
          <el-button @click="clearAll" :icon="Delete">清空</el-button>
          <el-button type="primary" @click="saveFlow" :icon="Check">保存</el-button>
        </div>
      </el-header>

      <!-- 主要内容区域 -->
      <el-container class="editor-body">
        <!-- 左侧画布区域 -->
        <el-main class="canvas-area">
          <VueFlow
            v-model:nodes="nodes"
            v-model:edges="edges"
            @drop="onDrop"
            @dragover="onDragOver"
            @node-click="onNodeClick"
            @edge-click="onEdgeClick"
            @pane-click="onPaneClick"
            @connect="onConnect"
            :default-zoom="1"
            :min-zoom="0.2"
            :max-zoom="4"
            :snap-to-grid="true"
            :snap-grid="[15, 15]"
            :connect-on-click="true"
            :connection-line-style="{ stroke: '#409eff', strokeWidth: 2 }"
          >
            <Background pattern-color="#aaa" :gap="16" />
            <Controls />
            <MiniMap />
            
            <!-- 为每个组件类型注册模板 -->
            <template #node-power="nodeProps">
              <CustomNode v-bind="nodeProps" />
            </template>
            <template #node-diesel-generator="nodeProps">
              <CustomNode v-bind="nodeProps" />
            </template>
            <template #node-transformer="nodeProps">
              <CustomNode v-bind="nodeProps" />
            </template>
            <template #node-busbar="nodeProps">
              <CustomNode v-bind="nodeProps" />
            </template>
            <template #node-switch="nodeProps">
              <CustomNode v-bind="nodeProps" />
            </template>
            <template #node-line="nodeProps">
              <CustomNode v-bind="nodeProps" />
            </template>
            <template #node-connection-line="nodeProps">
              <CustomNode v-bind="nodeProps" />
            </template>
            <template #node-solar="nodeProps">
              <CustomNode v-bind="nodeProps" />
            </template>
            <template #node-wind="nodeProps">
              <CustomNode v-bind="nodeProps" />
            </template>
            <template #node-storage="nodeProps">
              <CustomNode v-bind="nodeProps" />
            </template>
            <template #node-ups="nodeProps">
              <CustomNode v-bind="nodeProps" />
            </template>
            <template #node-atse="nodeProps">
              <CustomNode v-bind="nodeProps" />
            </template>
            <template #node-sts="nodeProps">
              <CustomNode v-bind="nodeProps" />
            </template>
            <template #node-reactive-compensator="nodeProps">
              <CustomNode v-bind="nodeProps" />
            </template>
            <template #node-load="nodeProps">
              <CustomNode v-bind="nodeProps" />
            </template>
          </VueFlow>
        </el-main>

        <!-- 右侧面板区域 -->
        <aside class="right-sidebar">
          <!-- 基本模块面板 -->
          <ComponentPanel />
          
          <!-- 配置面板 -->
          <ConfigPanel
            :selected-node="selectedNode"
            @update="updateNodeData"
            @close="selectedNode = null"
          />
        </aside>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, Delete, Check, Setting } from '@element-plus/icons-vue'
import ComponentPanel from '../components/ComponentPanel.vue'
import ConfigPanel from '../components/ConfigPanel.vue'
import CustomNode from '../components/CustomNode.vue'
import { useFlowStore } from '../store/flow'
import { getComponentByType } from '../config/components'

// Vue Flow样式导入
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import '@vue-flow/controls/dist/style.css'
import '@vue-flow/minimap/dist/style.css'

const route = useRoute()
const router = useRouter()
const flowStore = useFlowStore()
const { findNode, updateNode, addNodes, addEdges } = useVueFlow()

const flowId = ref(route.params.id)
const flowName = ref('未命名流程图')
const nodes = ref([])
const edges = ref([])
const selectedNode = ref(null)
const nodeIdCounter = ref(1)
const autoConnectedEdges = ref(new Set()) // 记录自动连接的边
const autoConnectEnabled = ref(true) // 自动连接开关
const autoConnectThreshold = ref(150) // 自动连接距离阈值
const recentlyAddedNodes = ref(new Set()) // 记录最近添加的节点ID
const lastMovedNodeId = ref(null) // 记录最近移动的节点ID
const previousNodePositions = ref(new Map()) // 记录上一次的节点位置

// 加载流程图数据
onMounted(() => {
  if (flowId.value) {
    const flow = flowStore.getFlow(flowId.value)
    if (flow) {
      flowName.value = flow.name
      nodes.value = flow.nodes || []
      edges.value = flow.edges || []
      
      // 更新计数器
      if (nodes.value.length > 0) {
        const maxId = Math.max(...nodes.value.map(n => {
          const match = n.id.match(/node-(\d+)/)
          return match ? parseInt(match[1]) : 0
        }))
        nodeIdCounter.value = maxId + 1
      }
    }
  }
})

// 处理拖放事件
const onDrop = (event) => {
  event.preventDefault()
  
  const componentData = JSON.parse(event.dataTransfer.getData('application/json'))
  
  // 获取画布坐标
  const vueFlowBounds = event.target.closest('.vue-flow')?.getBoundingClientRect()
  if (!vueFlowBounds) return
  
  const position = {
    x: event.clientX - vueFlowBounds.left - 60,
    y: event.clientY - vueFlowBounds.top - 40
  }
  
  // 创建新节点
  const newNodeId = `node-${nodeIdCounter.value++}`
  const newNode = {
    id: newNodeId,
    type: componentData.type, // 使用组件类型作为节点类型
    position,
    data: {
      label: componentData.name,
      params: {}
    }
  }
  
  nodes.value.push(newNode)
  
  // 标记为最近添加的节点，延迟后移除标记
  recentlyAddedNodes.value.add(newNodeId)
  setTimeout(() => {
    recentlyAddedNodes.value.delete(newNodeId)
  }, 1000) // 1秒后允许自动连接
}

const onDragOver = (event) => {
  event.preventDefault()
  event.dataTransfer.dropEffect = 'move'
}

// 节点点击事件
const onNodeClick = ({ node }) => {
  selectedNode.value = node
}

// 边点击事件
const onEdgeClick = ({ edge }) => {
  ElMessageBox.confirm('是否删除此连接？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    edges.value = edges.value.filter(e => e.id !== edge.id)
  }).catch(() => {})
}

// 画布点击事件
const onPaneClick = () => {
  selectedNode.value = null
}

// 检查组件是否支持多连接（母线、线路和连接线路）
const supportsMultipleConnections = (nodeId) => {
  const node = nodes.value.find(n => n.id === nodeId)
  if (!node) return false
  return node.type === 'busbar' || node.type === 'line' || node.type === 'connection-line'
}

// 获取节点的总连接数
const getNodeConnectionCount = (nodeId) => {
  return edges.value.filter(edge => 
    edge.source === nodeId || edge.target === nodeId
  ).length
}

// 检查连接点是否已经被使用
const isHandleConnected = (nodeId, handleId) => {
  return edges.value.some(edge => 
    (edge.source === nodeId && edge.sourceHandle === handleId) ||
    (edge.target === nodeId && edge.targetHandle === handleId)
  )
}

// 计算两个节点之间最近的连接点对，确保选择的连接点可用
const findClosestHandles = (sourceNode, targetNode) => {
  // 所有组件现在都只有 left 和 right 两个连接点
  // 多连接组件（母线、线路、连接线路）可以在同一个连接点上连接多次
  const isSourceMulti = supportsMultipleConnections(sourceNode.id)
  const isTargetMulti = supportsMultipleConnections(targetNode.id)
  
  const sourcePos = sourceNode.position
  const targetPos = targetNode.position
  
  // 基于节点相对位置判断最近的连接点
  const dx = targetPos.x - sourcePos.x
  
  // 根据相对位置确定首选连接点
  let preferredSourceHandles = []
  let preferredTargetHandles = []
  
  // 如果目标在右侧，优先使用源的 right 和目标的 left
  if (dx > 0) {
    preferredSourceHandles = ['right', 'left']
    preferredTargetHandles = ['left', 'right']
  } else {
    // 如果目标在左侧，优先使用源的 left 和目标的 right
    preferredSourceHandles = ['left', 'right']
    preferredTargetHandles = ['right', 'left']
  }
  
  // 遍历优先级列表，找到第一对都可用的连接点
  for (const sourceHandle of preferredSourceHandles) {
    // 对于普通组件，检查源连接点是否已被占用
    if (!isSourceMulti && isHandleConnected(sourceNode.id, sourceHandle)) {
      continue // 已被占用，尝试下一个
    }
    
    for (const targetHandle of preferredTargetHandles) {
      // 对于普通组件，检查目标连接点是否已被占用
      if (!isTargetMulti && isHandleConnected(targetNode.id, targetHandle)) {
        continue // 已被占用，尝试下一个
      }
      
      // 找到一对都可用的连接点
      return { source: sourceHandle, target: targetHandle }
    }
  }
  
  // 如果所有优先连接点都被占用，返回首选
  // 对于多连接组件，可以重复使用同一个连接点
  return { 
    source: preferredSourceHandles[0], 
    target: preferredTargetHandles[0] 
  }
}

// 处理连接事件
const onConnect = (params) => {
  // 检查源节点的连接点
  const sourceNode = nodes.value.find(n => n.id === params.source)
  const targetNode = nodes.value.find(n => n.id === params.target)
  
  if (!sourceNode || !targetNode) {
    ElMessage.error('无效的连接')
    return
  }
  
  // 如果没有指定具体的连接点，使用就近原则自动选择
  if (!params.sourceHandle || !params.targetHandle) {
    const closestHandles = findClosestHandles(sourceNode, targetNode)
    params.sourceHandle = params.sourceHandle || closestHandles.source
    params.targetHandle = params.targetHandle || closestHandles.target
  }
  
  // 检查普通组件（非母线、线路、连接线路）的连接限制
  // 普通组件最多只能有2个连接（一头一尾）
  if (!supportsMultipleConnections(params.source)) {
    const sourceConnections = getNodeConnectionCount(params.source)
    if (sourceConnections >= 2) {
      ElMessage.warning({
        message: `${sourceNode.data.label || sourceNode.type} 最多只能连接2个组件（一头一尾）`,
        duration: 3000
      })
      return
    }
    
    // 检查该连接点是否已被使用
    if (isHandleConnected(params.source, params.sourceHandle)) {
      ElMessage.warning({
        message: `${sourceNode.data.label || sourceNode.type} 的该连接点已被使用`,
        duration: 3000
      })
      return
    }
  }
  
  // 检查目标节点
  if (!supportsMultipleConnections(params.target)) {
    const targetConnections = getNodeConnectionCount(params.target)
    if (targetConnections >= 2) {
      ElMessage.warning({
        message: `${targetNode.data.label || targetNode.type} 最多只能连接2个组件（一头一尾）`,
        duration: 3000
      })
      return
    }
    
    // 检查该连接点是否已被使用
    if (isHandleConnected(params.target, params.targetHandle)) {
      ElMessage.warning({
        message: `${targetNode.data.label || targetNode.type} 的该连接点已被使用`,
        duration: 3000
      })
      return
    }
  }
  
  // 检查是否已存在相同的连接
  const duplicateEdge = edges.value.find(edge =>
    edge.source === params.source &&
    edge.target === params.target &&
    edge.sourceHandle === params.sourceHandle &&
    edge.targetHandle === params.targetHandle
  )
  
  if (duplicateEdge) {
    ElMessage.warning('该连接已存在')
    return
  }
  
  // 创建新的连接
  const newEdge = {
    id: `edge-${Date.now()}`,
    source: params.source,
    target: params.target,
    sourceHandle: params.sourceHandle,
    targetHandle: params.targetHandle,
    type: 'default',
    animated: false,
    style: { stroke: '#409eff', strokeWidth: 2 }
  }
  
  edges.value.push(newEdge)
  ElMessage.success('连接成功')
}

// 更新节点数据
const updateNodeData = ({ id, data }) => {
  const node = nodes.value.find(n => n.id === id)
  if (node) {
    node.data = { ...node.data, ...data }
  }
}

// 更新流程图名称
const updateFlowName = () => {
  if (flowId.value) {
    flowStore.updateFlow(flowId.value, { name: flowName.value })
  }
}

// 保存流程图
const saveFlow = () => {
  if (!flowId.value) {
    // 新建流程图
    flowId.value = flowStore.createFlow(flowName.value)
  }
  
  flowStore.updateFlow(flowId.value, {
    name: flowName.value,
    nodes: nodes.value,
    edges: edges.value
  })
  
  ElMessage.success('保存成功')
}

// 清空画布
const clearAll = () => {
  ElMessageBox.confirm('确定要清空画布吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    nodes.value = []
    edges.value = []
    selectedNode.value = null
    ElMessage.success('已清空')
  }).catch(() => {})
}

// 返回列表
const goBack = () => {
  router.push('/')
}

// 监听节点变化以实现自动连接
watch(() => nodes.value.map(n => ({ id: n.id, x: n.position.x, y: n.position.y })), (newPositions, oldPositions) => {
  if (!autoConnectEnabled.value) return
  
  // 找出哪个节点移动了
  lastMovedNodeId.value = null
  
  if (oldPositions && newPositions) {
    for (let i = 0; i < newPositions.length; i++) {
      const newPos = newPositions[i]
      const oldPos = oldPositions.find(op => op.id === newPos.id)
      
      if (oldPos && (oldPos.x !== newPos.x || oldPos.y !== newPos.y)) {
        // 这个节点移动了
        lastMovedNodeId.value = newPos.id
        break // 只记录第一个移动的节点
      }
    }
  }
  
  // 如果检测到节点移动，执行自动连接
  if (lastMovedNodeId.value) {
    autoConnectNearbyNodes()
  }
}, { deep: true })

// 监听自动连接开关变化
watch(autoConnectEnabled, (enabled) => {
  if (!enabled) {
    // 关闭自动连接时，移除所有自动连接
    edges.value = edges.value.filter(e => !e.id.startsWith('auto-'))
    autoConnectedEdges.value.clear()
  } else {
    // 开启自动连接时，立即检查
    autoConnectNearbyNodes()
  }
})

// 检查节点是否还有可用的连接点
const hasAvailableHandle = (nodeId) => {
  const node = nodes.value.find(n => n.id === nodeId)
  if (!node) return false
  
  // 母线、线路和连接线路支持多连接，总是有可用连接点
  if (supportsMultipleConnections(nodeId)) return true
  
  // 普通组件：首先检查总连接数是否已达到2个
  const currentConnections = getNodeConnectionCount(nodeId)
  if (currentConnections >= 2) {
    return false // 已经达到最大连接数
  }
  
  // 普通组件只有左右两个连接点，检查是否还有可用的
  const handles = ['left', 'right']
  
  // 检查是否至少有一个连接点未被使用
  return handles.some(handle => !isHandleConnected(nodeId, handle))
}

// 计算两个节点连接点之间的最短距离
const getClosestHandleDistance = (node1, node2) => {
  // 获取节点的连接点位置
  const getHandlePositions = (node) => {
    const positions = []
    const nodeWidth = 120  // 节点宽度（估算）
    const nodeHeight = 100 // 节点高度（估算）
    
    // 计算连接点的实际坐标
    positions.push({
      handle: 'left',
      x: node.position.x,
      y: node.position.y + nodeHeight / 2
    })
    positions.push({
      handle: 'right',
      x: node.position.x + nodeWidth,
      y: node.position.y + nodeHeight / 2
    })
    
    return positions
  }
  
  const handles1 = getHandlePositions(node1)
  const handles2 = getHandlePositions(node2)
  
  // 计算所有连接点对之间的距离，找到最短的
  let minDistance = Infinity
  
  for (const h1 of handles1) {
    for (const h2 of handles2) {
      const distance = Math.sqrt(
        Math.pow(h1.x - h2.x, 2) +
        Math.pow(h1.y - h2.y, 2)
      )
      minDistance = Math.min(minDistance, distance)
    }
  }
  
  return minDistance
}

// 自动连接和断开附近的节点
const autoConnectNearbyNodes = () => {
  if (!autoConnectEnabled.value) return
  
  const threshold = autoConnectThreshold.value // 使用可配置的距离阈值
  const currentAutoEdges = new Set()
  
  // 只处理最近移动的节点
  const movedNode = lastMovedNodeId.value ? nodes.value.find(n => n.id === lastMovedNodeId.value) : null
  
  if (!movedNode) {
    // 如果没有移动的节点，不执行自动连接
    return
  }
  
  // 跳过最近添加的节点
  if (recentlyAddedNodes.value.has(movedNode.id)) {
    return
  }
  
  // 找到离移动节点最近的节点
  let closestNode = null
  let closestDistance = Infinity
  
  for (const otherNode of nodes.value) {
    if (otherNode.id === movedNode.id) continue
    if (recentlyAddedNodes.value.has(otherNode.id)) continue
    
    const distance = getClosestHandleDistance(movedNode, otherNode)
    
    if (distance < closestDistance) {
      closestDistance = distance
      closestNode = otherNode
    }
  }
  
  // 如果找到了最近的节点，处理它们之间的连接
  if (closestNode) {
    const node1 = movedNode
    const node2 = closestNode
    const distance = closestDistance
    
    // 生成边的唯一标识
    const edgeId = `auto-${node1.id}-${node2.id}`
    const reverseEdgeId = `auto-${node2.id}-${node1.id}`
    
    // 检查是否已经存在手动创建的连接
    const manualEdgeExists = edges.value.some(edge => 
      !edge.id.startsWith('auto-') && (
        (edge.source === node1.id && edge.target === node2.id) ||
        (edge.source === node2.id && edge.target === node1.id)
      )
    )
    
    // 检查两个节点是否都有可用的连接点
    const node1HasAvailable = hasAvailableHandle(node1.id)
    const node2HasAvailable = hasAvailableHandle(node2.id)
    
    // 额外检查：确保普通组件没有达到2个连接的限制
    const node1Connections = getNodeConnectionCount(node1.id)
    const node2Connections = getNodeConnectionCount(node2.id)
    const node1CanConnect = supportsMultipleConnections(node1.id) || node1Connections < 2
    const node2CanConnect = supportsMultipleConnections(node2.id) || node2Connections < 2
    
    const canAutoConnect = node1HasAvailable && node2HasAvailable && node1CanConnect && node2CanConnect
    
    // 检查是否已存在自动连接（任意方向）
    const existingAutoEdge = edges.value.find(e => 
      (e.id === edgeId || e.id === reverseEdgeId) && e.id.startsWith('auto-')
    )
    
    if (distance < threshold && !manualEdgeExists && canAutoConnect) {
      // 距离足够近，且两个节点都有可用连接点，创建或保持自动连接
      currentAutoEdges.add(edgeId)
      
      // 先清除移动节点的其他自动连接
      const movedNodeAutoEdges = edges.value.filter(e => 
        e.id.startsWith('auto-') && 
        (e.source === node1.id || e.target === node1.id) &&
        e.id !== edgeId && e.id !== reverseEdgeId
      )
      
      for (const oldEdge of movedNodeAutoEdges) {
        const index = edges.value.findIndex(e => e.id === oldEdge.id)
        if (index !== -1) {
          edges.value.splice(index, 1)
          autoConnectedEdges.value.delete(oldEdge.id)
        }
      }
      
      // 如果已存在自动连接，保持它（不要删除重建）
      if (existingAutoEdge) {
        // 连接已存在且距离仍在阈值内，保持不变
        currentAutoEdges.add(existingAutoEdge.id)
      } else {
        // 连接不存在，检查是否需要创建
        const edgeExists = edges.value.some(e => 
          (e.source === node1.id && e.target === node2.id) ||
          (e.source === node2.id && e.target === node1.id)
        )
        
        if (!edgeExists) {
          // 使用就近原则选择连接点
          const closestHandles = findClosestHandles(node1, node2)
          
          const newEdge = {
            id: edgeId, // 以 'auto-' 开头，标记为自动连接
            source: node1.id,
            target: node2.id,
            sourceHandle: closestHandles.source,
            targetHandle: closestHandles.target,
            type: 'default',
            animated: false,
            style: { 
              stroke: '#409eff', 
              strokeWidth: 2
            }
          }
          edges.value.push(newEdge)
          autoConnectedEdges.value.add(edgeId)
          
          // 显示提示（不重复提示）
          if (!autoConnectedEdges.value.has(edgeId + '-notified')) {
            ElMessage({
              message: '节点靠近，已自动连接',
              type: 'success',
              duration: 1500,
              grouping: true
            })
            autoConnectedEdges.value.add(edgeId + '-notified')
            setTimeout(() => {
              autoConnectedEdges.value.delete(edgeId + '-notified')
            }, 2000)
          }
        }
      }
    } else if (existingAutoEdge) {
      // 距离超出阈值，但使用容忍度机制：
      // 只有当距离明显超出阈值（1.5倍）时才删除，避免频繁断开重连
      const disconnectThreshold = threshold * 1.5
      
      if (distance > disconnectThreshold) {
        // 距离明显过远，删除自动连接
        const autoEdgeIndex = edges.value.findIndex(e => e.id === existingAutoEdge.id)
        
        if (autoEdgeIndex !== -1) {
          edges.value.splice(autoEdgeIndex, 1)
          autoConnectedEdges.value.delete(edgeId)
          autoConnectedEdges.value.delete(reverseEdgeId)
          autoConnectedEdges.value.delete(existingAutoEdge.id)
          
          ElMessage({
            message: '节点分离，已断开自动连接',
            type: 'warning',
            duration: 1500,
            grouping: true
          })
        }
      } else {
        // 距离在阈值和断开阈值之间，保持现有连接
        currentAutoEdges.add(existingAutoEdge.id)
      }
    } else {
      // 没有连接，且距离超出阈值，清除移动节点的所有自动连接
      const movedNodeAutoEdges = edges.value.filter(e => 
        e.id.startsWith('auto-') && 
        (e.source === node1.id || e.target === node1.id)
      )
      
      for (const oldEdge of movedNodeAutoEdges) {
        const index = edges.value.findIndex(e => e.id === oldEdge.id)
        if (index !== -1) {
          edges.value.splice(index, 1)
          autoConnectedEdges.value.delete(oldEdge.id)
        }
      }
    }
  } else {
    // 没有找到最近的节点，清除移动节点的所有自动连接
    const movedNodeAutoEdges = edges.value.filter(e => 
      e.id.startsWith('auto-') && 
      (e.source === movedNode.id || e.target === movedNode.id)
    )
    
    for (const oldEdge of movedNodeAutoEdges) {
      const index = edges.value.findIndex(e => e.id === oldEdge.id)
      if (index !== -1) {
        edges.value.splice(index, 1)
        autoConnectedEdges.value.delete(oldEdge.id)
      }
    }
  }
}

// 检查附近的节点并提示连接（已被autoConnectNearbyNodes替换）
const checkNearbyNodes = () => {
  // 此函数已被autoConnectNearbyNodes替换，保留以防万一
}
</script>

<style scoped>
.flow-editor {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.editor-header {
  background: white;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
}

.header-left,
.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.editor-body {
  flex: 1;
  height: calc(100vh - 60px);
  overflow: hidden;
}

.canvas-area {
  padding: 0;
  position: relative;
  background: #f5f5f5;
  flex: 1;
  overflow: hidden;
}

.right-sidebar {
  width: 400px;
  display: flex;
  flex-direction: column;
  background: white;
  border-left: 1px solid #e8e8e8;
  overflow: hidden;
}

.vue-flow {
  height: 100%;
}

/* 当画布处于连接状态时，显示所有连接点 */
:deep(.vue-flow.connecting) .vue-flow__handle {
  opacity: 1 !important;
  pointer-events: all !important;
}

.settings-panel {
  padding: 12px 0;
}

.setting-item {
  margin-bottom: 16px;
}

.setting-item label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.setting-note {
  display: block;
  font-size: 12px;
  color: #999;
  margin-top: 8px;
  line-height: 1.4;
}
</style>

