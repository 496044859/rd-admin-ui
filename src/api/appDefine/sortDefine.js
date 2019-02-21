import request from '@/utils/request'

export function fetchAllNames (query) {
  return request({
    url: '/getJsonOfUnDefinedProperties@SortDefineAction.action',
    method: 'get',
    params: query
  })
}

export function fetchDefineNames (query) {
  return request({
    url: '/getJsonOfDefinedProperties@SortDefineAction.action',
    method: 'get',
    params: query
  })
}

export function save (data) {
  return request({
    url: '/save@SortDefineAction.action',
    method: 'post',
    data,
    qs: false
  })
}

export function applyDefine (data) {
  return request({
    url: '/applyDefineTo@SortDefineAction.action',
    method: 'post',
    data,
    qs: false
  })
}
