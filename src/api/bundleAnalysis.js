import request from '@/utils/request'

export function getBomTreeProduct(data) {
  return request({
    url: '/purchase/bundleAnalysis/getBomTreeProduct',
    method: 'post',
    data: data
  })
}

export function getLackProduct(data) {
  return request({
    url: '/purchase/bundleAnalysis/getLackProduct',
    method: 'post',
    data: data
  })
}
