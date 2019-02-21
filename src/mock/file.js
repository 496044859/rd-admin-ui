import Mock from 'mockjs'
import { param2Obj } from '@/utils'

const count = 100
const List = []
const binList = []

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    'reject': false,
    'fileCode': '@integer(300, 5000)',
    'status|1': ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'],
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
    'retentionPeriod|1': ['Y', 'D30', 'D10'],
    'caseNo': null,
    'titleProper': '@ctitle(5, 10)',
    'itemCount': 0,
    'archiveTypeId': '1352286661109',
    'docYj|1': [true, false],
    'entityJg': [true, false]
  }))

  binList.push(Mock.mock({
    'ID': '@integer(300, 5000)',
    'ARCHIVE_TYPE_ID|1': ['1361066263788', '1352286661109', '1352286676703'],
    'DELETE_DATE': '@date',
    'OFFICE_ARCHIVAL_CODE': '6-1900-3年-0001',
    'TITLE_PROPER': '@ctitle(5, 10)',
    'type|1': ['f', 'v', 'd']
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
      data: {}
    }
  },
  delete: () => {
    return {
      success: true,
      data: {}
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
  getBinList: config => {
    const { importance, type, titleProper, page = 1, limit = 10, sort } = param2Obj(config.url)

    let mockList = binList.filter(item => {
      if (importance && item.importance !== +importance) return false
      if (type && item.type !== type) return false
      if (titleProper && item.titleProper.indexOf(titleProper) < 0) return false
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
  isDelParent: () => {
    const json = Mock.mock({
      'flag|1': ['0', '1'],
      'title_proper': '测试条目'
    })
    return {
      success: true,
      message: '',
      data: json
    }
  },
  recover: () => {
    return {
      success: true,
      message: '',
      data: {}
    }
  },
  deleteForRever: () => {
    return {
      success: true,
      message: '',
      data: {}
    }
  },
  deleteAllForRever: () => {
    return {
      success: true,
      message: '',
      data: {}
    }
  },
  validateYj: () => {
    const json = Mock.mock({
      'validateMsg|1': ['您选择的数据【有部分】已【移交】，是否继续？', '']
    })
    return {
      success: true,
      message: '',
      data: json
    }
  },
  handOver: () => {
    return {
      success: true,
      message: '',
      data: {}
    }
  },
  remove: () => {
    return {
      success: true,
      message: '',
      data: {}
    }
  },
  fetchGridData: () => {
    return {
      success: true,
      massage: '获取文件数据成功',
      data: ['获取文件数据成功']
    }
  },
  fetchGridDataV: () => {
    return {
      success: true,
      massage: '获取文件数据成功',
      data: ['获取文件数据成功']
    }
  }
}
