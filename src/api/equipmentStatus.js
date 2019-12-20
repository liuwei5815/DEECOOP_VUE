import request from '@/utils/request'

export function findEquipmentState(data) {
  return request({
    url: '/equipment/equipmentStatus/findEquipmentState',
    method: 'post',
    data: data
  })
}

export function getOutputAndDate(data) {
  return request({
    url: '/equipment/equipmentStatus/getOutputAndDate',
    method: 'post',
    data: data
  })
}

export function get24HoursData(data) {
  return request({
    url: '/equipment/equipmentStatus/get24HoursData',
    method: 'post',
    data: data
  })
}

export function get24HoursDataDetail(data) {
  return request({
    url: '/equipment/equipmentStatus/get24HoursDataDetail',
    method: 'post',
    data: data
  })
}

export function listPageEquipmentRepair(data) {
  return request({
    url: '/equipment/equipmentRepair/listPageEquipmentRepair',
    method: 'post',
    data: data
  })
}

export function listPageEquipmentRepairTask(data) {
  return request({
    url: '/equipment/equipmentRepairTask/listPageEquipmentRepairTask',
    method: 'post',
    data: data
  })
}

export function findListRepairTaskDetailByInfo(data) {
  return request({
    url: '/equipment/equipmentRepairTaskDetail/findListRepairTaskDetailByInfo',
    method: 'post',
    data: data
  })
}
