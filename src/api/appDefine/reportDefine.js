import request from '@/utils/request'

export function fetchAllNames (query) {
  return request({
    url: '/listUnAssignedReport@ReportAction.action',
    method: 'get',
    params: query
  })
}

export function fetchDefineNames (query) {
  return request({
    url: '/listAssignedReport@ReportAction.action',
    method: 'get',
    params: query
  })
}

export function save (data) {
  return request({
    url: '/save@ReportAction.action',
    method: 'post',
    data
  })
}

export function applyDefine (data) {
  return request({
    url: '/applyDefineTo@ReportAction.action',
    method: 'post',
    data
  })
}
