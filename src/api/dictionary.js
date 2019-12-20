import request from '@/utils/request'

export function listTreeDictionary(data) {
  return request({
    url: '/system/dictionary/treeDictionarys',
    method: 'post',
    data: {
      ...data
    }
  })
}
export function listPageDictionary(data) {
  return request({
    url: '/system/dictionary/listPageDictionarys',
    method: 'post',
    data: {
      ...data
    }
  })
}
export function updateDisableDictionary(id, isdisable) {
  return request({
    url: '/system/dictionary/updateDisableDictionary',
    method: 'post',
    data: {
      id: id,
      isdisable: isdisable
    }
  })
}
export function addDictionary(data) {
  return request({
    url: '/system/dictionary/addDictionary',
    method: 'post',
    data: {
      ...data
    }
  })
}

export function updateDictionary(data) {
  return request({
    url: '/system/dictionary/updateDictionary',
    method: 'post',
    data: {
      ...data
    }
  })
}

export function deleteDictionarys(ids) {
  return request({
    url: '/system/dictionary/deleteDictionarys',
    method: 'post',
    data: {
      ids: ids
    }
  })
}

export function dataListDictionarys(dictionaryKey) {
  return request({
    url: '/system/dictionary/dataListDictionarys',
    method: 'post',
    data: {
      dictionaryKey: dictionaryKey
    }
  })
}

export function dataListDictionarysNew(data) {
  return request({
    url: '/system/dictionary/dataListDictionarys',
    method: 'post',
    data: {
      ...data
    }
  })
}


export function exportExcelDictionarys(ids) {
  return request({
    url: '/system/dictionary/exportExcelDictionarys',
    method: 'post',
    responseType: 'blob',
    data: {
      ids: ids
    }
  })
}

export function getDictionarys(data) {
  return request({
    url: '/system/dictionary/getDictionarys',
    method: 'post',
    data: data
  })
}
