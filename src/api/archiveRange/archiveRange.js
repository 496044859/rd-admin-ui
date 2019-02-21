import request from '@/utils/request'

export function fetchList (query) {
  return request({
    url: '/query@ArchiveRangeAction.action',
    method: 'get',
    params: query
  })
}

export function addSave (data) {
  return request({
    url: '/add@ArchiveRangeAction.action',
    method: 'post',
    data
  })
}

export function editSave (data) {
  return request({
    url: '/modify@ArchiveRangeAction.action',
    method: 'post',
    data
  })
}

export function deletes (data) {
  return request({
    url: '/batchDelete@ArchiveRangeAction.action',
    method: 'post',
    data
  })
}
