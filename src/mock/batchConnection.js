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
    'attachDate': '@date',
    'attachType|1': ['0', '1', '2'],
    'attachResult': '挂接成功1条，挂接失败0条',
    'attachUser': '档案管理员'
  }))
}

export default {
  getAttach: config => {
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
