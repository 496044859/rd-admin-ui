import Mock from 'mockjs'
import { param2Obj } from '@/utils'

const count = 100
const List = []
const List2 = []

for (let i = 0; i < count; i++) {
  List2.push(Mock.mock({
    'id': '@id',
    'officeArchivalCode': '1.01-2015-永久-0002',
    'fondsCode': '1377226592843',
    'archiveTypeId': 1352286661109,
    'titleProper': '挂接成功1条，挂接失败0条',
    'status|1': ['30', '31', '60']
  }))
}

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    'id': '@id',
    'date': '@date',
    'page|1': ['10', '11', '12', '22', '31'],
    'number|1': ['001', '002', '003', '004', '005'],
    'electron|1': ['10', '20', '30', '40', '50'],
    'doncument': '挂接成功1条，挂接失败0条',
    'userName': '档案管理员',
    'designation': '中信档案管理名称',
    'code': '项目名称代号',
    'reference|1': ['1001', '1002', '1003', '1004', '1005'],
    'title': 'IG牛逼',
    'term|1': ['10年', '20年', '30年', '永久'],
    'company|1': ['中信', '人大', '天地软件园', '沙县'],
    'startDate': '@date',
    'endDate': '@date'
  }))
}

export default {
  getList: config => {
    const { page = 1, limit = 20 } = param2Obj(config.url)
    let mockList = List
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
  getUnAttach: config => {
    const { page = 1, limit = 20 } = param2Obj(config.url)
    let mockList = List2
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
  delete: () => {
    return {
      success: true,
      json: {}
    }
  },
  attach: () => {
    return {
      success: true,
      json: {}
    }
  }
}
