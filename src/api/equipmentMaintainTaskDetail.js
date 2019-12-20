import request from '@/utils/request'

export function listPageMaintainTaskDetail(data) {
  return request({
    url: '/equipment/equipmentMaintainTaskDetail/listPageMaintainTaskDetail',
    method: 'post',
    data: data
  })
}

//设备保养单-保养任务明细详情-关联(入库,出库)明细
export function findListMaintainTaskDetailByInfo(data) {
  return request({
    url: '/equipment/equipmentMaintainTaskDetail/findListMaintainTaskDetailByInfo',
    method: 'post',
    data: data
  })
}

export function findListTaskDetailByOutDetail(data) {
  return request({
    url: '/equipment/equipmentMaintainTaskDetail/findListTaskDetailByOutDetail',
    method: 'post',
    data: data
  })
}

//获取保养任务货品明细-是否出库执行完成
export function findIsAllOutExecuteByMaintain(data) {
  return request({
    url: '/equipment/equipmentMaintainTaskDetail/findIsAllOutExecuteByMaintain',
    method: 'post',
    data: data
  })
}

//新增-设备保养单-保养任务明细
export function addMaintainTaskDetail(data) {
  return request({
    url: '/equipment/equipmentMaintainTaskDetail/addMaintainTaskDetail',
    method: 'post',
    data: data
  })
}

//修改-设备保养单-保养任务明细
export function updateMaintainTaskDetail(data) {
  return request({
    url: '/equipment/equipmentMaintainTaskDetail/updateMaintainTaskDetail',
    method: 'post',
    data: data
  })
}

//根据出库单id-获取保养任务明细
export function listPageMaintainTaskDetailByOut(data) {
  return request({
    url: '/equipment/equipmentMaintainTaskDetail/listPageMaintainTaskDetailByOut',
    method: 'post',
    data: data
  })
}
//根据入库单id-获取保养任务明细
export function listPageMaintainTaskDetailByIn(data) {
  return request({
    url: '/equipment/equipmentMaintainTaskDetail/listPageMaintainTaskDetailByIn',
    method: 'post',
    data: data
  })
}
