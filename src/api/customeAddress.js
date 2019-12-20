import request from '@/utils/request'

export function listPageCustomeAddress(data) {
  return request({
    url: '/base/customeAddress/listPageCustomeAddress',
    method: 'post',
    data: data
  })
}

//添加客户地址信息
export function addCustomerAddress(data) {
  return request({
    url: '/base/customeAddress/addCustomerAddress',
    method: 'post',
    data: data
  })
}

//修改客户地址信息
export function updateCustomerAddress(data) {
  return request({
    url: '/base/customeAddress/updateCustomerAddress',
    method: 'post',
    data: data
  })
}

//修改客户地址默认值
export function updateDefaultCustomerAddress(addressId, customerId, isdefault) {
  return request({
    url: '/base/customeAddress/updateDefaultCustomerAddress',
    method: 'post',
    data: {
      addressId: addressId,
      customerId: customerId,
      isdefault: isdefault
    }
  })
}

//客户地址删除功能
export function deleteCustomerAddress(ids) {
  return request({
    url: '/base/customeAddress/deleteCustomerAddress',
    method: 'post',
    data: {
      ids: ids
    }
  })
}

