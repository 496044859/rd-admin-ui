import request from '@/utils/request'

export function fetchTreeData (query) {
  return request({
    url: '/getDefineTree@ArchiveTypeAction.action',
    method: 'get',
    params: query
  })
}

export function fetchArchiveTypeList (query) {
  return request({
    url: '/judgeList@ArchiveTypeAction.action',
    method: 'get',
    params: query
  })
}

export function deletes (data) {
  return request({
    url: '/delete@ArchiveTypeAction.action',
    method: 'post',
    data
  })
}

export function add (data) {
  return request({
    url: '/add@ArchiveTypeAction.action',
    method: 'post',
    data
  })
}

export function edit (data) {
  return request({
    url: '/modify@ArchiveTypeAction.action',
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

export function isArchiveInUse (query) {
  return request({
    url: '/isArchiveInUse@ArchiveTypeAction.action',
    method: 'get',
    params: query
  })
}

export function findByType (query) {
  return request({
    url: '/findByType@ArchiveTypeAction.action',
    method: 'get',
    params: query
  })
}

export function fetchArchiveTypes (query) {
  return request({
    url: '/list@ArchiveTypeAction.action',
    method: 'get',
    params: query
  })
}
