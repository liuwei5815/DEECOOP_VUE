import request from '@/utils/request'

//设备保养计划列表
export function listPageEquipmentMaintainPlan(data) {
  return request({
    url: '/equipment/equipmentMaintainPlan/listPageEquipmentMaintainPlan',
    method: 'post',
    data: data
  })
}

//设备保养计划-获取系统计划-根据保养开始日期自动计算
export function findSysPeriodTypeOption(data) {
  return request({
    url: '/equipment/equipmentMaintainPlan/findSysPeriodTypeOption',
    method: 'post',
    data: data
  })
}

//(保养计划id,设备id,保养内容id) 是否存在计划
export function findIsExistByEquipmentConten(data) {
  return request({
    url: '/equipment/equipmentMaintainPlan/findIsExistByEquipmentConten',
    method: 'post',
    data: data
  })
}

//添加-设备保养计划(周期计划)
export function addMaintainPlan(data) {
  return request({
    url: '/equipment/equipmentMaintainPlan/addMaintainPlan',
    method: 'post',
    data: data
  })
}

//添加-设备保养计划(自定义计划)
export function addMaintainPlanByCustom(data) {
  return request({
    url: '/equipment/equipmentMaintainPlan/addMaintainPlanByCustom',
    method: 'post',
    data: data
  })
}

//修改-设备保养计划(自定义计划)
export function updateMaintainPlanByCustom(data) {
  return request({
    url: '/equipment/equipmentMaintainPlan/updateMaintainPlanByCustom',
    method: 'post',
    data: data
  })
}

//修改-设备保养计划(周期计划)
export function updateMaintainPlan(data) {
  return request({
    url: '/equipment/equipmentMaintainPlan/updateMaintainPlan',
    method: 'post',
    data: data
  })
}



//逻辑删除-设备保养计划
//修改-设备保养计划(是否禁用状态)-(禁用)
export function updateDisableMaintainPlan(data) {
  return request({
    url: '/equipment/equipmentMaintainPlan/updateDisableMaintainPlan',
    method: 'post',
    data: data
  })
}
