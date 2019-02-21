import request from '@/utils/request'

export function fetchList (query) {
  return request({
    url: '/listPage@MediumAction.action',
    method: 'get',
    params: query
  })
}

export function add (data) {
  return request({
    url: '/add@MediumAction.action',
    method: 'post',
    data,
    qs: false
  })
}

export function deletes (data) {
  return request({
    url: '/delete@MediumAction.action',
    method: 'post',
    data
  })
}

export function countFileSize (data) {
  return request({
    url: '/countFileSize@MediumAction.action',
    method: 'post',
    data,
    qs: false
  })
}
