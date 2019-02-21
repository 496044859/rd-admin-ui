import Mock from 'mockjs'
import { param2Obj } from '@/utils'

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    align: 'L',
    'archiveNo|1': true,
    'codingId|1': ['RETENTION_PERIOD', ''],
    colspan: 1,
    columnName: 'FILING_DATE',
    dataItemPermissions: true,
    dataLength: 20,
    'dataType|1': ['c', 'd', 'm', 't', 'p', 'u', 'f', 'n', 'h', 'b'],
    defaultValue: '',
    empty: false,
    export: true,
    exportColumnName: 'FILING_DATE',
    exportName: '归档日期',
    exportOrderNo: 0,
    'flowNo|1': true,
    hidden: false,
    id: '@increment',
    inheritFolder: false,
    inheritLast: false,
    inheritProject: false,
    'input|1': true,
    'list|1': true,
    'name|1': ['归档日期', '文件日期', '检查日期'],
    noempty: false,
    orderNo: 0,
    primaryKey: false,
    propertyName: 'filingDate',
    'query|1': true,
    queryType: '>',
    readonly: false,
    remark: '',
    'retrieveFlag|1': true,
    'sort|1': true,
    sortType: 'A',
    'system|1': true,
    textArea: false,
    type: 'f',
    update: false,
    used: true,
    width: 80,
    archiveType: {
      filingMode: '0',
      id: 1,
      leaf: true,
      name: '待分类',
      orderNo: 0,
      processInfo: true,
      remark: '',
      retentionPeriod: '',
      showFlag: '0',
      storeMode: '2',
      storeType: 't',
      text: '待分类',
      type: 'f'
    }
  }))
}

const archiveTypes = [
  {
    'sfdgcxxgl': true,
    'kdlb': 'f',
    'daklx': 't',
    'id': '4410a3fc82664194b538347b85bda789',
    'leaf': false,
    'mc': '文书档案',
    'zlfs': '0'
  },
  {
    'sfdgcxxgl': true,
    'kdlb': 'v',
    'daklx': 't',
    'id': '0cf9f61d86df40ffb8a3b7f3e43126cf',
    'leaf': false,
    'mc': '文书档案（立卷）',
    'zlfs': '0'
  }
]

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
      data: pageList
    }
  },
  getTree: () => {
    return {
      success: true,
      message: '',
      data: [
        {
          'sfdgcxxgl': true,
          'kdlb': 'f',
          'daklx': 't',
          'children': [
            {
              'dalxid': '4410a3fc82664194b538347b85bda789',
              'leaf': true,
              'kdlb': 'f',
              'mc': '文件'
            }
          ],
          'id': '4410a3fc82664194b538347b85bda789',
          'leaf': false,
          'mc': '文书档案',
          'zlfs': '0'
        },
        {
          'sfdgcxxgl': true,
          'kdlb': 'v',
          'daklx': 't',
          'children': [
            {
              'dalxid': '0cf9f61d86df40ffb8a3b7f3e43126cf',
              'leaf': true,
              'kdlb': 'f',
              'mc': '文件'
            },
            {
              'dalxid': '0cf9f61d86df40ffb8a3b7f3e43126gj',
              'leaf': true,
              'kdlb': 'v',
              'mc': '案卷'
            }
          ],
          'id': '0cf9f61d86df40ffb8a3b7f3e43126cf',
          'leaf': false,
          'mc': '文书档案（立卷）',
          'zlfs': '0'
        }
      ]
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
  }),
  deleteTree: () => ({
    success: true,
    data: {}
  }),
  addTree: () => {
    const id = Mock.mock('@id')
    const data = {
      id: id
    }
    return {
      success: true,
      data: data
    }
  },
  editTree: () => {
    return {
      success: true,
      data: []
    }
  },
  toSystem: () => ({
    success: true
  }),
  unSystem: () => ({
    success: true
  }),
  getCustomDefinedDetail: () => {
    return {
      success: true,
      data: [
        {
          'module': 'SF',
          'sort': 1,
          'form': 1,
          'query': 1,
          'userId': '0',
          'mkmc': '整理归档',
          'report': 1,
          'archiveNo': 1,
          'list': 1,
          'type': 'f',
          'archiveTypeId': 1352286661109
        },
        {
          'module': 'DC',
          'sort': 1,
          'form': 1,
          'query': 1,
          'userId': '0',
          'mkmc': '部门审核',
          'report': null,
          'archiveNo': null,
          'list': 1,
          'type': 'f',
          'archiveTypeId': 1352286661109
        },
        {
          'module': 'AR',
          'sort': 1,
          'form': 1,
          'query': 1,
          'userId': '0',
          'mkmc': '档案接收',
          'report': 1,
          'archiveNo': 1,
          'list': 1,
          'type': 'f',
          'archiveTypeId': 1352286661109
        },
        {
          'module': 'BS',
          'sort': null,
          'form': 1,
          'query': null,
          'userId': '0',
          'mkmc': '批量扫描',
          'report': '',
          'archiveNo': null,
          'list': null,
          'type': 'f',
          'archiveTypeId': 1352286661109
        },
        {
          'module': 'MD',
          'sort': 1,
          'form': 1,
          'query': 1,
          'userId': '0',
          'mkmc': '部门资料库',
          'report': 1,
          'archiveNo': null,
          'list': 1,
          'type': 'f',
          'archiveTypeId': 1352286661109
        },
        {
          'module': 'AS',
          'sort': 1,
          'form': 1,
          'query': 1,
          'userId': '0',
          'mkmc': '档案整理',
          'report': 1,
          'archiveNo': 1,
          'list': 1,
          'type': 'f',
          'archiveTypeId': 1352286661109
        },
        {
          'module': 'LC',
          'sort': 1,
          'form': 1,
          'query': 1,
          'userId': '0',
          'mkmc': '领导审核',
          'report': 1,
          'archiveNo': null,
          'list': 1,
          'type': 'f',
          'archiveTypeId': 1352286661109
        },
        {
          'module': 'CP',
          'sort': 1,
          'form': '',
          'query': 1,
          'userId': '0',
          'mkmc': '编目打印',
          'report': 1,
          'archiveNo': null,
          'list': null,
          'type': 'f',
          'archiveTypeId': 1352286661109
        },
        {
          'module': 'BM',
          'sort': 1,
          'form': 1,
          'query': 1,
          'userId': '0',
          'mkmc': '档案盒管理',
          'report': '',
          'archiveNo': null,
          'list': 1,
          'type': 'f',
          'archiveTypeId': 1352286661109
        },
        {
          'module': 'TM',
          'sort': null,
          'form': 1,
          'query': null,
          'userId': '0',
          'mkmc': '专题组织',
          'report': null,
          'archiveNo': null,
          'list': 1,
          'type': 'f',
          'archiveTypeId': 1352286661109
        },
        {
          'module': 'AJ',
          'sort': null,
          'form': 1,
          'query': 1,
          'userId': '0',
          'mkmc': '档案鉴定',
          'report': null,
          'archiveNo': null,
          'list': 1,
          'type': 'f',
          'archiveTypeId': 1352286661109
        },
        {
          'module': 'YJ',
          'sort': 1,
          'form': 1,
          'query': 1,
          'userId': '0',
          'mkmc': '档案移交',
          'report': 1,
          'archiveNo': 1,
          'list': 1,
          'type': 'f',
          'archiveTypeId': 1352286661109
        },
        {
          'module': 'AQ',
          'sort': 1,
          'form': 1,
          'query': 1,
          'userId': '0',
          'mkmc': '档案检索',
          'report': 1,
          'archiveNo': null,
          'list': 1,
          'type': 'f',
          'archiveTypeId': 1352286661109
        },
        {
          'module': 'WM',
          'sort': 1,
          'form': 1,
          'query': 1,
          'userId': '0',
          'mkmc': '借阅管理',
          'report': 1,
          'archiveNo': null,
          'list': 1,
          'type': 'f',
          'archiveTypeId': 1352286661109
        },
        {
          'module': 'DD',
          'sort': 1,
          'form': 1,
          'query': 1,
          'userId': '0',
          'mkmc': '数据维护',
          'report': 1,
          'archiveNo': null,
          'list': 1,
          'type': 'f',
          'archiveTypeId': 1352286661109
        },
        {
          'module': 'DE',
          'sort': 1,
          'form': 1,
          'query': 1,
          'userId': '0',
          'mkmc': '数据导出',
          'report': 1,
          'archiveNo': null,
          'list': 1,
          'type': 'f',
          'archiveTypeId': 1352286661109
        },
        {
          'module': 'SA',
          'sort': 1,
          'form': 1,
          'query': 1,
          'userId': '0',
          'mkmc': '档案上架',
          'report': 1,
          'archiveNo': null,
          'list': 1,
          'type': 'f',
          'archiveTypeId': 1352286661109
        },
        {
          'module': 'SV',
          'sort': null,
          'form': 1,
          'query': null,
          'userId': '0',
          'mkmc': '库房浏览',
          'report': null,
          'archiveNo': null,
          'list': 1,
          'type': 'f',
          'archiveTypeId': 1352286661109
        }
      ]
    }
  },
  addCustomDefinedDetail: () => ({
    success: true,
    data: {
      archiveNo: 1,
      archiveTypeId: 1352286661109,
      form: 1,
      list: 1,
      module: 'SF',
      mkmc: '整理归档',
      query: 1,
      report: 1,
      sort: 1,
      type: 'f',
      userId: '0'
    }
  }),
  deleteCustomDefinedDetail: () => ({
    success: true
  }),
  getCustomDefinedOption: () => {
    return {
      success: true,
      data: [
        {
          value: 'SF',
          text: '整理归档'
        },
        {
          value: 'DC',
          text: '部门审核'
        },
        {
          value: 'AR',
          text: '档案接收'
        },
        {
          value: 'AS',
          text: '档案整理'
        }
      ]
    }
  },
  findByType: () => {
    return {
      success: true,
      data: [
        {
          'filingMode': '0',
          'id': 1352286661109,
          'leaf': true,
          'name': '文书档案',
          'orderNo': 1,
          'processInfo': true,
          'remark': '',
          'retentionPeriod': '',
          'showFlag': '0',
          'storeMode': '1',
          'storeType': 't',
          'text': '文书档案',
          'type': 'f'
        },
        {
          'filingMode': '0',
          'id': 1352286627968,
          'leaf': true,
          'name': '产品生产类',
          'orderNo': 3,
          'processInfo': true,
          'remark': '',
          'retentionPeriod': '',
          'showFlag': '0',
          'storeMode': '1',
          'storeType': 't',
          'text': '产品生产类',
          'type': 'p'
        },
        {
          'filingMode': '0',
          'id': 1352286693656,
          'leaf': true,
          'name': '科研开发类',
          'orderNo': 4,
          'processInfo': true,
          'remark': '',
          'retentionPeriod': '1213247015492,1277886688234,1213246999128',
          'showFlag': '0',
          'storeMode': '1',
          'storeType': 't',
          'text': '科研开发类',
          'type': 'p'
        },
        {
          'filingMode': '0',
          'id': 1361066263788,
          'leaf': true,
          'name': '基建（传统立卷）',
          'orderNo': 6,
          'processInfo': true,
          'remark': '',
          'retentionPeriod': '',
          'showFlag': '',
          'storeMode': '1',
          'storeType': 't',
          'text': '基建（传统立卷）',
          'type': 'v'
        },
        {
          'filingMode': '1',
          'id': 1352286732625,
          'leaf': true,
          'name': '项目建设类',
          'orderNo': 7,
          'processInfo': true,
          'remark': '',
          'retentionPeriod': '',
          'showFlag': '0',
          'storeMode': '1',
          'storeType': 't',
          'text': '项目建设类',
          'type': 'p'
        },
        {
          'filingMode': '0',
          'id': 1352286718093,
          'leaf': true,
          'name': '设备仪器类',
          'orderNo': 8,
          'processInfo': true,
          'remark': '',
          'retentionPeriod': '',
          'showFlag': '0',
          'storeMode': '1',
          'storeType': 't',
          'text': '设备仪器类',
          'type': 'p'
        },
        {
          'filingMode': '0',
          'id': 1361066276337,
          'leaf': true,
          'name': '设备（传统立卷）',
          'orderNo': 9,
          'processInfo': true,
          'remark': '',
          'retentionPeriod': '',
          'showFlag': '',
          'storeMode': '1',
          'storeType': 't',
          'text': '设备（传统立卷）',
          'type': 'v'
        },
        {
          'filingMode': '0',
          'id': 1352286705609,
          'leaf': true,
          'name': '职工管理类',
          'orderNo': 10,
          'processInfo': true,
          'remark': '',
          'retentionPeriod': '',
          'showFlag': '0',
          'storeMode': '1',
          'storeType': 't',
          'text': '职工管理类',
          'type': 'v'
        },
        {
          'filingMode': '0',
          'id': 1352286641921,
          'leaf': true,
          'name': '会计凭证档案',
          'orderNo': 11,
          'processInfo': true,
          'remark': '',
          'retentionPeriod': '',
          'showFlag': '0',
          'storeMode': '1',
          'storeType': 't',
          'text': '会计凭证档案',
          'type': 'f'
        },
        {
          'filingMode': '0',
          'id': 1352286657937,
          'leaf': true,
          'name': '会计账簿档案',
          'orderNo': 12,
          'processInfo': true,
          'remark': '',
          'retentionPeriod': '',
          'showFlag': '',
          'storeMode': '',
          'storeType': 't',
          'text': '会计账簿档案',
          'type': 'f'
        },
        {
          'filingMode': '0',
          'id': 1352286645625,
          'leaf': true,
          'name': '会计报表档案',
          'orderNo': 13,
          'processInfo': true,
          'remark': '',
          'retentionPeriod': '',
          'showFlag': '',
          'storeMode': '',
          'storeType': 't',
          'text': '会计报表档案',
          'type': 'f'
        },
        {
          'filingMode': '0',
          'id': 1352286632968,
          'leaf': true,
          'name': '会计其他档案',
          'orderNo': 14,
          'processInfo': true,
          'remark': '',
          'retentionPeriod': '',
          'showFlag': '',
          'storeMode': '',
          'storeType': 't',
          'text': '会计其他档案',
          'type': 'f'
        },
        {
          'filingMode': '0',
          'id': 1352286654218,
          'leaf': true,
          'name': '会计档案（传统立卷）',
          'orderNo': 15,
          'processInfo': true,
          'remark': '',
          'retentionPeriod': '',
          'showFlag': '0',
          'storeMode': '1',
          'storeType': 't',
          'text': '会计档案（传统立卷）',
          'type': 'v'
        },
        {
          'filingMode': '0',
          'id': 1352286673203,
          'leaf': true,
          'name': '录音录像类',
          'orderNo': 16,
          'processInfo': true,
          'remark': '',
          'retentionPeriod': '',
          'showFlag': '0',
          'storeMode': '1',
          'storeType': 'v',
          'text': '录音录像类',
          'type': 'v'
        },
        {
          'filingMode': '0',
          'id': 1352286681328,
          'leaf': true,
          'name': '照片',
          'orderNo': 17,
          'processInfo': true,
          'remark': '',
          'retentionPeriod': '',
          'showFlag': '0',
          'storeMode': '1',
          'storeType': 'p',
          'text': '照片',
          'type': 'v'
        },
        {
          'filingMode': '0',
          'id': 1352286668078,
          'leaf': true,
          'name': '实物类',
          'orderNo': 18,
          'processInfo': true,
          'remark': '',
          'retentionPeriod': '',
          'showFlag': '0',
          'storeMode': '1',
          'storeType': 't',
          'text': '实物类',
          'type': 'f'
        },
        {
          'filingMode': '0',
          'id': 2,
          'leaf': true,
          'name': '资料类',
          'orderNo': 19,
          'processInfo': true,
          'remark': '',
          'retentionPeriod': '',
          'showFlag': '1',
          'storeMode': '',
          'storeType': 't',
          'text': '资料类',
          'type': 'f'
        },
        {
          'filingMode': '0',
          'id': 1352286690218,
          'leaf': true,
          'name': '电子档案',
          'orderNo': 20,
          'processInfo': true,
          'remark': '',
          'retentionPeriod': '',
          'showFlag': '0',
          'storeMode': '1',
          'storeType': 't',
          'text': '电子档案',
          'type': 'f'
        },
        {
          'filingMode': '0',
          'id': 1535005847427,
          'leaf': true,
          'name': '文书档案复111',
          'orderNo': 23,
          'processInfo': true,
          'remark': '',
          'retentionPeriod': '1213247015492,1277886688234,1213246999128',
          'showFlag': '',
          'storeMode': '',
          'storeType': 't',
          'text': '文书档案复111',
          'type': 'f'
        },
        {
          'filingMode': '0',
          'id': 1537339410639,
          'leaf': true,
          'name': '测试新增类型zsk',
          'orderNo': 25,
          'processInfo': true,
          'remark': '',
          'retentionPeriod': '',
          'showFlag': '0',
          'storeMode': '1',
          'storeType': 't',
          'text': '测试新增类型zsk',
          'type': 'v'
        },
        {
          'filingMode': '0',
          'id': 1540025472478,
          'leaf': true,
          'name': '文书类',
          'orderNo': 23,
          'processInfo': true,
          'remark': '',
          'retentionPeriod': '',
          'showFlag': '0',
          'storeMode': '1',
          'storeType': 't',
          'text': '文书类',
          'type': 'v'
        },
        {
          'filingMode': '0',
          'id': 1540025487064,
          'leaf': true,
          'name': '照片类',
          'orderNo': 24,
          'processInfo': true,
          'remark': '',
          'retentionPeriod': '',
          'showFlag': '0',
          'storeMode': '2',
          'storeType': 'p',
          'text': '照片类',
          'type': 'f'
        },
        {
          'filingMode': '0',
          'id': 1352286676703,
          'leaf': true,
          'name': '文书档案（传统立卷）',
          'orderNo': 2,
          'processInfo': true,
          'remark': '',
          'retentionPeriod': '',
          'showFlag': '0',
          'storeMode': '1',
          'storeType': 't',
          'text': '文书档案（传统立卷）',
          'type': 'v'
        }
      ]
    }
  },
  isArchiveInUse: () => {
    const data = Mock.mock({
      'used|1': [true, false]
    })
    return {
      success: true,
      data: data
    }
  },
  getArchiveTypes: () => {
    return {
      success: true,
      message: '',
      data: archiveTypes
    }
  }
}
