import Mock from 'mockjs'
import { param2Obj } from '@/utils'

const count = 100
const List = []

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    'reject': false,
    'fileCode': '@integer(300, 5000)',
    'status|1': ['30', '41', '66'],
    'yearCode': '@date("yyyy")',
    'fondsCode': '1524210653883',
    'type': 'f',
    'deleted': false,
    'dateOfCreation': '@date',
    'officeArchivalCode': '2.01-2015-30年-0002',
    'isModifyByRejected': null,
    'combined': false,
    'id': '@integer(300, 5000)',
    'author': '@cname',
    'retentionPeriod': '8',
    'caseNo': null,
    'titleProper': '@ctitle(5, 10)',
    'itemCount': 0,
    'archiveTypeId': 1352286661109
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
  update: () => {
    return {
      success: true,
      json: {}
    }
  },
  delete: () => {
    return {
      success: true,
      json: {}
    }
  },
  deptCheck: () => {
    return {
      success: true,
      message: '',
      data: {}
    }
  },
  filing: () => {
    return {
      success: true,
      message: '',
      data: {}
    }
  },
  receive: () => {
    return {
      success: true,
      message: '',
      data: {}
    }
  },
  reject: () => {
    return {
      success: true,
      message: '',
      data: {}
    }
  },
  takeApartVerify: () => {
    return {
      success: true,
      message: '',
      data: {}
    }
  }
}
