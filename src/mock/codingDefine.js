import { param2Obj } from '@/utils'

export default {
  getCoding: () => {
    return {
      'message': '',
      'data': [
        {
          'id': 'MEDIUM_STATUS',
          'orderNo': 1,
          'mc': '载体状态',
          'leaf': 'false'
        },
        {
          'id': 'STATUS',
          'orderNo': 2,
          'mc': '档案状态',
          'leaf': 'false'
        },
        {
          'id': 'RETENTION_PERIOD',
          'orderNo': 3,
          'mc': '保管期限',
          'leaf': 'false'
        },
        {
          'id': 'OPENING_TYPE',
          'orderNo': 4,
          'mc': '开放标识',
          'leaf': 'false'
        },
        {
          'id': 'USING_AIM',
          'orderNo': 5,
          'mc': '利用目的',
          'leaf': 'false'
        },
        {
          'id': 'F_LYXS',
          'orderNo': 6,
          'mc': '利用形式',
          'leaf': 'false'
        },
        {
          'id': 'USING_TYPE',
          'orderNo': 7,
          'mc': '利用方式',
          'leaf': 'false'
        },
        {
          'id': 'MANUSCRIPT_TYPE',
          'orderNo': 8,
          'mc': '稿本',
          'leaf': 'false'
        },
        {
          'id': 'MEDIUM_TYPE',
          'orderNo': 9,
          'mc': '载体类型',
          'leaf': 'false'
        },
        {
          'id': 'MEDIUM_FILE_TYPE',
          'orderNo': 10,
          'mc': '组盘文件形式',
          'leaf': 'false'
        },
        {
          'id': 'F_CZFS',
          'orderNo': 11,
          'mc': '处置方式',
          'leaf': 'false'
        }
      ],
      'success': true
    }
  },
  getTree: config => {
    const {nodeType, node} = param2Obj(config.url)
    let treeData = []
    if (nodeType === 'r') {
      treeData = [{
        id: 'SECURITY_CLASSIFICATION',
        text: '密级',
        system: false,
        name: '密级',
        leaf: false,
        orderNo: 0,
        remark: '',
        type: 'n'
      },
      {
        id: 'MEDIUM_STATUS',
        text: '载体状态',
        system: false,
        name: '载体状态',
        leaf: false,
        orderNo: 1,
        remark: '',
        type: 'n'
      },
      {
        id: 'RANGE_TEMPLATE',
        text: '工作模板',
        system: true,
        name: '工作模板',
        leaf: false,
        orderNo: 2,
        remark: '',
        type: 'n'
      }]
    } else if (nodeType === 'n' && node) {
      treeData = [{
        id: '1249614714484',
        text: '公开',
        codingId: null,
        name: '公开',
        leaf: true,
        orderNo: 0,
        remark: null,
        parent: null,
        n1: 1,
        value: '1',
        coding: {
          id: 'SECURITY_CLASSIFICATION',
          text: '密级',
          system: false,
          name: '密级',
          leaf: false,
          orderNo: 0,
          remark: '',
          type: 'n'
        }
      },
      {
        id: '1266917365328',
        text: '秘密',
        codingId: null,
        name: '秘密',
        leaf: true,
        orderNo: 0,
        remark: null,
        parent: null,
        n1: 4,
        value: '2',
        coding: {
          id: 'SECURITY_CLASSIFICATION',
          text: '密级',
          system: false,
          name: '密级',
          leaf: false,
          orderNo: 0,
          remark: '',
          type: 'n'
        }
      },
      {
        id: '1266917569625',
        text: '机密',
        codingId: null,
        name: '机密',
        leaf: true,
        orderNo: 0,
        remark: null,
        parent: null,
        n1: 5,
        value: '3',
        coding: {
          id: 'SECURITY_CLASSIFICATION',
          text: '密级',
          system: false,
          name: '密级',
          leaf: false,
          orderNo: 0,
          remark: '',
          type: 'n'
        }
      },
      {
        id: '1266917598781',
        text: '绝密',
        codingId: null,
        name: '绝密',
        leaf: true,
        orderNo: 0,
        remark: null,
        parent: null,
        n1: 6,
        value: '4',
        coding: {
          id: 'SECURITY_CLASSIFICATION',
          text: '密级',
          system: false,
          name: '密级',
          leaf: false,
          orderNo: 0,
          remark: '',
          type: 'n'
        }
      }]
    } else {
      treeData = []
    }
    return {
      success: true,
      message: '',
      data: treeData
    }
  },
  getAllCoding: () => {
    return {
      'message': '',
      'data': {
        'F_LYXS': [
          {
            'mc': '电子',
            'value': '1'
          },
          {
            'mc': '实体',
            'value': '2'
          }
        ],
        'F_CZFS': [
          {
            'mc': '续存',
            'value': '1'
          },
          {
            'mc': '移交',
            'value': '2'
          },
          {
            'mc': '销毁',
            'value': '3'
          }
        ],
        'MEDIUM_FILE_TYPE': [
          {
            'mc': '目录和全文格式',
            'value': '1'
          },
          {
            'mc': 'EEP格式',
            'value': '2'
          }
        ],
        'MEDIUM_TYPE': [
          {
            'mc': '1024M',
            'value': '1'
          },
          {
            'mc': '10240M',
            'value': '2'
          },
          {
            'mc': '102400M',
            'value': '3'
          },
          {
            'mc': '1024000M',
            'value': '4'
          },
          {
            'mc': '1024000M',
            'value': '5'
          }
        ],
        'USING_AIM': [
          {
            'mc': '学术研究',
            'value': '1'
          },
          {
            'mc': '编史修志',
            'value': '2'
          },
          {
            'mc': '工作考察',
            'value': '3'
          },
          {
            'mc': '宣传教育',
            'value': '4'
          },
          {
            'mc': '经济建设',
            'value': '5'
          },
          {
            'mc': '其他',
            'value': '6'
          }
        ],
        'MEDIUM_STATUS': [
          {
            'mc': '已组盘',
            'value': '1'
          },
          {
            'mc': '未组盘',
            'value': '0'
          }
        ],
        'RETENTION_PERIOD': [
          {
            'mc': '永久',
            'value': 'Y'
          },
          {
            'mc': '定期30年',
            'value': 'D30'
          },
          {
            'mc': '定期10年',
            'value': 'D10'
          }
        ],
        'MANUSCRIPT_TYPE': [
          {
            'mc': '修改稿',
            'value': '1'
          },
          {
            'mc': '底稿',
            'value': '2'
          },
          {
            'mc': '送审稿',
            'value': '3'
          },
          {
            'mc': '定稿',
            'value': '4'
          },
          {
            'mc': '发文稿',
            'value': '5'
          },
          {
            'mc': '公文处理单',
            'value': '6'
          },
          {
            'mc': '抄告稿',
            'value': '7'
          },
          {
            'mc': '领导批示',
            'value': '8'
          }
        ],
        'OPENING_TYPE': [
          {
            'mc': '公开',
            'value': '1'
          },
          {
            'mc': '限制公开',
            'value': '2'
          },
          {
            'mc': '不公开',
            'value': '3'
          }
        ],
        'STATUS': [
          {
            'mc': '待提交',
            'value': '1'
          },
          {
            'mc': '兼职档案员待审核',
            'value': '2'
          },
          {
            'mc': '兼职档案员审核不通过',
            'value': '4'
          },
          {
            'mc': '兼职档案员审核通过',
            'value': '3'
          },
          {
            'mc': '待归档',
            'value': '5'
          },
          {
            'mc': '部门待审核',
            'value': '6'
          },
          {
            'mc': '部门审核通过',
            'value': '7'
          },
          {
            'mc': '部门审核不通过',
            'value': '8'
          },
          {
            'mc': '专职档案员审核通过',
            'value': '10'
          },
          {
            'mc': '专职档案员待审核',
            'value': '9'
          },
          {
            'mc': '待整理',
            'value': '12'
          },
          {
            'mc': '专职档案员审核不通过',
            'value': '11'
          },
          {
            'mc': '已整理',
            'value': '13'
          },
          {
            'mc': '已移交',
            'value': '14'
          },
          {
            'mc': '已销毁',
            'value': '16'
          }
        ],
        'USING_TYPE': [
          {
            'mc': '浏览',
            'value': '1'
          },
          {
            'mc': '下载',
            'value': '2'
          },
          {
            'mc': '打印',
            'value': '3'
          },
          {
            'mc': '外借',
            'value': '4'
          },
          {
            'mc': '阅览',
            'value': '5'
          },
          {
            'mc': '复印',
            'value': '6'
          }
        ]
      },
      'success': true
    }
  }
}
