import Mock from 'mockjs'
import { param2Obj } from '@/utils'

const count = 100
const List = []

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    'FONDS_CODE': '1377226592843',
    'ARCHIVE_TYPE_ID': '1352286661109',
    'TYPE': 'f',
    'RED_OFFICE_ARCHIVAL_CODE': '2.01-2015-30年-0002',
    'ID': '@integer(300, 5000)',
    'RED_TITLE_PROPER': '@ctitle(5, 10)',
    'FILE_CODE': '1321321',
    'IS_BORROWED|1': ['1', '2'],
    'DOC_COUNT|1': ['0', '1', '2']
  }))
}

export default {
  getList: config => {
    const { types, queryValues, page = 1, limit = 20, sort } = param2Obj(config.url)

    let mockList = List.filter(item => {
      if (types && item.TYPE !== types) return false
      if (queryValues && item.RED_TITLE_PROPER.indexOf(queryValues) < 0) return false
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
  getGroup: () => {
    return {
      success: true,
      data: {
        'YEAR_CODE': {
          'name': '年度',
          'items': [
            {
              'name': '2018',
              'value': '2018'
            },
            {
              'name': '2013',
              'value': '2013'
            },
            {
              'name': '2014',
              'value': '2014'
            },
            {
              'name': '2017',
              'value': '2017'
            },
            {
              'name': '2022',
              'value': '2022'
            },
            {
              'name': '2011',
              'value': '2011'
            },
            {
              'name': '2015',
              'value': '2015'
            },
            {
              'name': '2016',
              'value': '2016'
            },
            {
              'name': '2020',
              'value': '2020'
            },
            {
              'name': '2012',
              'value': '2012'
            }
          ]
        },
        'ARCHIVE_TYPE_ID': {
          'name': '档案类型',
          'items': [
            {
              'name': '职工管理类',
              'value': '1352286705609'
            },
            {
              'name': '录音录像类',
              'value': '1352286673203'
            },
            {
              'name': '文书档案',
              'value': '1352286661109'
            },
            {
              'name': '电子档案',
              'value': '1352286690218'
            },
            {
              'name': '照片',
              'value': '1352286681328'
            },
            {
              'name': '会计档案（传统立卷）',
              'value': '1352286654218'
            }
          ]
        },
        'RETENTION_PERIOD': {
          'name': '保管期限',
          'items': [
            {
              'name': '短期',
              'value': '1'
            },
            {
              'name': '永久',
              'value': '3'
            },
            {
              'name': '30年',
              'value': '8'
            },
            {
              'name': '长期',
              'value': '2'
            },
            {
              'name': '3年',
              'value': '4'
            }
          ]
        },
        'FILING_DEPT': {
          'name': '归档部门',
          'items': [
            {
              'name': '办公室',
              'value': '1380079661125'
            }
          ]
        }
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
  }
}
