import request from '@/utils/request'

export function listPageCompanyAdmins(data) {
  return request({
    url: '/system/company/listPageCompanyAdmins',
    method: 'post',
    data: {
      ...data
    }
  })
}
export function updateDisableCompany(id, isdisable) {
  return request({
    url: '/system/department/update',
    method: 'post',
    data: {
      id: id,
      isdisable: isdisable
    }
  })
}
export function addCompanyAdmin(data) {
  return request({
    url: '/system/company/addCompanyAdmin',
    method: 'post',
    data: {
      ...data
    }
  })
}

export function updateCompany(data) {
  return request({
    url: '/system/company/updateCompany',
    method: 'post',
    data: {
      ...data
    }
  })
}


export function deleteCompanyAdmins(companyIds, userRoleIds, userIds) {
  return request({
    url: '/system/company/deleteCompanyAdmins',
    method: 'post',
    data: {
      companyIds: companyIds,
      userRoleIds: userRoleIds,
      userIds: userIds
    }
  })
}

export function exportExcelCompanys(ids) {
  return request({
    url: '/system/company/exportExcelCompanys',
    method: 'post',
    responseType: 'blob',
    data: {
      ids: ids
    }
  })
}

export function findListCompany(data) {
  return request({
    url: '/system/company/findListCompany',
    method: 'post',
    data: data
  })
}

//企业管理员修改企业名称
export function updateCompanyByCompanyUser(data) {
  return request({
    url: '/system/company/updateCompanyByCompanyUser',
    method: 'post',
    data: data
  })
}
