import request from '@/utils/request'

export function fetchList (query) {
  return request({
    url: '/queryFromIndex@IntegrativeQueryAction.action',
    method: 'get',
    params: query
  })
}

export function fetchGroup (query) {
  return request({
    url: '/getGroupingDataFromIndex@IntegrativeQueryAction.action',
    method: 'get',
    params: query
  })
}

export function addSearch (query) {
  return request({
    url: '/addArchive@JudgeAction.action',
    method: 'get',
    params: query
  })
}
