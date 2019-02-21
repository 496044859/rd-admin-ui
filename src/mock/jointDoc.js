import Mock from 'mockjs'
import { param2Obj } from '@/utils'

const count = 100
const List = []

for (let i = 0; i < count; i++) {
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
    'judgeUser': '超级档案管理员',
    'name': '收拾收拾',
    'referUser': '116',
    'status|1': ['0', '1', '2', '3', '4', '5'],
    'treeNodeId': '',
    'workFlowId': '',
    'workInstanceId': ''
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
  startProcessInstance: () => {
    return {
      success: true,
      data: {}
    }
  }
}
