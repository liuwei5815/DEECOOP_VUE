import request from '@/utils/request'

export function selectSaleLockDateByCompanyId(data) {
  return request({
    url: '/sale/saleLockDate/selectSaleLockDateByCompanyId',
    method: 'post',
    data: data
  })
}


//添加信息
export function addSaleLockDate(data) {
  return request({
    url: '/sale/saleLockDate/saveSaleLockDate',
    method: 'post',
    data: data
  })
}

//修改信息
export function updateSaleLockDate(data) {
  return request({
    url: '/sale/saleLockDate/updateSaleLockDate',
    method: 'post',
    data: data
  })
}





