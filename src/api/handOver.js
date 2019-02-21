import request from '@/utils/request'

export function fetchHandOverList (query) {
  return request({
    url: '/query@HandOverAction.action',
    method: 'get',
    params: query
  })
}

export function add (data) {
  return request({
    url: '/add@FolderAction.action',
    method: 'post',
    data
  })
}

export function edit (data) {
  return request({
    url: '/modify@FolderAction.action',
    method: 'post',
    data
  })
}

export function deletes (data) {
  return request({
    url: '/delete@FolderAction.action',
    method: 'post',
    data
  })
}

export function deptCheck (data) {
  return request({
    url: '/deptCheck@FolderAction.action',
    method: 'post',
    data
  })
}

export function filing (data) {
  return request({
    url: '/filing@FolderAction.action',
    method: 'post',
    data
  })
}

export function receive (data) {
  return request({
    url: '/receive@FileAction.action',
    method: 'post',
    data
  })
}

export function reject (data) {
  return request({
    url: '/reject@FileAction.action',
    method: 'post',
    data
  })
}
