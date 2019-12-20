import request from '@/utils/request'

//获取系统时间(指定的时间格式)
export function findSystemDateTime(data) {
  return request({
    url: '/system/findSystemDateTime',
    method: 'post',
    data: data
  })
}

/**
 * 获取用户所属部门
 * 1. (用户id, 组织类型id) 关联表查询(用户表,用户员工,员工岗位,部门表)
 * 2. (企业id, 组织类型id) 部门表查询
 *
 * 接口参数
 *   userId: 用户id
 *   deptType: 组织类型 字典表(pid:8421e4f093a44f029dddbc4ab13068be:部门类型)
 *
 * 返回值:
 *   deptId: 部门ID
 *   deptName: 部门名称
 *
 */
export function findUserDepartmentByUser(data) {
  return request({
    url: '/system/findUserDepartmentByUser',
    method: 'post',
    data: data
  })
}
