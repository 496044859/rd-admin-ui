import Mock from 'mockjs'
import { param2Obj } from '@/utils'

const count = 100
const List = []

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    'FONDS_CODE': '1377226592843',
    'ARCHIVE_TYPE_ID': '1352286661109',
    'TYPE': 'f',
    'RED_OFFICE_ARCHIVAL_CODE': '2.01-2015-30年-0002',
    'ID': '@integer(300, 5000)',
    'RED_TITLE_PROPER': '@ctitle(5, 10)',
    'FILE_CODE': '1321321',
    'IS_BORROWED|1': ['1', '2'],
    'DOC_COUNT|1': ['0', '1', '2'],
    'PUT_DATE': '@date'
  }))
}

export default {
  getList: config => {
    const { importance, status, title, page = 1, limit = 5, sort } = param2Obj(config.url)

    let mockList = List.filter(item => {
      if (importance && item.importance !== +importance) return false
      if (status && item.status !== status) return false
      if (title && item.title.indexOf(title) < 0) return false
      return true
    })

    if (sort === '-id') {
      mockList = mockList.reverse()
    }

    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

    return {
      success: true,
      message: '',
      data: pageList
    }
  },
  save: () => {
    return {
      success: true,
      data: {}
    }
  },
  delete: () => {
    return {
      success: true,
      data: {}
    }
  }
}
