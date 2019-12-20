import request from '@/utils/request'

export function listPageMessages(data) {
  return request({
    url: '/system/message/listPageMessages',
    method: 'post',
    data: data
  })
}

export function addMessage(data) {
  return request({
    url: '/system/message/addMessage',
    method: 'post',
    data: data
  })
}

export function updateMessage(data) {
  return request({
    url: '/system/message/updateMessage',
    method: 'post',
    data: data
  })
}

export function updateIsShowMessage(data) {
  return request({
    url: '/system/message/updateIsShowMessage',
    method: 'post',
    data: data
  })
}

export function deleteMessage(data) {
  return request({
    url: '/system/message/deleteMessage',
    method: 'post',
    data: data
  })
}
