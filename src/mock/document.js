import Mock from 'mockjs'
import { param2Obj } from '@/utils'

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(
    Mock.mock({
      AMOUNT_OF_PAGES: '',
      DOC_TYPE: '1',
      FILE_BROWSE_PATH: '201808/1533635535784_7.jpg',
      'dzwjlx|1': ['jpg', 'pdf'],
      FILE_SIZE: '@increment',
      ID: '@increment',
      ITEM_NO: '1',
      OA_SN: '',
      createTime: '1.01-2013-30年-0003-0001',
      PAGE_NO: '',
      wjm: '7.jpg',
      TYPE: 'Y',
      VERSION: ''
    })
  )
}

export default {
  getList: config => {
    const { importance, type, title, page = 1, limit = 5, sort } = param2Obj(
      config.url
    )

    let mockList = List.filter(item => {
      if (importance && item.importance !== +importance) return false
      if (type && item.type !== type) return false
      if (title && item.title.indexOf(title) < 0) return false
      return true
    })

    if (sort === '-id') {
      mockList = mockList.reverse()
    }

    const pageList = mockList.filter(
      (item, index) => index < limit * page && index >= limit * (page - 1)
    )

    return {
      success: true,
      message: '',
      data: {
        content: pageList,
        total: mockList.length
      }
    }
  },
  create: () => ({
    success: true
  }),
  update: () => ({
    success: true
  }),
  delete: () => ({
    success: true
  })
}
