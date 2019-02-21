import request from '@/utils/request'

export function fetchFondsCode (query) {
  return request({
    url: '/listFondsCode@SystemAction.action',
    method: 'get',
    params: query
  })
}

export function fetchUsersByAuth (query) {
  return request({
    url: '/listUsersByAuth@SystemAction.action',
    method: 'get',
    params: query
  })
}

export function fetchDeptsByAuth (query) {
  return request({
    url: '/listDeptsByAuth@SystemAction.action',
    method: 'get',
    params: query
  })
}

export function fetchSectionByAuth (query) {
  return request({
    url: '/listSectionByAuth@SystemAction.action',
    method: 'get',
    params: query
  })
}

export function fetchDeptList (query) {
  return request({
    url: '/listDepts@SystemAction.action',
    method: 'get',
    params: query
  })
}
export function fetchJurisdictionDeptsList (query) {
  return request({
    url: '/listJurisdictionDepts@SystemAction.action',
    method: 'get',
    params: query
  })
}
export function fetchgetDefineTree (query) {
  return request({
    url: '/listDefineTree@SystemAction.action',
    method: 'get',
    params: query
  })
}

export function fetchResourceTree (query) {
  return request({
    url: '/getResourceTree@SystemAction.action',
    method: 'get',
    params: query
  })
}

export function fetchCustomDefinedDetail (query) {
  return request({
    url: '/getCustomDefinedDetail@SystemAction.action',
    method: 'get',
    params: query
  })
}

export function saveDataDoc (data) {
  return request({
    url: '/saveRoleAsign@ArchiveDataViewAction.action',
    method: 'post',
    data,
    qs: false
  })
}

export function applyDefineTo (data) {
  return request({
    url: '/applyDefineTo@SystemAction.action',
    method: 'post',
    data,
    qs: false
  })
}

export function fetchModuleState (query) {
  return request({
    url: '/getModuleState@SystemAction.action',
    method: 'get',
    params: query
  })
}

export function fetchSysDepts (query) {
  return request({
    url: '/getSysDepts@SystemAction.action',
    method: 'get',
    params: query
  })
}

export function fetchDeptUsers (query) {
  return request({
    url: '/getDeptUsers@SystemAction.action',
    method: 'get',
    params: query
  })
}

export function treeViews (query) {
  return request({
    url: '/getSysDepts@SystemAction.action',
    method: 'get',
    params: query
  })
}
