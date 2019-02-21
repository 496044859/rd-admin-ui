import { param2Obj } from '@/utils'

const userMap = {
  admin: {
    roles: 'admin',
    token: 'admin',
    introduction: '我是档案管理员',
    name: '档案管理员',
    fondsCode: '1377226592843',
    userdto: {
      userId: '1111',
      deptId: '11111',
      deptName: '1111'
    },
    menus: [
      {
        title: '档案收集',
        name: 'Collection',
        icon: 'icon-folder-plus',
        children: [
          {title: '整理归档', name: 'Filing', path: '/collection/filing'},
          {title: '数字化成果挂接', name: 'BatchConnection', path: '/collection/batchConnection'},
          {title: '历史数据导入', name: 'DataImport', path: '/collection/dataImport'},
          {title: '声像档案接收', name: 'Multimedia', path: '/collection/multimedia'}
        ]
      },
      {
        title: '档案管理',
        name: 'ArchiveManagement',
        icon: 'icon-drawer',
        children: [
          {title: '整理编目', name: 'ArchiveArrange', path: '/archiveManagement/archiveArrange'},
          {title: '档案维护', name: 'ArchiveDescription', path: '/archiveManagement/archiveDescription'},
          {title: '档案移交', name: 'HandOver', path: '/archiveManagement/handOver'}
        ]
      },
      {
        title: '档案审核',
        name: 'ArchiveCheck',
        icon: 'icon-lock',
        children: [
          {title: '收集审核', name: 'ArchivalCheck', path: '/archiveCheck/archivalCheck'},
          {title: '部门审核', name: 'DeptReview', path: '/archiveCheck/deptReview'},
          {title: '归档审核', name: 'ArrangeCheck', path: '/archiveCheck/arrangeCheck'}
        ]
      },
      {
        title: '档案检索',
        name: 'ArchiveSearch',
        icon: 'icon-search',
        children: [
          {title: '一体化检索', name: 'IntegrationSearch', path: '/archiveSearch/integrationSearch'},
          {title: '自定义检索', name: 'CustomSearch', path: '/archiveSearch/customSearch'},
          {title: '档案分类检索', name: 'ClassifySearch', path: '/archiveSearch/classifySearch'},
          {title: '全文检索', name: 'DocumentSearch', path: '/archiveSearch/documentSearch'}
        ]
      },
      {
        title: '档案利用',
        name: 'ArchiveUsing',
        icon: 'icon-google-drive',
        children: [
          {title: '我的借阅信息', name: 'MyBorrow', path: '/archiveUsing/myBorrow'},
          {title: '借阅管理', name: 'BorrowManage', path: '/archiveUsing/borrowManage'}
        ]
      },
      {
        title: '档案鉴定',
        name: 'ArchiveJudge',
        icon: 'icon-pushpin',
        children: [
          {title: '档案鉴定', name: 'JudgeFlow', path: '/archiveJudge/judgeFlow'}
        ]
      },
      {
        title: '档案统计',
        name: 'ArchiveStatistics',
        icon: 'icon-pie-chart',
        children: [
          {title: '室藏情况统计', name: 'StorageStatistic', path: '/archiveStatistics/storageStatistic'},
          {title: '档案接收统计', name: 'ReceiveStatistic', path: '/archiveStatistics/receiveStatistic'},
          {title: '利用情况统计', name: 'UsingStatistic', path: '/archiveStatistics/usingStatistic'},
          {title: '鉴定情况统计', name: 'JudgeStatistic', path: '/archiveStatistics/judgeStatistic'},
          {title: '年报统计', name: 'YearReportStatistic', path: '/archiveStatistics/yearReportStatistic'},
          {title: '自定义统计', name: 'CustomStatistic', path: '/archiveStatistics/customStatistic'}
        ]
      },
      {
        title: '档案编研',
        name: 'ArchiveEdit',
        icon: 'icon-pencil',
        children: [
          {title: '编研库定义', name: 'EditionLibrary', path: '/archiveEdit/editionLibrary'},
          {title: '素材库管理', name: 'EditionMaterial', path: '/archiveEdit/editionMaterial'}
        ]
      },
      {
        title: '系统管理',
        name: 'SystemManage',
        icon: 'icon-cog',
        children: [
          {title: '用户权限管理', name: 'UserPermission', path: '/systemManage/userPermission'},
          {title: '光盘刻录', name: 'Medium', path: '/systemManage/medium'},
          {title: '数据回收站', name: 'RecycleBin', path: '/systemManage/recycleBin'},
          {title: '审计日志管理', name: 'AuditLog', path: '/systemManage/auditLog'}
        ]
      },
      {
        title: '应用管理',
        name: 'ApplicationDefine',
        icon: 'icon-stack',
        children: [
          {title: '全宗定义', name: 'FondsDept', path: '/applicationDefine/fondsDept'},
          {title: '档案类型定义', name: 'ArchiveTypeDefine', path: '/applicationDefine/archiveTypeDefine'},
          {title: '归档范围定义', name: 'ArchiveRange', path: '/applicationDefine/archiveRange'},
          {title: '档案树定义', name: 'ArchiveTreeDefine', path: '/applicationDefine/archiveTreeDefine'},
          {title: '应用定义', name: 'AppDefine', path: '/applicationDefine/appDefine'},
          {title: '报表管理', name: 'ReportDefine', path: '/applicationDefine/reportDefine'},
          {title: '流程管理', name: 'ProcessManage', path: '/applicationDefine/processManage'}
        ]
      }
    ]
  }
}

export default {
  loginByUsername: () => {
    return {
      success: true,
      message: '',
      data: userMap['admin']
    }
  },
  getUserInfo: config => {
    const { token } = param2Obj(config.url)
    if (userMap[token]) {
      return {
        success: true,
        message: '',
        data: userMap['admin']
      }
    } else {
      return false
    }
  },
  logout: () => 'success'
}
