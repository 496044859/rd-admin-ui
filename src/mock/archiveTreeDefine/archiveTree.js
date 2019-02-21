import Mock from 'mockjs'

const treeData = [
  {
    'sxmc': null,
    'id': '1354351648743',
    'hasTopic': 0,
    'tag': null,
    'sxz': null,
    'mc': '企业档案树',
    'children': [
      {
        'sxmc': null,
        'id': '1380422117263',
        'hasTopic': 0,
        'tag': null,
        'sxz': null,
        'mc': '待分类',
        'leaf': true,
        'jdlx': 'a',
        'dalxid': 1
      },
      {
        'sxmc': 'seriesCode',
        'id': '1380422139725',
        'hasTopic': 0,
        'tag': '3.1.1380268239151',
        'sxz': '0',
        'mc': '党群工作类',
        'children': [
          {
            'sxmc': 'seriesCode',
            'id': '1380422139726',
            'hasTopic': 0,
            'tag': '3.1.1380268239151.1380268988278',
            'sxz': '0.01',
            'mc': '党务工作',
            'leaf': true,
            'jdlx': 'c',
            'dalxid': '1352286661109'
          }
        ],
        'leaf': false,
        'jdlx': 'c',
        'dalxid': '1352286661109'
      }
    ],
    'leaf': false,
    'expanded': true,
    'jdlx': 't',
    'dalxid': null
  }
]

const listProperty = [
  {
    mc: '状态',
    id: '1539227186701',
    bmid: 'STATUS',
    sxmc: 'status'
  },
  {
    mc: '检查状态',
    id: '1539227186702',
    bmid: 'CHECK_STATUS',
    sxmc: 'checkStatus'
  },
  {
    mc: '归档日期',
    id: '1539227186712',
    bmid: '',
    sxmc: 'filingDate'
  }
]
export default {
  fetchTreeData: () => {
    return {
      success: true,
      message: '',
      data: treeData
    }
  },
  create: config => {
    const { fMc, fJdlx } = JSON.parse(config.body)
    const fId = Mock.mock('@id')
    const json = {
      id: fId,
      leaf: false,
      name: fMc,
      text: fMc,
      type: fJdlx
    }
    return {
      success: true,
      data: json
    }
  },
  update: config => {
    const { fMc } = JSON.parse(config.body)
    const json = {
      name: fMc,
      text: fMc
    }
    return {
      success: true,
      data: json
    }
  },
  batchAdd: () => ({
    success: true,
    data: {}
  }),
  delete: () => ({
    success: true,
    data: {}
  }),
  getListProperty: () => {
    return {
      success: true,
      data: listProperty
    }
  },
  getListProperty1: () => {
    return {
      success: true,
      data: listProperty
    }
  }
}
