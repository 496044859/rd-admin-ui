import Mock from 'mockjs'

export default {
  getList: () => {
    return {
      success: true,
      message: '',
      data: [
        {
          id: 312132123123,
          catalogueNo: '0001',
          titleProper: '测试模板1'
        },
        {
          id: 312132123124,
          catalogueNo: '0002',
          titleProper: '测试模板2'
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
  },
  copy: () => {
    return {
      success: true,
      data: {}
    }
  }
}
