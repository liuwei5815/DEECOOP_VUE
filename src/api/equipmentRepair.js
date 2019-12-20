import request from '@/utils/request'

export function listPageEquipmentRepair(data) {
  return request({
    url: '/equipment/equipmentRepair/listPageEquipmentRepair',
    method: 'post',
    data: data
  })
}

//新增-设备维修单
export function addEquipmentRepair(data) {
  return request({
    url: '/equipment/equipmentRepair/addEquipmentRepair',
    method: 'post',
    data: data
  })
}

//取消-设备维修单
export function cancelEquipmentRepair(data) {
  return request({
    url: '/equipment/equipmentRepair/cancelEquipmentRepair',
    method: 'post',
    data: data
  })
}

//维修-设备维修单(领取)
export function equipmentRepairReceive(data) {
  return request({
    url: '/equipment/equipmentRepair/equipmentRepairReceive',
    method: 'post',
    data: data
  })
}

