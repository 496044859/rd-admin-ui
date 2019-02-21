// import Mock from 'mockjs'

const DefineNames = []

const allNames = [
  {
    'fBmid': '',
    'fBz': '',
    'fCd': 0,
    'fCreateDate': '',
    'fCreateId': '',
    'fCreateTime': {},
    'fCxfs': '',
    'fDalxid': '4410a3fc82664194b538347b85bda789',
    'fDcbm': '',
    'fDclbm': '',
    'fDcpxh': 0,
    'fDqfs': 'R',
    'fId': '441',
    'fKd': 0,
    'fKdlb': 'f',
    'fMc': '年度',
    'fMldm': 'SF',
    'fModifyDate': '',
    'fModifyId': '',
    'fModifyTime': {},
    'fMrz': '',
    'fPxfs': 'A',
    'fPxh': 0,
    'fSfcxzd': true,
    'fSfdhzd': true,
    'fSffk': false,
    'fSfkdcfs': false,
    'fSfklr': false,
    'fSfkxg': true,
    'fSfkxqx': false,
    'fSflbzd': true,
    'fSflshzd': true,
    'fSfpxzd': true,
    'fSfwbyfs': false,
    'fSfxtzd': true,
    'fSfyc': false,
    'fSfythcxzd': true,
    'fSfyzy': false,
    'fSfzd': false,
    'fSjklm': 'YEAR_CODE',
    'fSjlx': 'c',
    'fSxmc': 'yearCode',
    'fZyl': 0,
    'pk': '441'
  }
]
export default {
  getAllNames: () => {
    return {
      success: true,
      message: '',
      data: allNames
    }
  },
  getDefineNames: () => {
    return {
      success: true,
      message: '',
      data: DefineNames
    }
  },
  save: () => {
    return {
      success: true
    }
  },
  applyDefine: () => {
    return {
      success: true,
      message: '',
      data: []
    }
  }
}
