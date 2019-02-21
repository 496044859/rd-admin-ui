import request from '@/utils/request'

export function fetchList (query) {
  return request({
    url: '/list@JudgeAction.action',
    method: 'get',
    params: query
  })
}

export function add (data) {
  return request({
    url: '/add@JudgeAction.action',
    method: 'post',
    data
  })
}

export function edit (data) {
  return request({
    url: '/modify@JudgeAction.action',
    method: 'post',
    data
  })
}

export function deletes (data) {
  return request({
    url: '/delete@JudgeAction.action',
    method: 'post',
    data
  })
}

export function checkConfim (data) {
  return request({
    url: '/checkConfim@JudgeAction.action',
    method: 'post',
    data
  })
}

export function checkSubmit (data) {
  return request({
    url: '/checkSubmit@JudgeAction.action',
    method: 'post',
    data
  })
}

export function judgeConfim (data) {
  return request({
    url: '/judgeConfim@JudgeAction.action',
    method: 'post',
    data
  })
}

export function fetchItemList (query) {
  return request({
    url: '/listItem@JudgeAction.action',
    method: 'get',
    params: query
  })
}

export function pastedArchivePage (query) {
  return request({
    url: '/pastedArchivePage@JudgeAction.action',
    method: 'get',
    params: query
  })
}

export function down (query) {
  return request({
    url: '/getArchiveType@JudgeAction.action',
    method: 'get',
    params: query
  })
}

export function addItemList (query) {
  return request({
    url: '/addJudgeItems@JudgeAction.action',
    method: 'get',
    params: query
  })
}

export function fetchGridDataFile (query) {
  return request({
    url: '/listItemFolderFile@JudgeAction.action',
    method: 'get',
    params: query
  })
}

export function onAppraisal (data) {
  return request({
    url: '/batchJudge@JudgeAction.action',
    method: 'post',
    data
  })
}

export function deletesFile (query) {
  return request({
    url: '/deleteArchive@JudgeAction.action',
    method: 'get',
    params: query
  })
}

export function fetchDefineNames (query) {
  return request({
    url: '/getJudgeItemView@JudgeAction.action',
    method: 'get',
    params: query
  })
}

export function destructionFileNames (query) {
  return request({
    url: '/tobeDestroyed@JudgeAction.action',
    method: 'get',
    params: query
  })
}

export function fetchJudgeStatis (query) {
  return request({
    url: '/judgeStatisticalbyArchiveType@JudgeAction.action',
    method: 'get',
    params: query
  })
}

export function fetchJudgeDatas (query) {
  return request({
    url: '/getDestructionArchiveitems@JudgeAction.action',
    method: 'get',
    params: query
  })
}

export function fetchJudgeReport (query) {
  return request({
    url: '/judgeReport@JudgeAction.action',
    method: 'get',
    params: query
  })
}

export function fetchChartData (query) {
  return request({
    url: '/judgeTreeReport@JudgeAction.action',
    method: 'get',
    params: query
  })
}

export function startProcessInstance (query) {
  return request({
    url: '/startSubmit@JudgeAction.action',
    method: 'post',
    params: query
  })
}

export function getAlluser (query) {
  return request({
    url: '/getAlluser@JudgeAction.action',
    method: 'get',
    params: query
  })
}

export function updateJugeItembmldshr (query) {
  return request({
    url: '/updateJugeItembmldshr@JudgeAction.action',
    method: 'get',
    params: query
  })
}
