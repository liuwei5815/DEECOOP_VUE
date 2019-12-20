import request from '@/utils/request'

export function listPagePurchaseSignDetails(data) {
  return request({
    url: '/purchase/purchaseSignDetail/listPagePurchaseSignDetails',
    method: 'post',
    data: data
  })
}

//获取采购签收单明细-根据入库单id
export function listPagePurchaseSignDetailByIn(data) {
  return request({
    url: '/purchase/purchaseSignDetail/listPagePurchaseSignDetailByIn',
    method: 'post',
    data: data
  })
}

