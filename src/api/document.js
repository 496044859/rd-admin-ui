import request from '@/utils/request'

export function fetchDocumentList (query) {
  return request({
    url: '/query@DocumentAction.action',
    method: 'get',
    params: query
  })
}

export function deletesDocument (data) {
  return request({
    url: '/delete@DocumentAction.action',
    method: 'post',
    data
  })
}

export function queryPageList (data) {
  return request({
    url: '/queryPage@DocumentAction.action',
    method: 'post',
    data
  })
}

export function fetchDeleteList (query) {
  return request({
    url: '/queryDeletedPage@DocumentAction.action',
    method: 'get',
    params: query
  })
}

export function deleteForRever (data) {
  return request({
    url: '/deleteForRever@DocumentAction.action',
    method: 'post',
    data
  })
}

export function recoverDoc (data) {
  return request({
    url: '/recover@DocumentAction.action',
    method: 'post',
    data
  })
}

export function isDelParent (query) {
  return request({
    url: '/isDelParent@DocumentAction.action',
    method: 'get',
    params: query
  })
}

export function fetchDownloadList (query) {
  return request({
    url: '/tzDocList@DocumentAction.action',
    method: 'get',
    params: query
  })
}

export function removeDownloadList (query) {
  return request({
    url: '/deleteYwfj@DocumentAction.action',
    method: 'get',
    params: query
  })
}
