import request from '@/utils/request'


export function listPageFinanceHistorys(data) {
  return request({
    url: '/finance/financeHistory/listPageFinanceHistorys',
    method: 'post',
    data: data
  })
}
