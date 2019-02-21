import request from '@/utils/request'

export function fetchGridData (query) {
  return request({
    url: '/queryPage@BaseFolderAction.action',
    method: 'get',
    params: query
  })
}

export function fetchFolderNo (query) {
  return request({
    url: '/getFolderNo@BaseFolderAction.action',
    method: 'get',
    params: query
  })
}

export function add (data) {
  return request({
    url: '/add@BaseFolderAction.action',
    method: 'post',
    data
  })
}

export function edit (data) {
  return request({
    url: '/update@BaseFolderAction.action',
    method: 'post',
    data
  })
}

export function deletes (data) {
  return request({
    url: '/delete@BaseFolderAction.action',
    method: 'post',
    data
  })
}

export function deptCheck (data) {
  return request({
    url: '/archiveCheck@BaseFolderAction.action',
    method: 'post',
    data
  })
}

export function submitZlbm (data) {
  return request({
    url: '/filing@BaseFolderAction.action',
    method: 'post',
    data
  })
}

export function receive (data) {
  return request({
    url: '/receive@BaseFolderAction.action',
    method: 'post',
    data
  })
}

export function reject (data) {
  return request({
    url: '/reject@BaseFolderAction.action',
    method: 'post',
    data
  })
}

export function takeApartVerify (query) {
  return request({
    url: '/takeApartVerify@BaseFolderAction.action',
    method: 'get',
    params: query
  })
}

export function takeApart (data) {
  return request({
    url: '/takeApart@BaseFolderAction.action',
    method: 'post',
    data
  })
}

export function compose (data) {
  return request({
    url: '/compose@BaseFolderAction.action',
    method: 'post',
    data
  })
}

export function finish (data) {
  return request({
    url: '/finish@BaseFolderAction.action',
    method: 'post',
    data
  })
}

export function insertItems (data) {
  return request({
    url: '/insertItems@BaseFolderAction.action',
    method: 'post',
    data
  })
}

export function fetchDeleteList (query) {
  return request({
    url: '/queryDeletedPage@BaseFolderAction.action',
    method: 'get',
    params: query
  })
}

export function isDelParent (query) {
  return request({
    url: '/isDelParent@BaseFolderAction.action',
    method: 'get',
    params: query
  })
}

export function deleteForRever (data) {
  return request({
    url: '/deleteForRever@BaseFolderAction.action',
    method: 'post',
    data
  })
}

export function recoverFolder (data) {
  return request({
    url: '/recover@BaseFolderAction.action',
    method: 'post',
    data
  })
}

export function handOver (data) {
  return request({
    url: '/handOver@BaseFolderAction.action',
    method: 'post',
    data
  })
}

export function getQueryFolderList (query) {
  return request({
    url: '/queryPage@BaseFolderAction.action',
    method: 'get',
    params: query
  })
}

export function getCodingFolder (query) {
  return request({
    url: '/coding@BaseFolderAction.action',
    method: 'get',
    params: query
  })
}

export function isFinishing (query) {
  return request({
    url: '/isFinishing@BaseFolderAction.action',
    method: 'get',
    params: query
  })
}

export function fetchRejectInfo (query) {
  return request({
    url: '/getRejectInfo@BaseFolderAction.action',
    method: 'get',
    params: query
  })
}

export function generateFolderReport (data) {
  return request({
    url: '/generateReport@BaseFolderAction.action',
    method: 'post',
    data
  })
}
