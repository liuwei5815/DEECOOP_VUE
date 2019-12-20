import request from '@/utils/request'

export function getusermenu(id) {
  return request({
    url: '/system/mainPage/listUserDefinedMenu',
    method: 'post',
    data: {
      userID: id
    }
  })
}

export function saveusermenu(list) {
  return request({
    url: '/system/mainPage/saveUserDefinedMenu',
    method: 'post',
    data: {
      userDefinedMenus: list
    }
  })
}

export function listRoleMeunAll(data) {
  return request({
    url: '/system/mainPage/listRoleMeunAll',
    method: 'post',
    data: data
  })
}
