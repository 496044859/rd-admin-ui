import request from '@/utils/request'

export function fetchList (query) {
  return request({
    url: '/getAllCompilation@CompilationAction.action',
    method: 'get',
    params: query
  })
}

export function create (data) {
  return request({
    url: '/addCompilation@CompilationAction.action',
    method: 'post',
    data
  })
}

export function update (data) {
  return request({
    url: '/updateCompilation@CompilationAction.action',
    method: 'post',
    data
  })
}

export function remove (data) {
  return request({
    url: '/deleteCompilation@CompilationAction.action',
    method: 'post',
    data
  })
}

export function fetchCompilationList (query) {
  return request({
    url: '/queryMaterial@CompilationMaterialAction.action',
    method: 'get',
    params: query
  })
}

export function deleteList (data) {
  return request({
    url: '/deleteMaterial@CompilationMaterialAction.action',
    method: 'post',
    data
  })
}

export function editSaveMaterial (data) {
  return request({
    url: '/updateMaterial@CompilationMaterialAction.action',
    method: 'post',
    data
  })
}

export function fecthDirectory (query) {
  return request({
    url: '/getDirectory@CompilationCataAction.action',
    method: 'get',
    params: query
  })
}

export function addDirectory (data) {
  return request({
    url: '/addCompilationDirectory@CompilationCataAction.action',
    method: 'post',
    data
  })
}

export function updateDirectory (data) {
  return request({
    url: '/updateCompilationDirectory@CompilationCataAction.action',
    method: 'post',
    data
  })
}

export function deleteDirectory (data) {
  return request({
    url: '/deleteCompilationDirectory@CompilationCataAction.action',
    method: 'post',
    data
  })
}

export function fecthMaterialTree (query) {
  return request({
    url: '/getDefineTree@CompilationMaterialTreeAction.action',
    method: 'get',
    params: query
  })
}

export function addFolder (data) {
  return request({
    url: '/addFolder@CompilationMaterialTreeAction.action',
    method: 'post',
    data
  })
}

export function editModify (data) {
  return request({
    url: '/modify@CompilationMaterialTreeAction.action',
    method: 'post',
    data
  })
}

export function deletes (data) {
  return request({
    url: '/batchDelete@CompilationMaterialTreeAction.action',
    method: 'post',
    data
  })
}

export function addMaterial (data) {
  return request({
    url: '/addMaterial@CompilationMaterialTreeAction.action',
    method: 'post',
    data
  })
}

export function createEbook (data) {
  return request({
    url: '/createEbook@CompilationAction.action',
    method: 'post',
    data
  })
}

export function publish (data) {
  return request({
    url: '/publish@CompilationAction.action',
    method: 'post',
    data
  })
}

export function cancel (data) {
  return request({
    url: '/cancel@CompilationAction.action',
    method: 'post',
    data
  })
}

export function fecthPublishedCompilation (query) {
  return request({
    url: '/getPublishedCompilation@CompilationAction.action',
    method: 'get',
    params: query
  })
}
