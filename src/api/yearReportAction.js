import request from '@/utils/request'

export function count (query) {
  return request({
    url: '/count@YearReportAction.action',
    method: 'get',
    params: query
  })
}

export function getNbtj (query) {
  return request({
    url: '/getNbtj@YearReportAction.action',
    method: 'get',
    params: query
  })
}

export function add (query) {
  return request({
    url: '/add@YearReportAction.action',
    method: 'get',
    params: query
  })
}
