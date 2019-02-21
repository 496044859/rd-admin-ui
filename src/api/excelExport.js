import request from '@/utils/request'

export function getList (query) {
  return request({
    url: '/getJsonOfDefinedProperties@ExcelExportDefineAction.action',
    method: 'get',
    params: query
  })
}

export function getNoList (query) {
  return request({
    url: '/getJsonOfUnDefinedProperties@ExcelExportDefineAction.action',
    method: 'get',
    params: query
  })
}

export function saveList (data) {
  return request({
    url: '/save@ExcelExportDefineAction.action',
    method: 'post',
    data
  })
}

export function List (data) {
  return request({
    url: '/exportExcel@BaseFileAction.action',
    method: 'post',
    data
  })
}
