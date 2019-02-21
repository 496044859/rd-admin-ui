import request from '@/utils/request'

export function fetchRangeYear (query) {
  return request({
    url: '/getDefineRangeYearData@ArchiveRangeTypeAction.action',
    method: 'get',
    params: query
  })
}
export function fetchTreeData (query) {
  return request({
    url: '/getDefineTree@ArchiveRangeTypeAction.action',
    method: 'get',
    params: query
  })
}

export function fetchTreeDataNew (query) {
  return request({
    url: '/getDefineTreeNew@ArchiveRangeTypeAction.action',
    method: 'get',
    params: query
  })
}

export function addSave (data) {
  return request({
    url: '/add@ArchiveRangeTypeAction.action',
    method: 'post',
    data
  })
}

export function editSave (data) {
  return request({
    url: '/modify@ArchiveRangeTypeAction.action',
    method: 'post',
    data
  })
}

export function deletes (data) {
  return request({
    url: '/batchDelete@ArchiveRangeTypeAction.action',
    method: 'post',
    data
  })
}

export function remove (data) {
  return request({
    url: '/delete@ArchiveRangeTypeAction.action',
    method: 'post',
    data
  })
}

export function sort (data) {
  return request({
    url: '/sort@ArchiveRangeTypeAction.action',
    method: 'post',
    data
  })
}
