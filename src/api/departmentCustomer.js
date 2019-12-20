import request from '@/utils/request'

export function listPageDepartmentCustomer(data) {
  return request({
    url: '/base/departmentCustomer/listPageDepartmentCustomer',
    method: 'post',
    data: data
  })
}
