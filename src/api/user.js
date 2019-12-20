import request from '@/utils/request'


export function listPageUsers(data) {
  return request({
    url: '/system/user/listPageUsers',
    method: 'post',
    data: data
  })
}

export function updateUser(data) {
  return request({
    url: '/system/user/updateUser',
    method: 'post',
    data: data
  })
}
//修改用户密码
export function updateUserByPassword(data) {
  return request({
    url: '/system/user/updateUserByPassword',
    method: 'post',
    data: data
  })
}

export function updateDisableUser(id, isdisable) {
  return request({
    url: '/system/user/update',
    method: 'post',
    data: {
      id: id,
      isdisable: isdisable
    }
  })
}

export function addUser(data) {
  return request({
    url: '/system/user/addUser',
    method: 'post',
    data: data
  })
}

export function deleteUsers(ids) {
  return request({
    url: '/system/user/deleteUsers',
    method: 'post',
    data: {
      ids: ids
    }
  })
}

export function resetPasswords(ids) {
  return request({
    url: '/system/user/updatePasswords',
    method: 'post',
    data: {
      ids: ids
    }
  })
}

export function countUserNum(deptId) {
  return request({
    url: '/system/user/selectCountUserNum',
    method: 'post',
    data: {
      deptId: deptId
    }
  })
}


export function updateEmployeeUserUnbind(data) {
  return request({
    url: '/system/user/updateEmployeeUserUnbind',
    method: 'post',
    data: data
  })
}

export function updateEmployeeUserBind(data) {
  return request({
    url: '/system/user/updateEmployeeUserBind',
    method: 'post',
    data: data
  })
}


export function exportExcelUsers(ids) {
  return request({
    url: '/system/user/exportExcelUsers',
    method: 'post',
    responseType: 'blob',
    data: {
      ids: ids
    }
  })
}


export function getInfo(token) {
  return request({
    url: '/system/user/info',
    method: 'get',
    params: { token }
  })
}

/**
 * 获取用户所属部门
 * 返回值:
 *   deptId: 部门ID
 *   deptName: 部门名称
 *
 * @param data
 */
export function findUserDepartmentBySystemUser(data) {
  return request({
    url: '/system/user/findUserDepartmentByUser',
    method: 'post',
    data: data
  })
}
