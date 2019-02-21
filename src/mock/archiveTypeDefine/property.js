import Mock from 'mockjs'

const propertyAll = [
  {
    'bmid': '',
    'bz': '你好',
    'cd': 100,
    'createDate': '',
    'createId': '',
    'createTime': {},
    'cxfs': '=',
    'dalxid': '1',
    'dcbm': '',
    'dclbm': '',
    'dcpxh': 0,
    'dqfs': 'L',
    'id': '3feaee8b80794227957f250659a6b116',
    'kd': 0,
    'kdlb': 'f',
    'mc': '保管期限',
    'mldm': 'WS',
    'modifyDate': '',
    'modifyId': '',
    'modifyTime': {},
    'mrz': '',
    'pxfs': 'A',
    'pxh': 1,
    'sfcxzd': false,
    'sfdhzd': false,
    'sffk': false,
    'sfkdcfs': false,
    'sfklr': true,
    'sfkxg': false,
    'sfkxqx': false,
    'sflbzd': true,
    'sflshzd': false,
    'sfpxzd': false,
    'sfwbyfs': false,
    'sfxtzd': false,
    'sfyc': false,
    'sfythcxzd': false,
    'sfyzy': false,
    'sfzd': false,
    'sjklm': 'F_C1',
    'sjlx': 'c',
    'sxmc': '',
    'zyl': 0,
    'pk': '3feaee8b80794227957f250659a6b116'
  }
]

export default {
  getList: () => {
    return {
      success: true,
      data: propertyAll
    }
  },
  getTree: () => {
    return {
      success: true,
      data: [{
        filingMode: '0',
        id: 1,
        leaf: false,
        name: '待分类',
        processInfo: true,
        showFlag: '0',
        storeMode: '2',
        storeType: 't',
        text: '待分类',
        type: 'f',
        children: [{
          archiveTypeId: 1,
          leaf: true,
          text: '文件',
          type: 'f'
        }]
      }, {
        filingMode: '0',
        id: 1352286661109,
        leaf: false,
        name: '文书档案',
        processInfo: true,
        showFlag: '0',
        storeMode: '1',
        storeType: 't',
        text: '文书档案',
        type: 'f',
        children: [{
          archiveTypeId: 1352286661109,
          leaf: true,
          text: '文件',
          type: 'f'
        }]
      }, {
        filingMode: '0',
        id: 1352286676703,
        leaf: false,
        name: '文书档案（传统立卷）',
        processInfo: true,
        showFlag: '0',
        storeMode: '1',
        storeType: 't',
        text: '文书档案（传统立卷）',
        type: 'v',
        children: [{
          archiveTypeId: 1352286676703,
          leaf: true,
          text: '案卷',
          type: 'v'
        }, {
          archiveTypeId: 1352286676703,
          leaf: true,
          text: '文件',
          type: 'f'
        }]
      }, {
        filingMode: '0',
        id: 1352286627968,
        leaf: false,
        name: '产品生产类',
        processInfo: true,
        showFlag: '0',
        storeMode: '1',
        storeType: 't',
        text: '产品生产类',
        type: 'p',
        children: [{
          archiveTypeId: 1352286627968,
          leaf: true,
          text: '项目',
          type: 'p'
        }, {
          archiveTypeId: 1352286627968,
          leaf: true,
          text: '案卷',
          type: 'v'
        }, {
          archiveTypeId: 1352286627968,
          leaf: true,
          text: '文件',
          type: 'f'
        }]
      }]
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
  addTree: config => {
    const { filingMode, name, type, storeMode } = JSON.parse(config.body)
    const id = Mock.mock('@id')
    const data = {
      id: id,
      name: name,
      text: name,
      type: type,
      storeMode: storeMode,
      storeType: 't',
      filingMode: filingMode,
      leaf: false
    }
    return {
      success: true,
      data: data
    }
  },
  editTree: config => {
    const { filingMode, name, type, storeMode, id } = JSON.parse(config.body)
    const data = {
      id: id,
      name: name,
      text: name,
      type: type,
      storeMode: storeMode,
      storeType: 't',
      filingMode: filingMode
    }
    return {
      success: true,
      data: data
    }
  },
  toSystem: () => ({
    success: true
  }),
  unSystem: () => ({
    success: true
  }),
  getCustomDefinedDetail: () => {
    return [
      {
        archiveNo: null,
        archiveTypeId: 1,
        form: 1,
        list: 1,
        module: 'base',
        moduleName: '公用',
        query: 1,
        report: 1,
        sort: 1,
        type: 'f',
        userId: '0'
      }
    ]
  },
  addCustomDefinedDetail: () => ({
    success: true
  }),
  deleteCustomDefinedDetail: () => ({
    success: true
  }),
  getCustomDefinedOption: () => {
    return [
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
  },
  apply: () => ({
    success: true
  })
}
