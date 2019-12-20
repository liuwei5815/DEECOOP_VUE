import request from '@/utils/request'

//开票管理明细查询
export function listPageSaleInvoiceDetail(data) {
  return request({
    url: '/sale/saleInvoiceDetail/listPageSaleInvoiceDetail',
    method: 'post',
    data: data
  })
}



