import request from '@/utils/request'

export function listPageBoms(data) {
  return request({
    url: '/base/bom/listPageBoms',
    method: 'post',
    data: data
  })
}

//添加信息
export function addBom(data) {
  return request({
    url: '/base/bom/addBom',
    method: 'post',
    data: data
  })
}

//修改信息
export function updateBom(data) {
  return request({
    url: '/base/bom/updateBom',
    method: 'post',
    data: data
  })
}

//启用禁用
export function updateDisableBom(id, isdisable) {
  return request({
    url: '/base/bom/update',
    method: 'post',
    data: {
      id: id,
      isdisable: isdisable
    }
  })
}

//设置是否默认
export function updateIsDefaultBom(id, isdefault,prodId) {
  return request({
    url: '/base/bom/updateIsDefaultBom',
    method: 'post',
    data: {
      id: id,
      isdefault: isdefault,
      prodId: prodId
    }
  })
}

//删除功能
export function deleteBoms(ids) {
  return request({
    url: '/base/bom/deleteBoms',
    method: 'post',
    data: {
      ids: ids
    }
  })
}

export function exportExcelBoms(data) {
  return request({
    url: '/base/bom/exportExcelBoms',
    method: 'post',
    responseType: 'blob',
    data: data
  })
}


