import request from '@/utils/request'

export function fetchCoding (query) {
  return request({
    url: '/list@BmAction.action',
    method: 'get',
    params: query
  })
}

export function fetchCodingAll () {
  return request({
    url: '/listAllItem@BmAction.action',
    method: 'get'
  })
}

export function add (data) {
  return request({
    url: '/add@CodingAction.action',
    method: 'post',
    data
  })
}

export function edit (data) {
  return request({
    url: '/modify@CodingAction.action',
    method: 'post',
    data
  })
}

export function fetchTreeData (query) {
  return request({
    url: '/listTree@CodingAction.action',
    method: 'get',
    params: query
  })
}

export function deletes (data) {
  return request({
    url: '/delete@CodingAction.action',
    method: 'post',
    data
  })
}

export function addItem (data) {
  return request({
    url: '/addItem@CodingAction.action',
    method: 'post',
    data
  })
}

export function editItem (data) {
  return request({
    url: '/modifyItem@CodingAction.action',
    method: 'post',
    data
  })
}

export function deletesItems (data) {
  return request({
    url: '/deleteItems@CodingAction.action',
    method: 'post',
    data
  })
}
