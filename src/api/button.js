import request from '@/utils/request'

export function addMeunButton (data) {
  return request({
    url: '/system/button/addMeunButton',
    method: 'post',
    data: data
  })
}

export function updateMeunButton (data) {
  return request({
    url: '/system/button/updateMeunButton',
    method: 'post',
    data: data
  })
}

export function updateDisableMeunButton(data) {
  return request({
    url: '/system/button/updateDisableMeunButton',
    method: 'post',
    data: data
  })
}

export function deleteMeunButtons(data) {
  return request({
    url: '/system/button/deleteMeunButtons',
    method: 'post',
    data: data
  })
}

export function listPageMenuButtons(data) {
  return request({
    url: '/system/button/listPageMenuButtons',
    method: 'post',
    data: data
  })
}


export function initMenuButtons(data) {
  return request({
    url: '/system/button/initMenuButtons',
    method: 'post',
    data: data
  })
}







