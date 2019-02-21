import request from '@/utils/request'

export function fetchCount (query) {
  return request({
    url: '/getCount@CountAction.action',
    method: 'get',
    params: query
  })
}
