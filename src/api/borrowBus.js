import request from '@/utils/request'

export function fetchList (query) {
  return request({
    url: '/queryList@BorrowBusAction.action',
    method: 'get',
    params: query
  })
}

export function saveBorrowBus (data) {
  return request({
    url: '/save@BorrowBusAction.action',
    method: 'post',
    data
  })
}

export function deleteBorrowBus (data) {
  return request({
    url: '/delete@BorrowBusAction.action',
    method: 'post',
    data
  })
}
