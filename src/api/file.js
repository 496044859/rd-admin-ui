import request from '@/utils/request'

export function fetchGridData (query) {
  return request({
    url: '/queryPage@BaseFileAction.action',
    method: 'get',
    params: query
  })
}

export function fetchFileNo (query) {
  return request({
    url: '/getFileNo@BaseFileAction.action',
    method: 'get',
    params: query
  })
}

export function add (data) {
  return request({
    url: '/add@BaseFileAction.action',
    method: 'post',
    data
  })
}

export function edit (data) {
  return request({
    url: '/update@BaseFileAction.action',
    method: 'post',
    data
  })
}

export function deletes (data) {
  return request({
    url: '/delete@BaseFileAction.action',
    method: 'post',
    data
  })
}

export function deptCheck (data) {
  return request({
    url: '/archiveCheck@BaseFileAction.action',
    method: 'post',
    data
  })
}

export function submitZlbm (data) {
  return request({
    url: '/submitZlbm@BaseFileAction.action',
    method: 'post',
    data
  })
}

export function receive (data) {
  return request({
    url: '/receive@BaseFileAction.action',
    method: 'post',
    data
  })
}

export function reject (data) {
  return request({
    url: '/reject@BaseFileAction.action',
    method: 'post',
    data
  })
}

export function fetchDeleteList (query) {
  return request({
    url: '/queryDeletedPage@BaseFileAction.action',
    method: 'get',
    params: query
  })
}

export function isDelParent (query) {
  return request({
    url: '/isDelParent@BaseFileAction.action',
    method: 'get',
    params: query
  })
}

export function recoverFile (data) {
  return request({
    url: '/recover@BaseFileAction.action',
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

export function recoverDocument (data) {
  return request({
    url: '/recover@DocumentAction.action',
    method: 'post',
    data
  })
}

export function deleteForRever (data) {
  return request({
    url: '/deleteForRever@BaseFileAction.action',
    method: 'post',
    data
  })
}

export function deleteAllForRever (data) {
  return request({
    url: '/deleteAllForRever@BaseFileAction.action',
    method: 'post',
    data
  })
}

export function getInternalTransfer (query) {
  return request({
    url: '/getBgdw@HandOverAction.action',
    method: 'get',
    params: query
  })
}
export function handOver (data) {
  return request({
    url: '/handOver@BaseFileAction.action',
    method: 'post',
    data
  })
}

export function remove (data) {
  return request({
    url: '/remove@BaseFileAction.action',
    method: 'post',
    data
  })
}

export function fetchTitlePropers (query) {
  return request({
    url: '/getTitlePropers@BaseFileAction.action',
    method: 'get',
    params: query
  })
}

export function fetchComposeInfo (query) {
  return request({
    url: '/getComposeInfo@BaseFileAction.action',
    method: 'get',
    params: query
  })
}

export function finish (data) {
  return request({
    url: '/finish@BaseFileAction.action',
    method: 'post',
    data
  })
}

export function validateYj (data) {
  return request({
    url: '/validateYj@BaseFileAction.action',
    method: 'post',
    data
  })
}

export function getQueryFileList (query) {
  return request({
    url: '/queryPage@BaseFileAction.action',
    method: 'get',
    params: query
  })
}

export function getQueryRelevance (query) {
  return request({
    url: '/getAssociated@BaseFileAction.action',
    method: 'get',
    params: query
  })
}

export function removeRelevance (data) {
  return request({
    url: '/removeAssociate@BaseFileAction.action',
    method: 'post',
    data,
    qs: false
  })
}

export function addRelevance (data) {
  return request({
    url: '/addAssociate@BaseFileAction.action',
    method: 'post',
    data,
    qs: false
  })
}

export function getCodingFile (query) {
  return request({
    url: '/coding@BaseFileAction.action',
    method: 'get',
    params: query
  })
}

export function isFinishing (query) {
  return request({
    url: '/isFinishing@BaseFileAction.action',
    method: 'get',
    params: query
  })
}

export function fetchRejectInfo (query) {
  return request({
    url: '/getRejectInfo@BaseFileAction.action',
    method: 'get',
    params: query
  })
}

export function generateFileReport (data) {
  return request({
    url: '/generateReport@BaseFileAction.action',
    method: 'post',
    data
  })
}
