import request from '@/utils/request'

export function fetchList (query) {
  return request({
    url: '/listPage@StatisticAction.action',
    method: 'get',
    params: query
  })
}

export function queryArchiveType (query) {
  return request({
    url: '/getArchiveTypeTree@ArchiveTypeAction.action',
    method: 'get',
    params: query
  })
}

export function queryField (query) {
  return request({
    url: '/getProperty@StatisticAction.action',
    method: 'get',
    params: query
  })
}

export function deletes (data) {
  return request({
    url: '/delete@StatisticAction.action',
    method: 'post',
    params: data
  })
}

export function queryloakList (query) {
  return request({
    url: '/getJsonOfPropertiesByIds@QueryDefineAction.action',
    method: 'get',
    params: query
  })
}

export function queryNoloakList (query) {
  return request({
    url: '/getJsonOfPropertiesByType@QueryDefineAction.action',
    method: 'get',
    params: query
  })
}

export function getFondsDepts (query) {
  return request({
    url: '/getFondsDepts@FondsDeptAction.action',
    method: 'get',
    params: query
  })
}

export function saveLockList (data) {
  return request({
    url: '/saveStatConditions@StatisticAction.action',
    method: 'post',
    params: data
  })
}

export function saveStatistics (data) {
  return request({
    url: '/save@StatisticAction.action',
    method: 'post',
    data,
    qs: false
  })
}

export function fecthEditTable (query) {
  return request({
    url: '/get@StatisticAction.action',
    method: 'get',
    params: query
  })
}

export function getDifineTableData (query) {
  return request({
    url: '/getResult@StatisticAction.action',
    method: 'get',
    params: query
  })
}
