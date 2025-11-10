// 组件类型定义
export const componentTypes = [
  {
    id: 'power',
    name: '市电',
    type: 'power',
    icon: '🔌',
    image: '/images/components/power.svg',
    category: '电源',
    params: [
      { name: '平衡类型', key: 'balanceType', type: 'select', options: ['平衡', '不平衡'], default: '平衡', note: '默认平衡，可下拉选择不平衡' }
    ]
  },
  {
    id: 'diesel-generator',
    name: '柴油发电机',
    type: 'diesel-generator',
    icon: '⚡',
    image: '/images/components/diesel-generator.svg',
    category: '电源',
    params: [
      { name: '故障停运率(次/备注)', key: 'failureRate', type: 'number', default: 0, note: '默认值，可修改' },
      { name: '故障停运平均持续时间(min/次)', key: 'failureDuration', type: 'number', default: 0, note: '默认值，可修改' },
      { name: '预安排停运率(次/备注生)', key: 'scheduledOutageRate', type: 'number', default: 0, note: '默认值，可修改' },
      { name: '预安排停运平均持续时间(min/次)', key: 'scheduledOutageDuration', type: 'number', default: 0, note: '默认值，可修改' },
      { name: '故障定位时间(min/次)', key: 'faultLocationTime', type: 'number', default: 60, note: '默认值，可修改' }
    ]
  },
  {
    id: 'transformer',
    name: '变压器',
    type: 'transformer',
    icon: '🔄',
    image: '/images/components/transformer.svg',
    category: '变换',
    params: [
      { name: '故障停运率(次/备注)', key: 'failureRate', type: 'number', default: 0.002, note: '默认值，可修改' },
      { name: '平均故障修复时间(min/次)', key: 'failureRepairTime', type: 'number', default: 20, note: '默认值，可修改' },
      { name: '预安排停运率(次/备注生)', key: 'scheduledOutageRate', type: 'number', default: 0, note: '默认值，可修改' },
      { name: '预安排停运平均持续时间(min/次)', key: 'scheduledOutageDuration', type: 'number', default: 0, note: '默认值，可修改' }
    ]
  },
  {
    id: 'busbar',
    name: '母线',
    type: 'busbar',
    icon: '➖',
    image: '/images/components/busbar.svg',
    category: '传输',
    params: [
      { name: '平衡类型', key: 'balanceType', type: 'select', options: ['平衡', '不平衡'], default: '平衡', note: '默认平衡，可下拉选择不平衡' }
    ]
  },
  {
    id: 'switch',
    name: '开关',
    type: 'switch',
    icon: '🔘',
    image: '/images/components/switch.svg',
    category: '控制',
    params: [
      { name: '故障停运率(次/备注)', key: 'failureRate', type: 'number', default: 0.002, note: '默认值，可修改' },
      { name: '平均故障修复时间(min/次)', key: 'failureRepairTime', type: 'number', default: 20, note: '默认值，可修改' },
      { name: '预安排停运率(次/备注生)', key: 'scheduledOutageRate', type: 'number', default: 0.2, note: '默认值，可修改' },
      { name: '预安排停运平均持续时间(min/次)', key: 'scheduledOutageDuration', type: 'number', default: 60, note: '默认值，可修改' }
    ]
  },
  {
    id: 'line',
    name: '线路',
    type: 'line',
    icon: '━',
    image: '/images/components/line.svg',
    category: '传输',
    params: [
      { name: '故障停运率(次/km/备注)', key: 'failureRatePerKm', type: 'number', default: 0, note: '默认值，可修改' },
      { name: '线路长度(km)', key: 'lineLength', type: 'number', default: 1, note: '默认值，可修改' },
      { name: '永久性故障率(次/km/备注)', key: 'permanentFailureRate', type: 'number', default: 0, note: '默认值，可修改' },
      { name: '暂时性故障率(次/km/备注)', key: 'temporaryFailureRate', type: 'number', default: 0, note: '默认值，可修改' },
      { name: '故障停电平均持续时间(min/次)', key: 'failureDuration', type: 'number', default: 0, note: '默认值，可修改' },
      { name: '暂时性中断持续时间(min/次)', key: 'temporaryInterruptionDuration', type: 'number', default: 1, note: '默认值，可修改' },
      { name: '预安排停运率(次/km/备注)', key: 'scheduledOutageRate', type: 'number', default: 0, note: '默认值，可修改' },
      { name: '预安排停运平均持续时间(min/次)', key: 'scheduledOutageDuration', type: 'number', default: 0, note: '默认值，可修改' },
      { name: '故障停电位置修复率(次/备注)', key: 'faultRepairRate', type: 'number', default: 0, note: '默认值，可修改' },
      { name: '故障停电位置修复时间(min/次)', key: 'faultRepairTime', type: 'number', default: 15, note: '默认值，可修改' },
      { name: '预安排停运位置修复率(次/备注)', key: 'scheduledRepairRate', type: 'number', default: 1, note: '默认值，可修改' },
      { name: '预安排停运位置修复时间(min/次)', key: 'scheduledRepairTime', type: 'number', default: 0, note: '默认值，可修改' },
      { name: '转供能力切换时间(min/次)', key: 'transferSwitchTime', type: 'number', default: 60, note: '默认值，可修改' }
    ]
  },
  {
    id: 'connection-line',
    name: '连接线路',
    type: 'connection-line',
    icon: '╱',
    image: '/images/components/connection-line.svg',
    category: '传输',
    params: []
  },
  {
    id: 'solar',
    name: '光伏',
    type: 'solar',
    icon: '☀️',
    image: '/images/components/solar.svg',
    category: '电源',
    params: []
  },
  {
    id: 'wind',
    name: '风机',
    type: 'wind',
    icon: '💨',
    image: '/images/components/wind.svg',
    category: '电源',
    params: []
  },
  {
    id: 'storage',
    name: '储能',
    type: 'storage',
    icon: '🔋',
    image: '/images/components/storage.svg',
    category: '储能',
    params: []
  },
  {
    id: 'ups',
    name: 'UPS',
    type: 'ups',
    icon: '⚡',
    image: '/images/components/ups.svg',
    category: '电源',
    params: [
      { name: '可靠性参数设置', key: 'reliabilityConfig', type: 'select', options: ['自带可靠性参数设置', '不带可靠性参数设置'], default: '自带可靠性参数设置', note: '默认自带，可下拉选择不带' },
      { name: '可靠性计算方式', key: 'calculationMethod', type: 'select', options: ['自带计算A', '自带计算B'], default: '自带计算A', note: '参照图表' }
    ]
  },
  {
    id: 'atse',
    name: 'ATSE',
    type: 'atse',
    icon: '🔀',
    image: '/images/components/atse.svg',
    category: '控制',
    params: [
      { name: '可靠性参数设置', key: 'reliabilityConfig', type: 'select', options: ['自带可靠性参数设置', '不带可靠性参数设置'], default: '自带可靠性参数设置', note: '默认自带，可下拉选择不带' },
      { name: '故障停运率(次/备注)', key: 'failureRate', type: 'number', default: 0, note: '默认值，可修改' },
      { name: '平均切换时间(min/次)', key: 'avgSwitchTime', type: 'number', default: 0.04, note: '默认值，可修改' },
      { name: '故障停电平均持续时间(min/次)', key: 'failureDuration', type: 'number', default: 200, note: '默认值，可修改' }
    ]
  },
  {
    id: 'sts',
    name: 'STS',
    type: 'sts',
    icon: '⚡',
    image: '/images/components/sts.svg',
    category: '控制',
    params: [
      { name: '可靠性参数设置', key: 'reliabilityConfig', type: 'select', options: ['自带可靠性参数设置', '不带可靠性参数设置'], default: '自带可靠性参数设置', note: '默认自带，可下拉选择不带' },
      { name: '故障停运率(次/备注)', key: 'failureRate', type: 'number', default: 0, note: '默认值，可修改' },
      { name: '平均切换时间(min/次)', key: 'avgSwitchTime', type: 'number', default: 1.67e-5, note: '默认值，可修改' },
      { name: '故障停电平均持续时间(min/次)', key: 'failureDuration', type: 'number', default: 60, note: '默认值，可修改' }
    ]
  },
  {
    id: 'reactive-compensator',
    name: '无功补偿器',
    type: 'reactive-compensator',
    icon: '⚙️',
    image: '/images/components/reactive-compensator.svg',
    category: '补偿',
    params: []
  },
  {
    id: 'load',
    name: '负荷',
    type: 'load',
    icon: '📊',
    image: '/images/components/load.svg',
    category: '负载',
    params: [
      { name: '平均负荷(kW)', key: 'avgLoad', type: 'number', default: 1, note: '默认值，可修改' },
      { name: '用户负荷类型', key: 'loadType', type: 'select', options: ['平均', '不平均'], default: '平均', note: '默认平均，可下拉选择不平均' },
      { name: '用户停电损失', key: 'outageCost', type: 'number', default: 0, note: '默认值，可修改' },
      { name: '用户停电持续时间', key: 'outageDuration', type: 'number', default: 0, note: '默认值，可修改' }
    ]
  }
]

// 根据type获取组件定义
export const getComponentByType = (type) => {
  return componentTypes.find(c => c.type === type)
}

