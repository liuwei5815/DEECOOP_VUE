import request from '@/utils/request'

//(无订单)退货单明细
export function listPageSaleWaresRetreatDetail(data) {
  return request({
    url: '/sale/saleWaresRetreatDetail/listPageSaleWaresRetreatDetail',
    method: 'post',
    data: data
  })
}
