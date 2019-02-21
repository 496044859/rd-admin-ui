import Mock from 'mockjs'

export default {
  getList: () => {
    return {
      success: true,
      message: '',
      data: [
        {
          qzh: 'rd',
          id: '1377226592843',
          mc: '全国人大档案',
          qzjj: '人大'
        }
      ]
    }
  },
  create: () => {
    const json = Mock.mock({
      id: '@id'
    })
    return {
      success: true,
      data: json,
      message: ''
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
  },
  getFondsCodeByOrgId: () => {
    return {
      success: true,
      message: '',
      data: [
        {
          code: 'CES',
          fondsCodeId: '1377226592843',
          id: '1377226592843',
          isDelete: false,
          name: '全国人大档案',
          orderNo: 1,
          orgId: '105',
          orgName: '',
          remark: '默认全宗',
          shortName: '中信',
          text: '全国人大档案',
          type: 'f'
        },
        {
          code: '办公室',
          fondsCodeId: '1524210653883',
          id: '1524232800083',
          isDelete: false,
          name: '测试全宗',
          orderNo: 2,
          icon: '',
          leaf: 'true',
          orgId: '105',
          orgName: '',
          remark: null,
          shortName: '产权',
          text: '测试全宗',
          type: 'f'
        }
      ]
    }
  }
}
