import request from '@/utils/request'

export function fetchList (query) {
  return request({
    url: '/list@TzhJgdaYsjdyAction.action',
    method: 'get',
    params: query
  })
}

export function add (data) {
  return request({
    url: '/add@TzhJgdaYsjdyAction.action',
    method: 'post',
    data
  })
}

export function edit (data) {
  return request({
    url: '/modify@TzhJgdaYsjdyAction.action',
    method: 'post',
    data
  })
}

export function deletes (data) {
  return request({
    url: '/delete@TzhJgdaYsjdyAction.action',
    method: 'post',
    data
  })
}

export function toSystem (data) {
  return request({
    url: '/archiveTypeDefine/toSystem',
    method: 'post',
    data
  })
}

export function unSystem (data) {
  return request({
    url: '/archiveTypeDefine/unSystem',
    method: 'post',
    data
  })
}

export function fetchCustomDefine (query) {
  return request({
    url: '/getCustomDefinedDetail@ArchiveTypeAction.action',
    method: 'get',
    params: query
  })
}

export function addCustomDefine (data) {
  return request({
    url: '/addCustomDefinedDetail@ArchiveTypeAction.action',
    method: 'post',
    data
  })
}

export function deleteCustomDefine (data) {
  return request({
    url: '/deleteCustomDefinedDetail@ArchiveTypeAction.action',
    method: 'post',
    data
  })
}

export function fetchModuleOption (query) {
  return request({
    url: '/getCustomDefinedOption@ArchiveTypeAction.action',
    method: 'get',
    params: query
  })
}

export function save (data) {
  return request({
    url: '/save@PropertyAction.action',
    method: 'post',
    data
  })
}

export function apply (data) {
  return request({
    url: '/apply@PropertyAction.action',
    method: 'post',
    data
  })
}

export function fetchPropertyAll (query) {
  return request({
    url: '/list@TzhJgdaYsjdyAction.action',
    method: 'get',
    params: query
  })
}

export function fetchPropertysAll (query) {
  return request({
    url: '/getQueryFieldByType@TzhJgdaYsjdyAction.action',
    method: 'get',
    params: query
  })
}
