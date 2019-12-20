import request from '@/utils/request'

export function listPageLogInfo(data) {
  return request({
    url: '/system/logInfo/listPageLogInfos',
    method: 'post',
    data: {
      ...data
    }
  })
}
export function updateDisableLogInfo(id, isdisable) {
  return request({
    url: '/system/logInfo/update',
    method: 'post',
    data: {
      id: id,
      isdisable: isdisable
    }
  })
}
export function addLogInfo(data) {
  return request({
    url: '/system/logInfo/save',
    method: 'post',
    data: {
      ...data
    }
  })
}

export function updateLogInfo(data) {
  return request({
    url: '/system/logInfo/update',
    method: 'post',
    data: {
      ...data
    }
  })
}

export function deleteLogInfos(ids) {
  return request({
    url: '/system/logInfo/deleteByIds',
    method: 'post',
    data: {
      ids: ids
    }
  })
}



export function exportExcelLogInfos(ids) {
  return request({
    url: '/system/logInfo/exportExcelLogInfos',
    method: 'post',
    responseType: 'blob',
    data: {
      ids: ids
    }
  })
}
