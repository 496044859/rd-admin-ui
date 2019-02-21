import request from '@/utils/request'

export function fetchList (query) {
  return request({
    url: '/queryPage@BorrowAction.action',
    method: 'get',
    params: query
  })
}

export function saveBorrowInfo (data) {
  return request({
    url: '/saveBorrowInfo@BorrowAction.action',
    method: 'post',
    data
  })
}

export function BackBorrowInfo (data) {
  return request({
    url: '/BackBorrowInfo@BorrowAction.action',
    method: 'post',
    data
  })
}

export function fetchDetailList (query) {
  return request({
    url: '/queryDetail@BorrowAction.action',
    method: 'get',
    params: query
  })
}

export function getRegisterList (query) {
  return request({
    url: '/queryBorrowDetail@BorrowAction.action',
    method: 'get',
    params: query
  })
}

export function deleteList (query) {
  return request({
    url: '/delete@BorrowAction.action',
    method: 'get',
    params: query
  })
}

export function getRegister (query) {
  return request({
    url: '/get@BorrowAction.action',
    method: 'get',
    params: query
  })
}

export function getQuery (query) {
  return request({
    url: '/queryAsk@BorrowAction.action',
    method: 'get',
    params: query
  })
}

export function getEntryList (query) {
  return request({
    url: '/get@BorrowAction.action',
    method: 'get',
    params: query
  })
}

export function getEntryIdList (query) {
  return request({
    url: '/queryDetailByBorrowId@BorrowAction.action',
    method: 'get',
    params: query
  })
}

export function returenNice (data) {
  return request({
    url: '/entitiesReturn@BorrowAction.action',
    method: 'post',
    data
  })
}

export function saveBorrow (data) {
  return request({
    url: '/save@BorrowAction.action',
    method: 'post',
    data,
    qs: false
  })
}

export function checkBorrowed (data) {
  return request({
    url: '/checkHasBorrowed@BorrowAction.action',
    method: 'post',
    data,
    qs: false
  })
}

export function confirmAll (data) {
  return request({
    url: '/confirmAll@BorrowAction.action',
    method: 'post',
    data
  })
}

export function fetchTimeOutRemind (query) {
  return request({
    url: '/getTimeOutRemind@BorrowAction.action',
    method: 'get',
    params: query
  })
}

export function fetchStatistic (query) {
  return request({
    url: '/usingStatistic@BorrowAction.action',
    method: 'get',
    params: query
  })
}

export function fetchChartData (query) {
  return request({
    url: '/usingStatisticView@BorrowAction.action',
    method: 'get',
    params: query
  })
}

export function startProcess (query) {
  return request({
    url: '/startProcess@BorrowAction.action',
    method: 'get',
    params: query
  })
}
