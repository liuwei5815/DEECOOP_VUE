import request from '@/utils/request'

export function listPageCustomers(data) {
  return request({
    url: '/base/customer/listPageCustomers',
    method: 'post',
    data: data
  })
}

export function listTreeCustomer(data) {
  return request({
    url: '/base/customer/listTreeCustomer',
    method: 'post',
    data: data
  })
}

export function listPageCustomerAccountDays(data) {
  return request({
    url: '/base/customer/listPageCustomerAccountDays',
    method: 'post',
    data: data
  })
}

//添加客户信息
export function addCustomer(data) {
  return request({
    url: '/base/customer/addCustomer',
    method: 'post',
    data: data
  })
}

//修改客户信息
export function updateCustomer(data) {
  return request({
    url: '/base/customer/updateCustomer',
    method: 'post',
    data: data
  })
}

//客户启用禁用
export function updateDisableCustomer(id, isdisable) {
  return request({
    url: '/base/customer/updateDisableCustomer',
    method: 'post',
    data: {
      id: id,
      isdisable: isdisable
    }
  })
}

//客户删除功能
export function deleteCustomers(ids) {
  return request({
    url: '/base/customer/deleteCustomers',
    method: 'post',
    data: {
      ids: ids
    }
  })
}

export function exportExcelCustomers(ids) {
  return request({
    url: '/base/customer/exportExcelCustomers',
    method: 'post',
    responseType: 'blob',
    data: {
      ids: ids
    }
  })
}

export function listPageCustomerReceive(data) {
  return request({
    url: '/base/customer/listPageCustomerReceive',
    method: 'post',
    data: data
  })
}

/**
 * 获取当前企业客户树形结构
 * 接口参数:
 *   companyId: 企业id(登录用户所属企业id)
 *   customerGenre: 客户属性(字典表 vmes_dictionary)
 *     49c0a7ebcb4c4175bd5195837a6a9a13 供应商
 *     df7cb67fca4148bc9632c908e4a7fdea 客户
 *
 * @return
 */
export function treeCustomer(data) {
  return request({
    url: '/base/customer/treeCustomer',
    method: 'post',
    data: data
  })
}



