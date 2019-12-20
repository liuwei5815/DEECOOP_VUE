import request from '@/utils/request'

//订单明细变更记录
export function listPageSaleOrderDetailChange(data) {
  return request({
    url: '/sale/saleOrderDetailChange/listPageSaleOrderDetailChange',
    method: 'post',
    data: data
  })
}


