import request from '@/utils/request'

export function fetchList (query) {
  return request({
    url: '/pagingList@NoticeAction.action',
    method: 'get',
    params: query
  })
}

export function remove (data) {
  return request({
    url: '/delete@NoticeAction.action',
    method: 'post',
    data
  })
}

export function create (data) {
  return request({
    url: '/add@NoticeAction.action',
    method: 'post',
    data
  })
}

export function update (data) {
  return request({
    url: '/modify@NoticeAction.action',
    method: 'post',
    data
  })
}

export function getInfo (query) {
  return request({
    url: '/get@NoticeAction.action',
    method: 'get',
    params: query
  })
}
