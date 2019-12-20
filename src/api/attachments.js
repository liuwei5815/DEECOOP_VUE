import request from '@/utils/request'

export function listPageAttachments(data) {
  return request({
    url: '/fileIO/attachment/listPageAttachments',
    method: 'post',
    data: data
  })
}

//删除功能
export function deleteAttachment(data) {
  return request({
    url: '/fileIO/attachment/deleteAttachment',
    method: 'post',
    data: data
  })
}



