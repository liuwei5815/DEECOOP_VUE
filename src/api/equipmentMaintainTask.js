import request from '@/utils/request'

export function listPageEquipmentMaintainTask(data) {
  return request({
    url: '/equipment/equipmentMaintainTask/listPageEquipmentMaintainTask',
    method: 'post',
    data: data
  })
}

//取消-设备保养任务
export function cancelMaintainTask(data) {
  return request({
    url: '/equipment/equipmentMaintainTask/cancelMaintainTask',
    method: 'post',
    data: data
  })
}
