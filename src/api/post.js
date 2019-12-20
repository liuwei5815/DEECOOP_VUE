import request from '@/utils/request'


export function listPagePosts(data) {
  return request({
    url: '/system/post/listPagePosts',
    method: 'post',
    data: data
  })
}

export function updatePost(data) {
  return request({
    url: '/system/post/updatePost',
    method: 'post',
    data: data
  })
}
export function updateDisablePost(id, isdisable) {
  return request({
    url: '/system/post/updateDisablePost',
    method: 'post',
    data: {
      id: id,
      isdisable: isdisable
    }
  })
}

export function addPost(data) {
  return request({
    url: '/system/post/addPost',
    method: 'post',
    data: data
  })
}

export function deletePosts(ids) {
  return request({
    url: '/system/post/deletePosts',
    method: 'post',
    data: {
      ids: ids
    }
  })
}

//部门+岗位树
export function treeDeptPosts(data) {
  return request({
    url: '/system/post/treeDeptPosts',
    method: 'post',
    data: data
  })
}

//部门+岗位树(无员工主岗)
export function treeDeptPostsNotMainPost(data) {
  return request({
    url: '/system/post/treeDeptPostsNotMainPost',
    method: 'post',
    data: data
  })
}

export function exportExcelPosts(ids) {
  return request({
    url: '/system/post/exportExcelPosts',
    method: 'post',
    responseType: 'blob',
    data: {
      ids: ids
    }
  })
}
