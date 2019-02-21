import Mock from 'mockjs'

const treeData = [
  {
    id: '1',
    mc: '公共归档范围树',
    nd: '2001',
    children: [
      {
        'id': '123456789',
        'mc': '党群工作类',
        'nd': '2001',
        'flh': '123456',
        'dalxid': '1352286661109',
        'leaf': true
      }
    ]
  }
]
export default {
  getRangeYear: () => {
    return {
      success: true,
      message: '',
      data: [
        {
          nd: '2001'
        },
        {
          nd: '2002'
        },
        {
          nd: '2003'
        }
      ]
    }
  },
  getTree: () => {
    return {
      success: true,
      message: '',
      data: treeData
    }
  },
  getList: () => {
    return {
      success: true,
      data: {}
    }
  },
  create: () => {
    const id = Mock.mock('@id')
    const json = {
      id: id,
      mc: '全国人大'
    }
    return {
      success: true,
      data: json
    }
  },
  update: () => {
    return {
      success: true,
      data: []
    }
  },
  delete: config => {
    const { fId } = JSON.parse(config.body)
    const json = {
      ids: fId
    }
    return {
      success: true,
      data: json
    }
  },
  getRangeList: () => {
    return {
      success: true,
      data: [
        {
          'catalogueNo': '1',
          'fId': 1527756349437,
          'orderNo': 0,
          'retentionPeriod': '',
          'titleProper': '1'
        },
        {
          'catalogueNo': '2',
          'fId': 1527764895681,
          'orderNo': 1,
          'retentionPeriod': '8',
          'titleProper': '132'
        }
      ]
    }
  }
}
