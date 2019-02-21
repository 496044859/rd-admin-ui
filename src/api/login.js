import request from '@/utils/request'

export function loginByUsername (username, password) {
  const data = {
    username,
    password
  }
  return request({
    url: '/login@LoginAction.action',
    method: 'post',
    data
  })
}

export function logout () {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function getUserInfo (token) {
  return request({
    url: '/ssoLogin@LoginAction.action',
    method: 'get',
    params: {token}
  })
}
