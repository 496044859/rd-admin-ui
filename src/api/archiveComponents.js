import request from '@/utils/request'

export function fetchQueryPropertyByType (query) {
  return request({
    url: '/getQueryPropertyByType@TzhJgdaYsjdyAction.action',
    method: 'get',
    params: query
  })
}

export function OAUpdate (query) {
  return request({
    url: '/syncOaData@CanConfigOaImportAction.action',
    method: 'get',
    params: query
  })
}

export function fetchSeriesCode (query) {
  return request({
    url: '/getSeriesCode@ArchiveTreeViewAction.action',
    method: 'get',
    params: query
  })
}

export function fetchPreviewTree (query) {
  return request({
    url: '/previewTree@BaseArchiveAction.action',
    method: 'get',
    params: query
  })
}

export function fetchItemView (query) {
  return request({
    url: '/getItemView@BaseArchiveAction.action',
    method: 'get',
    params: query
  })
}

export function fetchRelationTree (query) {
  return request({
    url: '/associatedPreview@BaseArchiveAction.action',
    method: 'get',
    params: query
  })
}
