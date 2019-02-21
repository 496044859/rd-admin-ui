import request from '@/utils/request'

export function getList (query) {
  return request({
    url: '/queryPage@ProjectAction.action',
    method: 'get',
    params: query
  })
}
