import request from '@/utils/request'

export function queryAll (query) {
  return request({
    url: '/queryAllLoginLogs@UserLogAction.action',
    method: 'post',
    params: query
  })
}

export function downLoad (query) {
  return request({
    url: '/exportLoginLogs@UserLogAction.action',
    method: 'post',
    params: query
  })
}

export function queryAlls (query) {
  return request({
    url: '/queryAllOpLogs@UserLogAction.action',
    method: 'post',
    params: query
  })
}

export function queryInfo (query) {
  return request({
    url: '/queryOpData@UserLogAction.action',
    method: 'get',
    params: query
  })
}
