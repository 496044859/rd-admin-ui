import Mock from 'mockjs'
import { param2Obj } from '@/utils'

const count = 100
const List = []
const detailList = []
const registerList = []

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    'borrowNo': '@date',
    'status|1': ['0', '1', '6', '4', '5', '6', '7', '9'],
    'borrowUser|1': ['2', '1', '3', '4', '5'],
    'borrowDate': '@date',
    'returnDate': '@date',
    'borrowDept': '办公室',
    'haveEntityTime': '@date',
    'dateOfCreation': '@date',
    'id': '@integer(300, 5000)'
  }))

  detailList.push(Mock.mock({
    'officeArchivalCode': '8.01-2015-30年-0001-0001',
    'status|1': ['0', '1', '2', '3'],
    'borrowType|1': ['1', '2'],
    'borrowNo': 'CES20180004',
    'fondsCode': '1377226592843',
    'titleProper': '@ctitle',
    'archiveTypeId': '1352286654218',
    'docCount|1': [0, 1, 2],
    'archiveType': 'f',
    'date': '@date',
    'id': '@integer(300, 5000)'
  }))

  registerList.push(Mock.mock({
    'status|1': ['0', '1', '3', '4', '5', '6', '9'],
    'borrowNo': 'CES20180004',
    'borrowDate': '@date',
    'returnDate': '@date',
    'endDate': '@date',
    'user|1': ['0', '1', '2', '3', '4', '5'],
    'approval|1': ['0', '1', '2', '3'],
    'borrowState|1': ['0', '1', '2', '4', '3'],
    'page|1': ['10', '20', '60', '40', '50', '30'],
    'title': '@ctitle',
    'addressNumber|1': [0, 1, 2, 3, 4],
    'department': '有关部门',
    'borrowMode': '有借有还',
    'reference': '@integer(300, 5000)'
  }))
}

export default {
  getList: config => {
    const { importance, status, title, page = 1, limit = 20, sort } = param2Obj(config.url)

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
      data: {
        totalCount: mockList.length,
        content: pageList
      }
    }
  },
  saveBorrowInfo: () => {
    return {
      success: true,
      data: {}
    }
  },
  BackBorrowInfo: () => {
    return {
      success: true,
      data: {}
    }
  },
  getDetailList: config => {
    const { importance, status, title, page = 1, limit = 20, sort } = param2Obj(config.url)

    let mockList = detailList.filter(item => {
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
      data: {
        totalCount: mockList.length,
        content: pageList
      }
    }
  },
  getEntryList: config => {
    const { importance, status, title, page = 1, limit = 20, sort } = param2Obj(config.url)

    let mockList = detailList.filter(item => {
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
      data: {
        totalCount: mockList.length,
        content: pageList
      }
    }
  },
  getEntryIdList: config => {
    const { importance, status, title, page = 1, limit = 20, sort } = param2Obj(config.url)

    let mockList = detailList.filter(item => {
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
      data: {
        totalCount: mockList.length,
        content: pageList
      }
    }
  },
  getRegisterList: config => {
    const { importance, status, title, page = 1, limit = 20, sort } = param2Obj(config.url)

    let mockList = registerList.filter(item => {
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
      data: {
        totalCount: mockList.length,
        content: pageList
      }
    }
  },
  deleteList: () => {
    return {
      success: true,
      data: {}
    }
  }
}
