import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useFlowStore = defineStore('flow', () => {
  // 流程图列表
  const flows = ref([])
  
  // 从localStorage加载
  const loadFlows = () => {
    const saved = localStorage.getItem('flows')
    if (saved) {
      flows.value = JSON.parse(saved)
    }
  }
  
  // 保存到localStorage
  const saveFlows = () => {
    localStorage.setItem('flows', JSON.stringify(flows.value))
  }
  
  // 创建新流程图
  const createFlow = (name) => {
    const newFlow = {
      id: Date.now().toString(),
      name: name || '未命名流程图',
      nodes: [],
      edges: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    flows.value.push(newFlow)
    saveFlows()
    return newFlow.id
  }
  
  // 获取流程图
  const getFlow = (id) => {
    return flows.value.find(f => f.id === id)
  }
  
  // 更新流程图
  const updateFlow = (id, data) => {
    const index = flows.value.findIndex(f => f.id === id)
    if (index !== -1) {
      flows.value[index] = {
        ...flows.value[index],
        ...data,
        updatedAt: new Date().toISOString()
      }
      saveFlows()
    }
  }
  
  // 删除流程图
  const deleteFlow = (id) => {
    flows.value = flows.value.filter(f => f.id !== id)
    saveFlows()
  }
  
  // 初始化
  loadFlows()
  
  return {
    flows,
    createFlow,
    getFlow,
    updateFlow,
    deleteFlow,
    loadFlows,
    saveFlows
  }
})

