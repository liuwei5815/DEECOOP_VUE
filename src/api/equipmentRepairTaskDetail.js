import request from '@/utils/request'

export function listPageRepairTaskDetail(data) {
  return request({
    url: '/equipment/equipmentRepairTaskDetail/listPageRepairTaskDetail',
    method: 'post',
    data: data
  })
}

//设备维修单-维修任务明细(关联出库单明细)
export function findListRepairTaskDetailByOutDetail(data) {
  return request({
    url: '/equipment/equipmentRepairTaskDetail/findListRepairTaskDetailByOutDetail',
    method: 'post',
    data: data
  })
}

//设备维修单-维修任务明细详情-关联(入库,出库)明细
export function findListRepairTaskDetailByInfo(data) {
  return request({
    url: '/equipment/equipmentRepairTaskDetail/findListRepairTaskDetailByInfo',
    method: 'post',
    data: data
  })
}

//获取维修任务货品明细-是否出库执行完成
export function findIsAllOutExecute(data) {
  return request({
    url: '/equipment/equipmentRepairTaskDetail/findIsAllOutExecute',
    method: 'post',
    data: data
  })
}

//新增-设备维修单-维修任务明细
export function addRepairTaskDetail(data) {
  return request({
    url: '/equipment/equipmentRepairTaskDetail/addRepairTaskDetail',
    method: 'post',
    data: data
  })
}

//修改-设备维修单-维修任务明细
export function updateRepairTaskDetail(data) {
  return request({
    url: '/equipment/equipmentRepairTaskDetail/updateRepairTaskDetail',
    method: 'post',
    data: data
  })
}

//根据出库单id-获取维修保养任务明细
export function listPageRepairTaskDetailByOut(data) {
  return request({
    url: '/equipment/equipmentRepairTaskDetail/listPageRepairTaskDetailByOut',
    method: 'post',
    data: data
  })
}
//根据入库单id-获取维修保养任务明细
export function listPageRepairTaskDetailByIn(data) {
  return request({
    url: '/equipment/equipmentRepairTaskDetail/listPageRepairTaskDetailByIn',
    method: 'post',
    data: data
  })
}

