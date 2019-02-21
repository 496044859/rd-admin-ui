import Mock from 'mockjs'

export default {
  getList: () => {
    return {
      success: true,
      message: '',
      data: [
        {
          'lmbh': '1',
          'id': '1527756349437',
          'pxzd': 0,
          'bgqx': 'Y',
          'gdfw': '1',
          'czfaId': '8',
          'gdfwflid': 'e558f1b7a64f84f51',
          'createDate': null,
          'createId': null,
          'czfs': null
        }
      ]
    }
  },
  create: config => {
    const { fLmbh, fPxzd, fBgqx, fGdfw } = JSON.parse(config.body)
    const fId = Mock.mock('@id')
    const json = {
      fLmbh: fLmbh,
      fPxzd: fPxzd,
      fBgqx: fBgqx,
      fGdfw: fGdfw,
      fId: fId,
      fGdfwflid: null
    }
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
