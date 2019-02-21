import request from '@/utils/request'

export function fetchList (query) {
  return request({
    url: '/list@FondsCodeAction.action',
    method: 'get',
    params: query
  })
}

export function addSave (data) {
  return request({
    url: '/add@FondsCodeAction.action',
    method: 'post',
    data
  })
}

export function editSave (data) {
  return request({
    url: '/modify@FondsCodeAction.action',
    method: 'post',
    data
  })
}

export function gridDeletes (data) {
  return request({
    url: '/delete@FondsCodeAction.action',
    method: 'post',
    data
  })
}

export function fetchCreateIndex (data) {
  return request({
    url: '/createIndex@IndexAction.action',
    method: 'post',
    data
  })
}

export function fetchAddIndex (data) {
  return request({
    url: '/indexIncreament@IndexAction.action',
    method: 'post',
    data
  })
}

export function fetchNewCreateIndex (data) {
  return request({
    url: '/rebuildArchieveIndex@IndexAction.action',
    method: 'post',
    data
  })
}
