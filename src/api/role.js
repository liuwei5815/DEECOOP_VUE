import request from '@/utils/request'

export function listPageRoles(data) {
  return request({
    url: '/system/role/listPageRoles',
    method: 'post',
    data: data
  })
}


export function saveRoleUsers (data) {
  return request({
    url: '/system/role/saveRoleUsers',
    method: 'post',
    data: data
  })
}

export function addRole (data) {
  return request({
    url: '/system/role/addRole',
    method: 'post',
    data: data
  })
}

export function updateRole (data) {
  return request({
    url: '/system/role/updateRole',
    method: 'post',
    data: data
  })
}

export function updateRoleDisable (data) {
  return request({
    url: '/system/role/updateDisableRole',
    method: 'post',
    data: data
  })
}

export function deleteRoles (data) {
  return request({
    url: '/system/role/deleteRoles',
    method: 'post',
    data: data
  })
}

// export function exportExcelRoles (data) {
//   return request({
//     url: '/system/role/exportExcelRoles',
//     method: 'post',
//     data: data
//   })
// }

export function importExcelRoles (data) {
  return request({
    url: '/system/role/importExcelRoles',
    method: 'post',
    data: data
  })
}

export function saveRoleMeuns (data) {
  return request({
    url: '/system/role/saveRoleMeuns',
    method: 'post',
    data: data
  })
}

export function treeRoleMeunsAll (data) {
  return request({
    url: '/system/role/treeRoleMeunsAll',
    method: 'post',
    data: data
  })
}

export function treeRoleMeunsSelected (data) {
  return request({
    url: '/system/role/treeRoleMeunsSelected',
    method: 'post',
    data: data
  })
}

export function listRoleMeunsButtonsAll (data) {
  return request({
    url: '/system/role/listRoleMeunsButtonsAll',
    method: 'post',
    data: data
  })
}

export function getRoleMeunsDataType (data) {
  return request({
    url: '/system/role/getRoleMeunsDataType',
    method: 'post',
    data: data
  })
}

export function saveRoleMeunsData (data) {
  return request({
    url: '/system/role/saveRoleMeunsData',
    method: 'post',
    data: data
  })
}

export function saveRoleMeunsButtons (data) {
  return request({
    url: '/system/role/saveRoleMeunsButtons',
    method: 'post',
    data: data
  })
}


export function dataListRoles(queryStr) {
  return request({
    url: '/system/role/dataListRoles',
    method: 'post',
    data: {
      queryStr: queryStr
    }
  })
}

export function listAllUsersByDeptId(data) {
  return request({
    url: '/system/role/listAllUsersByDeptId',
    method: 'post',
    data: data
  })
}

export function listUsersByRole(data) {
  return request({
    url: '/system/role/listUsersByRole',
    method: 'post',
    data: data
  })
}

export function listUserByRole(data) {
  return request({
    url: '/system/role/listUserByRole',
    method: 'post',
    data: data
  })
}

export function exportExcelRoles(ids) {
  return request({
    url: '/system/role/exportExcelRoles',
    method: 'post',
    responseType: 'blob',
    data: {
      ids: ids
    }
  })
}

export function findListUserByRole (data) {
  return request({
    url: '/system/role/findListUserByRole',
    method: 'post',
    data: data
  })
}

/**
 * 根据角色名称，创建角色
 * userType  用户类型id
 * roleName  角色名称
 *
 * result {roleId:'',roleName:'',type:''}
 */
export function addRoleByName (data) {
  return request({
    url: '/system/role/addRoleByName',
    method: 'post',
    data: data
  })
}

