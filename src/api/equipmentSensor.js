import request from '@/utils/request'

export function findAllEquipmentBySensor(data) {
  return request({
    url: '/equipment/equipmentSensor/findAllEquipmentBySensor',
    method: 'post',
    data: data
  })
}

export function listPageEquipmentSensor(data) {
  return request({
    url: '/equipment/equipmentSensor/listPageEquipmentSensor',
    method: 'post',
    data: data
  })
}

//新增-设备传感器指标
export function addEquipmentSensor(data) {
  return request({
    url: '/equipment/equipmentSensor/addEquipmentSensor',
    method: 'post',
    data: data
  })
}

export function addStandardEquipmentSensor(data) {
  return request({
    url: '/equipment/equipmentSensor/addStandardEquipmentSensor',
    method: 'post',
    data: data
  })
}

//删除-设备传感器指标
export function deleteEquipmentSensor(data) {
  return request({
    url: '/equipment/equipmentSensor/deleteEquipmentSensor',
    method: 'post',
    data: data
  })
}

//(按设备)删除-设备传感器指标
export function deleteEquipmentSensorByEquipment(data) {
  return request({
    url: '/equipment/equipmentSensor/deleteEquipmentSensorByEquipment',
    method: 'post',
    data: data
  })
}

//修改-设备传感器指标
export function updateEquipmentSensor(data) {
  return request({
    url: '/equipment/equipmentSensor/updateEquipmentSensor',
    method: 'post',
    data: data
  })
}

//修改-设备传感器指标(禁用)状态
export function updateDisableEquipmentSensor(data) {
  return request({
    url: '/equipment/equipmentSensor/updateDisableEquipmentSensor',
    method: 'post',
    data: data
  })
}


export function findListEquipmentSensorByEquipment(data) {
  return request({
    url: '/equipment/equipmentSensor/findListEquipmentSensorByEquipment',
    method: 'post',
    data: data
  })
}

export function checkEquipmentSensorFormula(data) {
  return request({
    url: '/equipment/equipmentSensor/checkEquipmentSensorFormula',
    method: 'post',
    data: data
  })
}
