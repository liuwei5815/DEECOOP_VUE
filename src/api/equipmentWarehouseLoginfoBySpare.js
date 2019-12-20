import request from '@/utils/request'

export function findListWarehouseLoginfoBySpare(data) {
  return request({
    url: '/equipment/warehouseLoginfoBySpare/findListWarehouseLoginfoBySpare',
    method: 'post',
    data: data
  })
}

