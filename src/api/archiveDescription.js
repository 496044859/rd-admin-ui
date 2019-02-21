import request from '@/utils/request'
export function getSelect (query) {
  return request({
    url: 'getPropsExclud@FileAction.action',
    method: 'get',
    params: query
  })
}
export function postFormData (data) {
  return request({
    url: 'batchModify@FileAction.action',
    method: 'post',
    params: data
  })
}
export function getEssentialSelect (data) {
  return request({
    url: 'getCustomFormContent@ExcelExportDefineAction.action',
    method: 'post',
    params: data
  })
}
export function getUnDefine (data) {
  return request({
    url: 'getJsonOfUnDefinedProperties@ExcelExportDefineAction.action',
    method: 'post',
    params: data
  })
}
export function getDefine (data) {
  return request({
    url: 'getJsonOfDefinedProperties@ExcelExportDefineAction.action',
    method: 'post',
    params: data
  })
}
export function saveDefienAttr (data) {
  return request({
    url: 'save@ExcelExportDefineAction.action',
    method: 'post',
    params: data
  })
}
export function downLoadExcel (data) {
  return request({
    url: 'exportExcel@FileAction.action',
    method: 'post',
    params: data
  })
}
export function setRecover (data) {
  return request({
    url: 'restore@ExcelExportDefineAction.action',
    method: 'post',
    params: data
  })
}
