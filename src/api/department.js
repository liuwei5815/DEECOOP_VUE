import request from '@/utils/request'

export function listTreeDepartment(data) {
  return request({
    url: '/system/department/treeDepartments',
    method: 'post',
    data: {
      ...data
    }
  })
}
export function listPageDepartment(data) {
  return request({
    url: '/system/department/listPageDepartments',
    method: 'post',
    data: {
      ...data
    }
  })
}
export function updateDisableDepartment(id, isdisable) {
  return request({
    url: '/system/department/updateDisableDept',
    method: 'post',
    data: {
      id: id,
      isdisable: isdisable
    }
  })
}
export function addDepartment(data) {
  return request({
    url: '/system/department/addDepartment',
    method: 'post',
    data: {
      ...data
    }
  })
}

export function updateDepartment(data) {
  return request({
    url: '/system/department/updateDepartment',
    method: 'post',
    data: {
      ...data
    }
  })
}

export function deleteDepartments(ids) {
  return request({
    url: '/system/department/deleteDepartments',
    method: 'post',
    data: {
      ids: ids
    }
  })
}

export function deleteDepartment(data) {
  return request({
    url: '/system/department/deleteDepartment',
    method: 'post',
    data: data
  })
}

export function treeDepartments (data) {
  return request({
    url: '/system/department/treeDepartments',
    method: 'post',
    data: data
  })
}


export function exportExcelDepartments(ids) {
  return request({
    url: '/system/department/exportExcelDepartments',
    method: 'post',
    responseType: 'blob',
    data: {
      ids: ids
    }
  })
}

