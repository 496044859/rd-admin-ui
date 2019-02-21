import Mock from 'mockjs'
import { param2Obj } from '@/utils'

const count = 5
const List = []

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    'id': '@id',
    'yearCode': '@date',
    'startNumber|1': ['1', '2', '3', '4', '5'],
    'currentMin': '当前起始号',
    'totalCount': '记录数',
    'seriesCode': '分类号',
    'retentionPeriod': '保管期限',
    'codeExist': '否',
    'fondsCode': '全宗'
  }))
}

export default {
  getAllList: config => {
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
  }
}
