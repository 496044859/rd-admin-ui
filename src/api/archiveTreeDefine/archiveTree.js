import request from '@/utils/request'

export function fetchTreeData (query) {
  return request({
    url: '/getDefineTree@ArchiveTreeAction.action',
    method: 'get',
    params: query
  })
}

export function add (data) {
  return request({
    url: '/add@ArchiveTreeAction.action',
    method: 'post',
    data
  })
}

export function batchAdd (data) {
  return request({
    url: '/batchAdd@ArchiveTreeAction.action',
    method: 'post',
    qs: false,
    data
  })
}

export function edit (data) {
  return request({
    url: '/modify@ArchiveTreeAction.action',
    method: 'post',
    data
  })
}

export function deletes (data) {
  return request({
    url: '/batchDelete@ArchiveTreeAction.action',
    method: 'post',
    data
  })
}

export function fetchListProperty (query) {
  return request({
    url: '/listPropertyField@ArchiveTreeAction.action',
    method: 'get',
    params: query
  })
}

export function getListProperty1 (query) {
  return request({
    url: '/listPropertyField1@ArchiveTreeAction.action',
    method: 'get',
    params: query
  })
}

export function addRelation (data) {
  return request({
    url: '/addAssociation@ArchiveTreeAction.action',
    method: 'post',
    data
  })
}

export function fetchTreeViewChecked (data) {
  return request({
    url: '/getTreeView@ArchiveTreeAction.action',
    method: 'post',
    data
  })
}

export function modifyArchiveTreeView (data) {
  return request({
    url: '/saveTreeView@ArchiveTreeAction.action',
    method: 'post',
    data
  })
}
