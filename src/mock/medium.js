import Mock from 'mockjs'
import { param2Obj } from '@/utils'

const count = 100
const List = []

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    'id': '@integer(300, 5000)',
    'checkStatus': '',
    'exportFormat': 'XML',
    'mediumDate': '@date',
    'mediumFileType': '2',
    'mediumNo': '100',
    'mediumType': '2',
    'mediumUser': '',
    'status|1': ['0', '1'],
    'archiveTypeId': '1352286661109,1352286676703',
    'type': '',
    'yearCodeFrom': 2010,
    'yearCodeTo': 2018
  }))
}

export default {
  getList: config => {
    const { importance, type, title, page = 1, limit = 20, sort } = param2Obj(config.url)

    let mockList = List.filter(item => {
      if (importance && item.importance !== +importance) return false
      if (type && item.type !== type) return false
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
      data: {
        totalCount: mockList.length,
        content: pageList
      }
    }
  },
  create: () => {
    const json = Mock.mock({
      id: '@id'
    })
    return {
      success: true,
      data: json
    }
  },
  delete: () => {
    return {
      success: true,
      data: {}
    }
  },
  countFileSize: () => {
    return {
      success: true,
      message: '',
      data: '39787253'
    }
  }
}
