import store from '@/store'

export function formatBool (value) { // 布尔型过滤器
  if (value === '') {
    return ''
  } else if (value) {
    return '是'
  } else {
    return '否'
  }
}

export function formatCoding (value, jsonData) { // 编码型过滤器
  if (value === null || value === '' || jsonData === null || jsonData === undefined) {
    return value
  }
  for (let item of jsonData) {
    if (item.value === value) {
      return item.mc
    }
  }
}

export function formatFonds (value) { // 全宗型过滤器
  const jsonData = store.state.globalData.fondsCodeList
  for (let item of jsonData) {
    if (item.value === value) {
      return item.text
    }
  }
}

export function formatDataType (value) { // 数据类型型过滤器
  const dataTypeMap = {
    'c': '字符型',
    'd': '日期型',
    'm': '编码型',
    't': '树形编码型',
    'p': '部门型',
    'u': '用户型',
    'f': '全宗型',
    'n': '数字型',
    'h': '货币型',
    'b': '布尔型',
    'y': '年度型'
  }
  if (value === null || value === '') {
    return ''
  } else {
    return dataTypeMap[value]
  }
}

export function formatArchiveType (value) { // 档案类型过滤器
  const jsonData = store.state.globalData.archiveTypes
  for (let item of jsonData) {
    if (item.id === value) {
      return item.mc
    }
  }
  return value
}

export function formatType (value) { // 层次过滤器
  if (value === 'f') {
    return '文件'
  } else if (value === 'v') {
    return '案卷'
  } else if (value === null || value === '') {
    return ''
  } else if (value === 'd') {
    return '电子全文'
  } else {
    return value
  }
}

export function formatBorrowType (value) { // 借阅类型过滤
  const jsonData = store.state.globalData.borrowType
  if (value === null || value === '') {
    return ''
  }
  for (let item of jsonData) {
    if (item.value === value) {
      return item.label
    }
  }
  return value
}
