import request from '@/utils/request'

export function fetchTreeData (query) {
  return request({
    url: '/getTree@ReportAction.action',
    method: 'post',
    params: query
  })
}

export function fetchList (query) {
  return request({
    url: '/list@ReportAction.action',
    method: 'post',
    params: query
  })
}

export function addList (data) {
  return request({
    url: '/add@ReportAction.action',
    method: 'post',
    data
  })
}

export function editList (data) {
  return request({
    url: '/modify@ReportAction.action',
    method: 'post',
    data
  })
}

export function deleteList (data) {
  return request({
    url: '/delete@ReportAction.action',
    method: 'post',
    data
  })
}

export function fetchListAssignedReport (query) {
  return request({
    url: '/listAssignedReport@ReportAction.action',
    method: 'get',
    params: query
  })
}

export function fetchReportData (query) {
  return request({
    url: '/getReportDatas@ReportAction.action',
    method: 'get',
    params: query
  })
}

// 修改报表挂接请求
export function DefineHockList (query) {
  return request({
    url: '/listDefinedResource@ReportAction.action',
    method: 'get',
    params: query
  })
}

export function unDefineHockList (query) {
  return request({
    url: '/listUnDefinedResource@ReportAction.action',
    method: 'get',
    params: query
  })
}

export function saveHockList (data) {
  return request({
    url: '/saveAssign@ReportAction.action',
    method: 'post',
    params: data
  })
}

export function copySelectTo (query) {
  return request({
    url: '/getTreeByType@ReportAction.action',
    method: 'post',
    params: query
  })
}

export function copyCower (query) {
  return request({
    url: '/checkExist@ReportAction.action',
    method: 'post',
    params: query
  })
}

export function copyOk (data) {
  return request({
    url: '/copy@ReportAction.action',
    method: 'post',
    params: data
  })
}

export function reportUpload (data) {
  return request({
    url: '/importReport@ReportAction.action',
    method: 'post',
    params: data
  })
}

export function downloadReport (data) {
  return request({
    url: '/downloadReport@ReportAction.action',
    method: 'post',
    data
  })
}

export function downloadReportNull (data) {
  return request({
    url: '/downloadEmptyTemplate@ReportAction.action',
    method: 'post',
    params: data
  })
}

export function getRecords (query) {
  return request({
    url: '/generateReport@BaseFolderAction.action',
    method: 'post',
    params: query
  })
}

export function getFile (query) {
  return request({
    url: '/generateReport@BaseFileAction.action',
    method: 'post',
    params: query
  })
}
