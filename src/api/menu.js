import request from '@/utils/request'

export function gettreemeuns(data) {
  return request({
    url: '/system/menu/treeMeuns',
    method: 'post',
    data: data
  })
}

export function getListPageMenus(data) {
  return request({
    url: '/system/menu/listPageMenus',
    method: 'post',
    data: data
  })
}

export function addSysMenu(data) {
  return request({
    url: '/system/menu/addMenu',
    method: 'post',
    data: data
  })
}

export function deleteSysMenus(data) {
  return request({
    url: '/system/menu/deleteMenus',
    method: 'post',
    data: data
  })
}

export function updateSysMenu (data) {
  return request({
    url: '/system/menu/updateMenu',
    method: 'post',
    data: data
  })
}

export function updateSysMenuDisable (data) {
  return request({
    url: '/system/menu/updateMenuDisable',
    method: 'post',
    data: data
  })
}

export function updateDisableMenu(data) {
  return request({
    url: '/system/menu/updateDisableMenu',
    method: 'post',
    data: data
  })
}

/**
 * 根据给定的菜单Url(菜单路由名称)与当前企业管理员角色配置的系统菜单-是否匹配
 * 返回值:
 * isExist:
 *     true:  与当前企业管理员角色配置的系统菜单匹配
 *     false: 与当前企业管理员角色配置的系统菜单不匹配
 * message:
 *
 * @param data
 */
export function findIsExistMenu(data) {
  return request({
    url: '/system/menu/findIsExistMenu',
    method: 'post',
    data: data
  })
}
