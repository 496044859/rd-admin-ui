import request from '@/utils/request'

export function fetchStatistic (query) {
  return request({
    url: '/receivingReport@ReceivingStatisticsAction.action',
    method: 'get',
    params: query
  })
}

export function queryStatistic (query) {
  return request({
    url: '/query@ChamberHideStatisticsAction.action',
    method: 'get',
    params: query
  })
}

export function fetchChartData (query) {
  return request({
    url: '/receiveChart@ReceivingStatisticsAction.action',
    method: 'get',
    params: query
  })
}

export function queryChartData (query) {
  return request({
    url: '/chart@ChamberHideStatisticsAction.action',
    method: 'get',
    params: query
  })
}

export function fetchHomePageChart (query) {
  return request({
    url: '/HomePageChart@ChamberHideStatisticsAction.action',
    method: 'get',
    params: query
  })
}
