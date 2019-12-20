import request from '@/utils/request'

export function listPageEquipments(data) {
  return request({
    url: '/base/equipment/listPageEquipments',
    method: 'post',
    data: data
  })
}

//添加信息
export function addEquipment(data) {
  return request({
    url: '/base/equipment/addEquipment',
    method: 'post',
    data: data
  })
}

//修改信息
export function updateEquipment(data) {
  return request({
    url: '/base/equipment/updateEquipment',
    method: 'post',
    data: data
  })
}

//启用禁用
export function updateDisableEquipment(id, isdisable) {
  return request({
    url: '/base/equipment/update',
    method: 'post',
    data: {
      id: id,
      isdisable: isdisable
    }
  })
}

//删除功能
export function deleteEquipments(ids) {
  return request({
    url: '/base/equipment/deleteByIds',
    method: 'post',
    data: {
      ids: ids
    }
  })
}

export function exportExcelEquipments(ids) {
  return request({
    url: '/base/equipment/exportExcelEquipments',
    method: 'post',
    responseType: 'blob',
    data: {
      ids: ids
    }
  })
}

export function treeDepartmentEquipment(data) {
  return request({
    url: '/base/equipment/treeDepartmentEquipment',
    method: 'post',
    data: data
  })
}

