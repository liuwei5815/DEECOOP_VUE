import request from '@/utils/request'

export function listPageTemplate(data) {
  return request({
    url: '/system/template/listPageTemplates',
    method: 'post',
    data: {
      ...data
    }
  })
}
export function updateDisableTemplate(id, isdisable) {
  return request({
    url: '/system/template/update',
    method: 'post',
    data: {
      id: id,
      isdisable: isdisable
    }
  })
}
export function addTemplate(data) {
  return request({
    url: '/system/template/save',
    method: 'post',
    data: {
      ...data
    }
  })
}

export function updateTemplate(data) {
  return request({
    url: '/system/template/update',
    method: 'post',
    data: {
      ...data
    }
  })
}

export function deleteTemplates(ids) {
  return request({
    url: '/system/template/deleteByIds',
    method: 'post',
    data: {
      ids: ids
    }
  })
}


export function exportExcelTemplates(ids) {
  return request({
    url: '/system/template/exportExcelTemplates',
    method: 'post',
    responseType: 'blob',
    data: {
      ids: ids
    }
  })
}
