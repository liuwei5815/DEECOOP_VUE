import request from '@/utils/request'

//开票管理查询
export function listPageSaleInvoice(data) {
  return request({
    url: '/sale/saleInvoice/listPageSaleInvoice',
    method: 'post',
    data: data
  })
}

//添加开票单
export function addSaleInvoice(data) {
  return request({
    url: '/sale/saleInvoice/addSaleInvoice',
    method: 'post',
    data: data
  })
}

//修改开票单
export function updateSaleInvoice(data) {
  return request({
    url: '/sale/saleInvoice/updateSaleInvoice',
    method: 'post',
    data: data
  })
}

//修改开票单(状态)
export function updateStateBySaleInvoice(data) {
  return request({
    url: '/sale/saleInvoice/updateStateBySaleInvoice',
    method: 'post',
    data: data
  })
}

//删除开票单
export function deleteSaleInvoice(data) {
  return request({
    url: '/sale/saleInvoice/deleteSaleInvoice',
    method: 'post',
    data: data
  })
}


