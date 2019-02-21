import Mock from 'mockjs'
import { param2Obj } from '@/utils'

const List = []
const count = 100
const List2 = []

for (let i = 0; i < 10; i++) {
  List.push(Mock.mock({
    id: i + 1,
    fMc: '目录中心报表',
    fDalxid: '文书档案',
    fKdlb: '通用',
    counterpartReportType: '文书档案',
    fBblx: '通用',
    fSjylx: '通用',
    designPerson: '档案管理员',
    designTime: '@date'
  }))
}

for (let i = 0; i < count; i++) {
  List2.push(Mock.mock(['@natural(1, 100)', '档案管理员', '1-1-1-1', '题名测试', '@date', '1', '备注']))
}

export default {
  getList: () => {
    return {
      success: true,
      message: '',
      data: List
    }
  },
  getTree: () => {
    return {
      success: true,
      message: '',
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
        fKdlb: 'f',
        children: [{
          fDalxid: 1,
          leaf: true,
          text: '文件',
          fKdlb: 'f'
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
        fKdlb: 'f', // 库的类别
        children: [{
          fDalxid: 1352286661109, // 档案类型ID
          leaf: true,
          text: '文件',
          fKdlb: 'f' // 档案类型类型
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
        fKdlb: 'v',
        children: [{
          fDalxid: 1352286676703,
          leaf: true,
          text: '案卷',
          fKdlb: 'v'
        }, {
          fDalxid: 1352286676703,
          leaf: true,
          text: '文件',
          fKdlb: 'f'
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
        fKdlb: 'p',
        children: [{
          fDalxid: 1352286627968,
          leaf: true,
          text: '项目',
          fKdlb: 'p'
        }, {
          fDalxid: 1352286627968,
          leaf: true,
          text: '案卷',
          fKdlb: 'v'
        }, {
          fDalxid: 1352286627968,
          leaf: true,
          text: '文件',
          fKdlb: 'f'
        }]
      }]
    }
  },
  create: () => {
    const id = Mock.mock('@id')
    return {
      success: true,
      data: {
        id: id
      }
    }
  },
  update: () => ({
    success: true,
    data: {}
  }),
  delete: () => ({
    success: true,
    data: {}
  }),
  reportUpload: () => ({
    success: true,
    data: {}
  }),
  copySelectTo: () => ({
    success: true,
    data: [
      {
        filingMode: '0',
        fDalxid: 1352286641921,
        leaf: true,
        name: '会计凭证档案',
        orderNo: 11,
        processInfo: true,
        remark: '',
        retentionPeriod: '',
        showFlag: '0',
        storeMode: '1',
        storeType: 't',
        text: '会计凭证档案',
        fKdlb: 'f'
      },
      {
        filingMode: '0',
        fDalxid: 1352286657937,
        leaf: true,
        name: '会计账簿档案',
        orderNo: 12,
        processInfo: true,
        remark: '',
        retentionPeriod: '',
        showFlag: '',
        storeMode: '',
        storeType: 't',
        text: '会计账簿档案',
        fKdlb: 'f'
      },
      {
        filingMode: '0',
        fDalxid: 1352286632968,
        leaf: true,
        name: '会计其他档案',
        orderNo: 14,
        processInfo: true,
        remark: '',
        retentionPeriod: '',
        showFlag: '',
        storeMode: '',
        storeType: 't',
        text: '会计其他档案',
        fKdlb: 'f'
      },
      {
        filingMode: '0',
        fDalxid: 1352286668078,
        leaf: true,
        name: '实物类',
        orderNo: 18,
        processInfo: true,
        remark: '',
        retentionPeriod: '',
        showFlag: '0',
        storeMode: '1',
        storeType: 't',
        text: '实物类',
        fKdlb: 'f'
      },
      {
        filingMode: '0',
        fDalxid: 2,
        leaf: true,
        name: '资料类',
        orderNo: 19,
        processInfo: true,
        remark: '',
        retentionPeriod: '',
        showFlag: '1',
        storeMode: '',
        storeType: 't',
        text: '资料类',
        fKdlb: 'f'
      },
      {
        filingMode: '0',
        fDalxid: 1352286690218,
        leaf: true,
        name: '电子档案',
        orderNo: 20,
        processInfo: true,
        remark: '',
        retentionPeriod: '',
        showFlag: '0',
        storeMode: '1',
        storeType: 't',
        text: '电子档案',
        fKdlb: 'f'
      },
      {
        filingMode: '0',
        fDalxid: 1532676782221,
        leaf: true,
        name: '我的111',
        orderNo: 21,
        processInfo: true,
        remark: '',
        retentionPeriod: '',
        showFlag: '0',
        storeMode: '2',
        storeType: 't',
        text: '我的111',
        fKdlb: 'f'
      },
      {
        filingMode: '0',
        fDalxid: 1535005847427,
        leaf: true,
        name: '文书档案复111',
        orderNo: 23,
        processInfo: true,
        remark: '',
        retentionPeriod: '1213247015492,1277886688234,1213246999128',
        showFlag: '',
        storeMode: '',
        storeType: 't',
        text: '文书档案复111',
        fKdlb: 'f'
      }
    ]
  }),
  copyAdjust: () => ({
    match: false,
    success: true
  }),
  downloadReport: () => ({
    success: true
  }),
  copyCower: () => ({
    success: true,
    exist: 'true',
    showPosition: 'f'
  }),
  copyOk: () => ({
    success: true,
    data: {}
  }),
  unDefineHockList: () => {
    return {
      success: true,
      data: [
        {
          children: [],
          id: 'DC',
          img: 'BuMenShenHe.png',
          isShow: '',
          name: '部门审核',
          orderNo: '',
          parentId: '',
          report: true,
          source: "new gdda.archive.MainPanel('DC')",
          sourceFile: 'm-archive.jsp',
          text: '部门审核'
        },
        {
          children: [],
          id: 'MQ',
          img: 'ZiLiaoJianSuo.png',
          isShow: '',
          name: '资料检索',
          orderNo: '',
          parentId: '',
          report: true,
          source: 'new gdda.collect.MainQueryPanel()',
          sourceFile: 'm-collect.jsp',
          text: '资料检索'
        },
        {
          children: [],
          id: 'DD',
          img: 'ShuJuWeiHu.png',
          isShow: '',
          name: '数据维护',
          orderNo: '',
          parentId: '',
          report: true,
          source: "new gdda.archive.common.DataMaintainPanel('DD')",
          sourceFile: 'm-archive.jsp',
          text: '数据维护'
        },
        {
          children: [],
          id: 'DE',
          img: 'ShuJuDaoChu.png',
          isShow: '',
          name: '数据导出',
          orderNo: '',
          parentId: '',
          report: true,
          source: 'new gdda.archive.common.DataExportFramePanel()',
          sourceFile: 'm-archive.jsp',
          text: '数据导出'
        },
        {
          children: [],
          id: 'OLS',
          img: 'DangAnZhengLi.png',
          isShow: '',
          name: '在线数据采集',
          orderNo: '',
          parentId: '',
          report: true,
          source: 'new gdda.storage.OnLineScanMainPanel()',
          sourceFile: 'm-storage.jsp',
          text: '在线数据采集'
        },
        {
          children: [],
          id: 'NB',
          img: 'NianBaoTongJi.png',
          isShow: '',
          name: '年报统计',
          orderNo: '',
          parentId: '',
          report: true,
          source: 'new gdda.archive.YearReportPanel()',
          sourceFile: 'm-yearReport.jsp',
          text: '年报统计'
        },
        {
          children: [],
          id: 'YJ',
          img: 'YiJiaoJinGuan.png',
          isShow: '',
          name: '档案移交',
          orderNo: '',
          parentId: '',
          report: true,
          source: 'new gdda.archive.HandOverMainPanel()',
          sourceFile: 'm-archive.jsp',
          text: '档案移交'
        }
      ]
    }
  },
  DefineHockList: () => {
    return {
      success: true,
      data: [
        {
          children: [],
          id: 'AR',
          img: 'DangAnJieShou.png',
          isShow: '',
          name: '档案接收',
          orderNo: '',
          parentId: '',
          report: true,
          source: "new gdda.archive.MainPanel('AR')",
          sourceFile: 'm-archive.jsp',
          text: '档案接收'
        },
        {
          chchildren: [],
          id: 'AS',
          img: 'DangAnZhengLi.png',
          isShow: '',
          name: '档案整理',
          orderNo: '',
          parentId: '',
          report: true,
          source: "new gdda.archive.MainPanel('AS')",
          sourceFile: 'm-archive.jsp',
          text: '档案整理'
        },
        {
          children: [],
          id: 'CP',
          img: 'BianMuDaYin.png',
          isShow: '',
          name: '编目打印',
          orderNo: '',
          parentId: '',
          report: true,
          source: 'new gdda.report.CatalogPrintPanel()',
          sourceFile: 'm-report.jsp',
          text: '编目打印'
        },
        {
          children: [],
          id: 'NB',
          img: 'NianBaoTongJi.png',
          isShow: '',
          name: '年报统计',
          orderNo: '',
          parentId: '',
          report: true,
          source: 'new gdda.archive.YearReportPanel()',
          sourceFile: 'm-yearReport.jsp',
          text: '年报统计'
        },
        {
          children: [],
          id: 'DD',
          img: 'ShuJuWeiHu.png',
          isShow: '',
          name: '数据维护',
          orderNo: '',
          parentId: '',
          report: true,
          source: "new gdda.archive.common.DataMaintainPanel('DD')",
          sourceFile: 'm-archive.jsp',
          text: '数据维护'
        },
        {
          children: [],
          id: 'DE',
          img: 'ShuJuDaoChu.png',
          isShow: '',
          name: '数据导出',
          orderNo: '',
          parentId: '',
          report: true,
          source: 'new gdda.archive.common.DataExportFramePanel()',
          sourceFile: 'm-archive.jsp',
          text: '数据导出'
        },
        {
          children: [],
          id: 'OLS',
          img: 'DangAnZhengLi.png',
          isShow: '',
          name: '在线数据采集',
          orderNo: '',
          parentId: '',
          report: true,
          source: 'new gdda.storage.OnLineScanMainPanel()',
          sourceFile: 'm-storage.jsp',
          text: '在线数据采集'
        },
        {
          children: [],
          id: 'NB',
          img: 'NianBaoTongJi.png',
          isShow: '',
          name: '年报统计',
          orderNo: '',
          parentId: '',
          report: true,
          source: 'new gdda.archive.YearReportPanel()',
          sourceFile: 'm-yearReport.jsp',
          text: '年报统计'
        },
        {
          children: [],
          id: 'YJ',
          img: 'YiJiaoJinGuan.png',
          isShow: '',
          name: '档案移交',
          orderNo: '',
          parentId: '',
          report: true,
          source: 'new gdda.archive.HandOverMainPanel()',
          sourceFile: 'm-archive.jsp',
          text: '档案移交'
        }
      ]
    }
  },
  saveHockList: () => ({
    success: true,
    data: {}
  }),
  getFileList: () => ({
    success: true,
    data: [{'name': '0001测试'}, {'name': '0002测试'}, {'name': '001'}, {'name': '002'}, {'name': '003'}, {'name': '003测试'}, {'name': '123'}, {'name': 'aaaa'}, {'name': 'text'}]
  }),
  getListAssignedReport: () => ({
    success: true,
    data: [
      {
        id: 1352286661798,
        name: '归档文件封面',
        cllUrl: '1352286661798.cll'
      },
      {
        id: 1352286661829,
        name: '归档文件目录',
        cllUrl: '1352286661829.cll'
      },
      {
        id: 1352286661843,
        name: '归档接收签证单',
        cllUrl: '1352286661843.cll'
      },
      {
        id: 1352286661830,
        name: '备考表',
        cllUrl: '1352286661830.cll'
      }
    ]
  }),
  getReportData: config => {
    const { page = 1, limit = 20 } = param2Obj(config.url)
    let mockList = List2
    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
    return {
      success: true,
      data: {
        'datas': pageList,
        'totalRecordCount': mockList.length,
        'positions': [
          {
            'columnNo': '1',
            'name': 'ITEM_NO',
            'type': 'f',
            'rowNo': '4'
          },
          {
            'columnNo': '2',
            'name': 'AUTHOR',
            'type': 'f',
            'rowNo': '4'
          },
          {
            'columnNo': '3',
            'name': 'FILE_CODE',
            'type': 'f',
            'rowNo': '4'
          },
          {
            'columnNo': '4',
            'name': 'TITLE_PROPER',
            'type': 'f',
            'rowNo': '4'
          },
          {
            'columnNo': '5',
            'name': 'DATE_OF_CREATION',
            'type': 'f',
            'rowNo': '4'
          },
          {
            'columnNo': '6',
            'name': 'AMOUNT_OF_PAGES',
            'type': 'f',
            'rowNo': '4'
          },
          {
            'columnNo': '7',
            'name': 'REMARKS',
            'type': 'f',
            'rowNo': '4'
          },
          {
            'name': 'OFFICE_ARCHIVAL_CODE',
            'columnNo': '-3',
            'type': 'f',
            'rowNo': '-3'
          }
        ],
        'v': '',
        'totalPageCount': 1,
        'col': '',
        'cellMap': {},
        'report': {
          'id': 1352286661829,
          'name': '归档文件目录',
          'reportType': '1',
          'fileUrl': '/gdda/common/Report.jsp',
          'cllUrl': '1352286661829.cll',
          'dataSql': null,
          'archiveTypeId': 1352286661109,
          'type': 'f',
          'dataType': 's',
          'header': '1:1',
          'tail': null,
          'cycle': '4:4',
          'groupField': null,
          'designPerson': '档案管理员',
          'designTime': '2012-04-12',
          'remark': null,
          'orderNo': 3,
          'reportAttachModule': null,
          'showPosition': 'f',
          'replaceData': {},
          'mixCellDatas': [],
          'printArchiveTypes': null,
          'endPrint': null
        },
        'row': ''
      }
    }
  }

}
