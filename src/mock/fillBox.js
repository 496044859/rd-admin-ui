import Mock from 'mockjs'
import { param2Obj } from '@/utils'

const count = 100
const List = []

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    'id': '@integer(300, 5000)',
    'boxNo': '@id',
    'createDate': '@date',
    'createUser': '116',
    'storeAddress': null,
    'beginOfficeArchivalCode': '002',
    'endOfficeArchivalCode': '003',
    'remark': null,
    'itemCount': 2,
    'orderNo': null,
    'archiveTypeId': 1352286661109,
    'type': 'f',
    'treeNodeId': 1380422139785,
    'boxName': null,
    'dateBegun': null,
    'dateFinished': null,
    'amountOfPages': 0,
    'retentionPeriod': '3',
    'containerStatus': null,
    'barcode': null,
    'itemNo': null,
    'fondsCode': '1377226592843',
    'yearCode': 2013,
    'containerOrderNo': null,
    'filingDept': null,
    'boxStandard': '50',
    'seriesCode': '1.01'
  }))
}

export default {
  getBoxList: config => {
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
  checkBoxNo: () => {
    return {
      success: true,
      data: {
        'yearCode': '2013',
        'ids': '1533805474370,1533805475010,1533810009100,1533810009699,1533810010343',
        'retentionPeriod': '3',
        'fondsCode': '1377226592843',
        'countPage': '0',
        'filingDept': null
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
  checkStored: () => {
    return {
      success: true,
      message: '',
      data: {}
    }
  }
}
