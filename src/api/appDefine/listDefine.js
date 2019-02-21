import request from '@/utils/request'

export function fetchAllNames (query) {
  return request({
    url: '/getJsonOfUnDefinedProperties@ListDefineAction.action',
    method: 'get',
    params: query
  })
}

export function fetchDefineNames (query) {
  return request({
    url: '/getJsonOfDefinedProperties@ListDefineAction.action',
    method: 'get',
    params: query
  })
}

export function save (data) {
  return request({
    url: '/save@ListDefineAction.action',
    method: 'post',
    data,
    qs: false
  })
}

export function applyDefine (data) {
  return request({
    url: '/applyDefineTo@ListDefineAction.action',
    method: 'post',
    data,
    qs: false
  })
}
