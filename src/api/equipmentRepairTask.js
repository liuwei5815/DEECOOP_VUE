import request from '@/utils/request'

export function listPageEquipmentRepairTask(data) {
  return request({
    url: '/equipment/equipmentRepairTask/listPageEquipmentRepairTask',
    method: 'post',
    data: data
  })
}

//取消-设备维修任务
export function cancelRepairTask(data) {
  return request({
    url: '/equipment/equipmentRepairTask/cancelRepairTask',
    method: 'post',
    data: data
  })
}
