import request from '@/utils/request'

export function fetchAllNames (query) {
  return request({
    url: '/getJsonOfUnDefinedProperties@QueryDefineAction.action',
    method: 'get',
    params: query
  })
}

export function fetchDefineNames (query) {
  return request({
    url: '/getJsonOfDefinedProperties@QueryDefineAction.action',
    method: 'get',
    params: query
  })
}

export function save (data) {
  return request({
    url: '/save@QueryDefineAction.action',
    method: 'post',
    data,
    qs: false
  })
}

export function applyDefine (data) {
  return request({
    url: '/applyDefineTo@QueryDefineAction.action',
    method: 'post',
    data,
    qs: false
  })
}
