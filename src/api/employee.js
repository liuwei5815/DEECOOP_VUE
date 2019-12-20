import request from '@/utils/request'

export function listPageEmployees(data) {
  return request({
    url: '/system/employee/listPageEmployees',
    method: 'post',
    data: data
  })
}

//添加员工信息
export function addEmployee(data) {
  return request({
    url: '/system/employee/addEmployeeAndUser',
    method: 'post',
    data: data
  })
}
//开通账号
export function addEmployToUser(jsonStr) {
  return request({
    url: '/system/employee/addEmployToUser',
    method: 'post',
    data: {
      employRoles: jsonStr
    }
  })
}
//修改员工信息
export function updateEmployeeAndUser(data) {
  return request({
    url: '/system/employee/updateEmployeeAndUser',
    method: 'post',
    data: data
  })
}

//员工启用禁用
export function updateDisableEmployee(id,employeeId,userId,isdisable) {
  return request({
    url: '/system/employee/updateDisableEmployee',
    method: 'post',
    data: {
      id: id,
      employeeId: employeeId,
      userId: userId,
      isdisable: isdisable
    }
  })
}
//员工删除功能
export function deleteEmployees(employeeIds) {
  return request({
    url: '/system/employee/deleteEmployees',
    method: 'post',
    data: {
      employeeIds: employeeIds
    }
  })
}
//删除按钮-删除员工岗位
export function deleteEmployeeByPost(data) {
  return request({
    url: '/system/employee/deleteEmployeeByPost',
    method: 'post',
    data
  })
}

//设置员工兼岗
export function addEmployeePluralityPost(data) {
  return request({
    url: '/system/employee/addEmployeePluralityPost',
    method: 'post',
    data: data
  })
}

//设置员工主岗
export function addEmployeeMainPost(data) {
  return request({
    url: '/system/employee/addEmployeeMainPost',
    method: 'post',
    data: data
  })
}


export function exportExcelEmployees(ids) {
  return request({
    url: '/system/employee/exportExcelEmployees',
    method: 'post',
    responseType: 'blob',
    data: {
      ids: ids
    }
  })
}

//修改员工合同到期日期
export function updateEmployeeByContractDate(data) {
  return request({
    url: '/system/employee/updateEmployeeByContractDate',
    method: 'post',
    data: data
  })
}


