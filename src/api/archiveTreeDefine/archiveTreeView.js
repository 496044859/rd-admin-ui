import request from '@/utils/request'

export function fetchTreeViewCheckedJz (query) {
  return request({
    url: '/getTreeView@ArchiveTreeViewAction.action',
    method: 'get',
    params: query
  })
}

export function fetchTreeWidthCheck (query) {
  return request({
    url: '/getTreeWidthCheck@ArchiveTreeViewAction.action',
    method: 'get',
    params: query
  })
}

export function addArchiveTreeView (data) {
  return request({
    url: '/add@ArchiveTreeViewAction.action',
    method: 'post',
    data,
    qs: false
  })
}

export function modifyArchiveTreeView (data) {
  return request({
    url: '/saveTreeView@ArchiveTreeViewAction.action',
    method: 'post',
    data
  })
}

export function fetchTreeData (query) {
  return request({
    url: '/getViewJsonNew@ArchiveTreeViewAction.action',
    method: 'get',
    params: query
  })
}

export function jzFetchTreeData (query) {
  return request({
    url: '/getDefineTree@ArchiveTreeViewAction.action',
    method: 'get',
    params: query
  })
}

export function batchAdd (data) {
  return request({
    url: '/batchAdd@ArchiveTreeViewAction.action',
    method: 'post',
    qs: false,
    data
  })
}

export function addJz (data) {
  return request({
    url: '/add@ArchiveTreeViewAction.action',
    method: 'post',
    data
  })
}

export function deletesJz (data) {
  return request({
    url: '/batchDelete@ArchiveTreeViewAction.action',
    method: 'post',
    data
  })
}

export function editJz (data) {
  return request({
    url: '/modify@ArchiveTreeViewAction.action',
    method: 'post',
    data
  })
}
