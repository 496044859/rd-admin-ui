import request from '@/utils/request'

export function fetchUnDefinedProperties (query) {
  return request({
    url: '/getJsonOfUnDefinedProperties@RepeatQueryDefineAction.action',
    method: 'get',
    params: query
  })
}
