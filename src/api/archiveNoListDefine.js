import request from '@/utils/request'

export function getAllList (query) {
  return request({
    url: '/query@ArchiveNoListDefineAction.action',
    method: 'get',
    params: query
  })
}
