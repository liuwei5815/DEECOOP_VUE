import request from '@/utils/request'

export function listPageSaleReceiveRecords(data) {
  return request({
    url: '/sale/saleReceiveRecord/listPageSaleReceiveRecords',
    method: 'post',
    data: data
  })
}

