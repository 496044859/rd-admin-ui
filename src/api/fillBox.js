import request from '@/utils/request'

export function fetchBoxList (query) {
  return request({
    url: '/pageList@BoxAction.action',
    method: 'get',
    params: query
  })
}

export function checkBoxNo (data) {
  return request({
    url: '/checkBoxNo@BoxAction.action',
    method: 'post',
    data
  })
}

export function add (data) {
  return request({
    url: '/add@BoxAction.action',
    method: 'post',
    data
  })
}

export function addJudge (data) {
  return request({
    url: '/add@JudgeAction.action',
    method: 'post',
    data
  })
}

export function edit (data) {
  return request({
    url: '/modify@BoxAction.action',
    method: 'post',
    data
  })
}

export function deletes (data) {
  return request({
    url: '/delete@BoxAction.action',
    method: 'post',
    data
  })
}

export function checkStored (data) {
  return request({
    url: '/checkStored@BoxAction.action',
    method: 'post',
    data
  })
}
