import request from '@/utils/request'

export function listPagePurchaseSigns(data) {
  return request({
    url: '/purchase/purchaseSign/listPagePurchaseSigns',
    method: 'post',
    data: data
  })
}
