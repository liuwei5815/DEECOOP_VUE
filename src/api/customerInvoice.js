import request from '@/utils/request'

export function listPageCustomerInvoices(data) {
  return request({
    url: '/base/customerInvoice/listPageCustomerInvoices',
    method: 'post',
    data: data
  })
}

export function findIsExistCustomerInvoice(data) {
  return request({
    url: '/base/customerInvoice/findIsExistCustomerInvoice',
    method: 'post',
    data: data
  })
}

//添加客户开票信息
export function addCustomerInvoice(data) {
  return request({
    url: '/base/customerInvoice/addCustomerInvoice',
    method: 'post',
    data: data
  })
}

//修改客户开票信息
export function updateCustomerInvoice(data) {
  return request({
    url: '/base/customerInvoice/updateCustomerInvoice',
    method: 'post',
    data: data
  })
}

//修改开票信息默认值
export function updateDefaultCustomerInvoice(data) {
  return request({
    url: '/base/customerInvoice/updateDefaultCustomerInvoice',
    method: 'post',
    data: data
  })
}

//客户开票信息删除功能
export function deleteCustomerInvoice(ids) {
  return request({
    url: '/base/customerInvoice/deleteCustomerInvoice',
    method: 'post',
    data: {
      ids: ids
    }
  })
}
