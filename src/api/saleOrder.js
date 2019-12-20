import request from '@/utils/request'

//订单列表
export function listPageSaleOrder(data) {
  return request({
    url: '/sale/saleOrder/listPageSaleOrder',
    method: 'post',
    data: data
  })
}

//订单详情
export function listPageOrderCollectByInfo(data) {
  return request({
    url: '/sale/saleOrder/listPageOrderCollectByInfo',
    method: 'post',
    data: data
  })
}

//订单查询
export function listPageSaleOrderQuery(data) {
  return request({
    url: '/sale/saleOrderQuery/listPageSaleOrderQuery',
    method: 'post',
    data: data
  })
}

//订单查询(开票管理-勾选订单)
export function listPageOrderByInvoice(data) {
  return request({
    url: '/sale/saleOrder/listPageOrderByInvoice',
    method: 'post',
    data: data
  })
}

//添加订单
export function addSaleOrder(data) {
  return request({
    url: '/sale/saleOrder/addSaleOrder',
    method: 'post',
    data: data
  })
}

//修改订单
export function updateSaleOrder(data) {
  return request({
    url: '/sale/saleOrder/updateSaleOrder',
    method: 'post',
    data: data
  })
}

//取消订单
export function cancelSaleOrder(id) {
  return request({
    url: '/sale/saleOrder/cancelSaleOrder',
    method: 'post',
    data:  {id: id}
  })
}

export function recoverySaleOrder(id) {
  return request({
    url: '/sale/saleOrder/recoverySaleOrder',
    method: 'post',
    data:  {id: id}
  })
}

//删除订单
export function deleteSaleOrder(id) {
  return request({
    url: '/sale/saleOrder/deleteSaleOrder',
    method: 'post',
    data:  {id: id}
  })
}

//退回订单
export function rebackSaleOrder(id) {
  return request({
    url: '/sale/saleOrder/rebackSaleOrder',
    method: 'post',
    data: {id: id}
  })
}

//提交订单
/**
 * orderJsonStr: {id:''}
 * @param data
 */
export function submitSaleOrder(data) {
  return request({
    url: '/sale/saleOrder/submitSaleOrder',
    method: 'post',
    data: data
  })
}


//修改订单-订单明细(产品锁定库存数量)
//{orderId:订单id, dtlJsonStr:订单明细{{id:明细id, lockCount:锁定货品数量(计量单位), needDeliverCount:锁定货品数量}}}
export function updateSaleOrderByLockCount(data) {
  return request({
    url: '/sale/saleOrder/updateSaleOrderByLockCount',
    method: 'post',
    data: data
  })
}

//变更订单-变更订单明细(订购数量,锁定货品数量)
export function updateSaleOrderByChange(data) {
  return request({
    url: '/sale/saleOrder/updateSaleOrderByChange',
    method: 'post',
    data: data
  })
}


export function getSaleOrderCollectByOrderId(data) {
  return request({
    url: '/sale/saleOrder/getSaleOrderCollectByOrderId',
    method: 'post',
    data: data
  })
}


//修改客户信息
export function updateCustomerBalance(data) {
  return request({
    url: '/sale/saleOrder/updateCustomerBalance',
    method: 'post',
    data: data
  })
}


export function addCustomerBalance(data) {
  return request({
    url: '/sale/saleOrder/addCustomerBalance',
    method: 'post',
    data: data
  })
}

export function exportExcelSaleOrder(data) {
  return request({
    url: '/sale/saleOrder/exportExcelSaleOrder',
    method: 'post',
    responseType: 'blob',
    data: data
  })
}

