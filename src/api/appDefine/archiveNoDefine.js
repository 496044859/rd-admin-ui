import request from '@/utils/request'

export function fetchAllArchiveNoList (query) {
  return request({
    url: '/getAllArchiveNoList@ArchiveNoAction.action',
    method: 'get',
    params: query
  })
}

export function fetchDefineNames (query) {
  return request({
    url: '/getJsonOfDefinedProperties@ArchiveNoAction.action',
    method: 'get',
    params: query
  })
}

export function fetchAllArchiveDictList (query) {
  return request({
    url: '/getAllArchiveDictList@ArchiveNoAction.action',
    method: 'get',
    params: query
  })
}

export function fetchAllFlowNoArchiveDictList (query) {
  return request({
    url: '/getAllFlowNoArchiveDictList@ArchiveNoAction.action',
    method: 'get',
    params: query
  })
}

export function fetchAllArchiveNoArchiveDictList (query) {
  return request({
    url: '/getAllArchiveNoArchiveDictList@ArchiveNoAction.action',
    method: 'get',
    params: query
  })
}

export function saveArchiveNoDefine (data) {
  return request({
    url: '/saveArchiveNoDefine@ArchiveNoAction.action',
    method: 'post',
    data,
    qs: false
  })
}

export function applyDefine (data) {
  return request({
    url: '/applyDefineTo@ArchiveNoAction.action',
    method: 'post',
    data,
    qs: false
  })
}

export function addOrModifyArchiveNo (data) {
  return request({
    url: '/addOrModifyArchiveNo@ArchiveNoAction.action',
    method: 'post',
    data
  })
}

export function deleteArchiveNo (data) {
  return request({
    url: '/deleteArchiveNo@ArchiveNoAction.action',
    method: 'post',
    data
  })
}
