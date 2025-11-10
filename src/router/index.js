import { createRouter, createWebHistory } from 'vue-router'
import FlowList from '../views/FlowList.vue'
import FlowEditor from '../views/FlowEditor.vue'

const routes = [
  {
    path: '/',
    name: 'FlowList',
    component: FlowList
  },
  {
    path: '/editor/:id?',
    name: 'FlowEditor',
    component: FlowEditor
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

