import request from '@/utils/request'

export function listPageEquipmentMaintain(data) {
  return request({
    url: '/equipment/equipmentMaintain/listPageEquipmentMaintain',
    method: 'post',
    data: data
  })
}

//保养-设备保养单(领取)
export function maintainReceive(data) {
  return request({
    url: '/equipment/equipmentMaintain/maintainReceive',
    method: 'post',
    data: data
  })
}

//逻辑删除-设备保养单
//修改-设备保养单(是否禁用状态)-(禁用)
export function updateDisableMaintain(data) {
  return request({
    url: '/equipment/equipmentMaintain/updateDisableMaintain',
    method: 'post',
    data: data
  })
}

//新增-根据计划执行日期-维修保养单
export function addEquipmentMaintain(data) {
  return request({
    url: '/equipment/equipmentMaintain/addEquipmentMaintain',
    method: 'post',
    data: data
  })
}
