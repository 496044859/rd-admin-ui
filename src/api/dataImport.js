import request from '@/utils/request'

export function getTableList (data) {
  return request({
    url: '/getView@DataImportAction.action',
    method: 'post',
    data
  })
}

export function fetchDestPropertys (query) {
  return request({
    url: '/getDestPropertys@DataImportAction.action',
    method: 'get',
    params: query
  })
}

export function importExcel (data) {
  return request({
    url: '/importExcel@DataImportAction.action',
    method: 'post',
    data,
    qs: false
  })
}

export function delectArticles (query) {
  return request({
    url: '/deleteImport@DataImportAction.action',
    method: 'get',
    params: query
  })
}

export function fetchDataImportList (query) {
  return request({
    url: '/query@DataImportAction.action',
    method: 'get',
    params: query
  })
}

export function fetchDataImportRecord (query) {
  return request({
    url: '/queryDetail@DataImportAction.action',
    method: 'get',
    params: query
  })
}

export function relevanceFolderFile (data) {
  return request({
    url: '/associate@DataImportAction.action',
    method: 'post',
    data
  })
}
