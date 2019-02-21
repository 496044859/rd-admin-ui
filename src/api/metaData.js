import request from '@/utils/request'

export function fetchList (query) {
  return request({
    url: '/queryPage@MetaDataAction.action',
    method: 'get',
    params: query
  })
}

export function add (data) {
  return request({
    url: '/add@MetaDataAction.action',
    method: 'post',
    data
  })
}

export function edit (data) {
  return request({
    url: '/modify@MetaDataAction.action',
    method: 'post',
    data
  })
}

export function deletes (data) {
  return request({
    url: '/delete@MetaDataAction.action',
    method: 'post',
    data
  })
}
