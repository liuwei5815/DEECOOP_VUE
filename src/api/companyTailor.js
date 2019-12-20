import request from '@/utils/request'

//获取当前企业是否存在定制化-通过企业管理员角色
//返回值: isExistCompanyTailor
//Y: 存在定制 N:不存在定制(默认值)
export function findIsExistCompanyTailorByCompanyRole(data) {
  return request({
    url: '/system/companyTailor/findIsExistCompanyTailorByCompanyRole',
    method: 'post',
    data: data
  })
}
