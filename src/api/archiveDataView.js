import request from '@/utils/request'

export function fetchListViews (query) {
  return request({
    url: 'listViews@ArchiveDataViewAction.action',
    method: 'get',
    params: query
  })
}
