import request from '@/utils/request'

export function fetchAllNames (query) {
  return request({
    url: '/getJsonOfUnDefinedProperties@FormDefineAction.action',
    method: 'get',
    params: query
  })
}

export function fetchDefineNames (query) {
  return request({
    url: '/getJsonOfDefinedProperties@FormDefineAction.action',
    method: 'get',
    params: query
  })
}

export function fetchConfig (query) {
  return request({
    url: '/get@FormDefineAction.action',
    method: 'get',
    params: query
  })
}

export function save (data) {
  return request({
    url: '/save@FormDefineAction.action',
    method: 'post',
    data
  })
}

export function applyDefine (data) {
  return request({
    url: '/applyDefineTo@FormDefineAction.action',
    method: 'post',
    data
  })
}
