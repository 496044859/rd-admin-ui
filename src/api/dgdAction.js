import request from '@/utils/request'

export function fetchDgdList (query) {
  return request({
    url: '/list@DgdAction.action',
    method: 'get',
    params: query
  })
}

export function deletes (data) {
  return request({
    url: '/delete@DgdAction.action',
    method: 'post',
    data
  })
}

export function preArchiving (data) {
  return request({
    url: '/preArchiving@DgdAction.action',
    method: 'post',
    data
  })
}

export function edit (data) {
  return request({
    url: '/modify@DgdAction.action',
    method: 'post',
    data
  })
}
