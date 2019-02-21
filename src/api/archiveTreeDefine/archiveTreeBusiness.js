import request from '@/utils/request'

export function fetchList (query) {
  return request({
    url: '/listByNodeId@ArchiveTreeBusinessAction.action',
    method: 'get',
    params: query
  })
}

export function add (data) {
  return request({
    url: '/add@ArchiveTreeBusinessAction.action',
    method: 'post',
    data
  })
}

export function edit (data) {
  return request({
    url: '/modify@ArchiveTreeBusinessAction.action',
    method: 'post',
    data
  })
}

export function deletes (data) {
  return request({
    url: '/delete@ArchiveTreeBusinessAction.action',
    method: 'post',
    data
  })
}

export function copy (data) {
  return request({
    url: '/copy@ArchiveTreeBusinessAction.action',
    method: 'post',
    data
  })
}
