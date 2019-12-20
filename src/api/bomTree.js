import request from '@/utils/request'

export function listPageBomTrees(data) {
  return request({
    url: '/base/bomTree/listPageBomTrees',
    method: 'post',
    data: data
  })
}

//添加信息
export function addBomTree(data) {
  return request({
    url: '/base/bomTree/addBomTree',
    method: 'post',
    data: data
  })
}

//批量添加信息
export function addBomTrees(data) {
  return request({
    url: '/base/bomTree/addBomTrees',
    method: 'post',
    data: data
  })
}

//修改信息
export function updateBomTree(data) {
  return request({
    url: '/base/bomTree/updateBomTree',
    method: 'post',
    data: data
  })
}


//删除功能
export function deleteBomTree(id) {
  return request({
    url: '/base/bomTree/deleteBomTree',
    method: 'post',
    data: {
      id: id
    }
  })
}



export function getBomTree(data) {
  return request({
    url: '/base/bomTree/getBomTree',
    method: 'post',
    data: data
  })
}

export function listProdLackNum(data) {
  return request({
    url: '/base/bomTree/listProdLackNum',
    method: 'post',
    data: data
  })
}
