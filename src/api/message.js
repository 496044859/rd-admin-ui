import request from '@/utils/request'

export function fetchList (query) {
  return request({
    url: '/getMessageList@MessageAction.action',
    method: 'get',
    params: query
  })
}

export function fetchInfo (query) {
  return request({
    url: '/getInfo@MessageAction.action',
    method: 'get',
    params: query
  })
}

export function remove (data) {
  return request({
    url: '/delete@MessageAction.action',
    method: 'post',
    data
  })
}
