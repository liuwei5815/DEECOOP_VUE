import request from '@/utils/request'

//设备保养内容列表
export function listPageMaintainContent(data) {
  return request({
    url: '/equipment/equipmentMaintainContent/listPageMaintainContent',
    method: 'post',
    data: data
  })
}

//获取下拉控件-设备保养内容
export function selectListMaintainContent(data) {
  return request({
    url: '/equipment/equipmentMaintainContent/selectListMaintainContent',
    method: 'post',
    data: data
  })
}

//新增-设备保养内容
export function addMaintainContent(data) {
  return request({
    url: '/equipment/equipmentMaintainContent/addMaintainContent',
    method: 'post',
    data: data
  })
}

//修改-设备保养内容
export function updateMaintainContent(data) {
  return request({
    url: '/equipment/equipmentMaintainContent/updateMaintainContent',
    method: 'post',
    data: data
  })
}

//逻辑删除-设备保养内容
//修改-设备保养内容(是否禁用状态)-(禁用)
export function updateDisableMaintainContent(data) {
  return request({
    url: '/equipment/equipmentMaintainContent/updateDisableMaintainContent',
    method: 'post',
    data: data
  })
}

