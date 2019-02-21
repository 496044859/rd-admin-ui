import Mock from 'mockjs'
import { param2Obj } from '@/utils'

const count = 100
const List = []
const ItemList = []

for (let i = 0; i < 5; i++) {
  List.push(Mock.mock({
    'applyDate': '@date',
    'archiveTypeId': 1352286661109,
    'auditingUser|1': ['所属', '层次', '审批人', ''],
    'destroyUser': '',
    'id': '@integer(300, 5000)',
    'itemCount': 1,
    'judgeDate': '@date',
    'judgeDept': '106',
    'judgeNo': '',
    'judgePurpose|1': ['1', '2', '3', '4'],
    'judgeSummary': '是对方是否',
    'judgeUser': '档案管理员',
    'name|1': ['密级鉴定', '保管期限鉴定', '销毁鉴定'],
    'referUser': '116',
    'status|1': ['0', '1', '2', '3', '4', '5'],
    'treeNodeId': '',
    'workFlowId': '',
    'workInstanceId': ''
  }))
}

for (let i = 0; i < count; i++) {
  ItemList.push(Mock.mock({
    'officeArchivalCode': '@integer(300, 5000)',
    'fileCode': '@ctitle(5,10)',
    'id': '@integer(300, 5000)',
    'author': '@cname',
    'dateOfCreation': '@date',
    'retentionPeriod|1': ['1', '2', '3', '4'],
    'oldresult|1': ['1', '2', '3', '4'],
    'titleProper': '@ctitle(5,10)',
    'status|1': ['0', '1', '2', '3', '4', '5'],
    'destroyReason': ''
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
  getItemList: config => {
    const { importance, type, title, page = 1, limit = 20, sort } = param2Obj(config.url)

    let mockList = ItemList.filter(item => {
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
  checkConfim: () => {
    const json = Mock.mock({
      'checkvalue|1': ['1', '2', '3', '4', '5']
    })
    return {
      success: true,
      message: '',
      data: json
    }
  },
  judgeConfim: () => {
    return {
      success: true,
      data: {}
    }
  }
}
