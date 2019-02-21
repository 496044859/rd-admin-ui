import request from '@/utils/request'

export function startProcessInstance (query) {
  return request({
    url: '/startProcessInstance@JointDocAction.action',
    method: 'get',
    params: query
  })
}

export function add (data) {
  return request({
    url: '/add@JudgeAction.action',
    method: 'post',
    data
  })
}

export function edit (data) {
  return request({
    url: '/modify@JudgeAction.action',
    method: 'post',
    data
  })
}

export function deletes (data) {
  return request({
    url: '/delete@JudgeAction.action',
    method: 'post',
    data
  })
}

export function checkConfim (data) {
  return request({
    url: '/checkConfim@JudgeAction.action',
    method: 'post',
    data
  })
}
