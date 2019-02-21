import request from '@/utils/request'

export function fetchAttach (query) {
  return request({
    url: '/queryAttach@BatchAttachAction.action',
    method: 'get',
    params: query
  })
}

export function fetchUnAttach (query) {
  return request({
    url: '/queryUnattach@BatchAttachAction.action',
    method: 'get',
    params: query
  })
}

export function deleteAttach (data) {
  return request({
    url: '/delete@BatchAttachAction.action',
    method: 'post',
    data
  })
}

export function hangup (data) {
  return request({
    url: '/hangup@BatchAttachAction.action',
    method: 'post',
    data
  })
}

export function fetchWaitForAttach (query) {
  return request({
    url: '/queryWaitForAttach@BatchAttachAction.action',
    method: 'get',
    params: query
  })
}
