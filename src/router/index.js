import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/views/layout/Layout'
const _import = require('./_import_' + process.env.NODE_ENV)

Vue.use(Router)

export const constantRouterMap = [
  { path: '/login', component: _import('login/login'), hidden: true },
  { path: '/ssoLogin', component: _import('login/ssoLogin'), hidden: true },
  { path: '/404', component: _import('errorPage/404'), hidden: true },
  { path: '/401', component: _import('errorPage/401'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: _import('dashboard/index'),
        name: 'dashboard',
        meta: { title: '首页', icon: 'icon-home3' }
      },
      {
        path: 'uploadPanel',
        component: _import('components/UploadPanel'),
        name: 'UploadPanel',
        meta: { title: '电子文件列表' },
        hidden: true
      },
      {
        path: 'borrowBus',
        component: _import('borrowBus/index'),
        name: 'BorrowBus',
        meta: { title: '借阅车' },
        hidden: true
      },
      {
        path: 'preview',
        component: _import('components/Preview'),
        name: 'Preview',
        meta: { title: '浏览' },
        hidden: true
      },
      {
        path: 'relation',
        component: _import('components/Relation'),
        name: 'Relation',
        meta: { title: '关联' },
        hidden: true
      }
    ]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/collection',
    component: Layout,
    name: 'Collection',
    redirect: 'noredirect',
    meta: {
      title: '档案收集',
      icon: 'icon-folder-plus'
    },
    children: [
      {
        path: 'filing',
        component: _import('modules/filing/index'),
        name: 'Filing',
        meta: { title: '整理归档' },
        children: [
          {
            path: 'filePanel',
            component: _import('modules/filing/components/ArchiveFilePanel'),
            name: 'Filing_ArchiveFilePanel',
            meta: { title: '整理归档文件层', noCache: true }
          },
          {
            path: 'folderPanel',
            component: _import(
              'modules/filing/components/ArchiveFolderPanel'
            ),
            name: 'Filing_ArchiveFolderPanel',
            meta: { title: '整理归档案卷层', noCache: true }
          },
          {
            path: 'folderFile',
            component: _import(
              'modules/filing/components/ArchiveFolderFile'
            ),
            name: 'Filing_ArchiveFolderFile',
            meta: { title: '整理归档卷内文件', noCache: true }
          },
          {
            path: 'unClassify',
            component: _import('modules/filing/components/UnClassify'),
            name: 'Filing_UnClassify',
            meta: { title: '待分类列表', noCache: true }
          }
        ]
      },
      {
        path: 'batchConnection',
        component: _import('modules/batchConnection/index'),
        name: 'BatchConnection',
        meta: { title: '数字化成果挂接' }
      },
      {
        path: 'dataImport',
        component: _import('modules/dataImport/index'),
        name: 'DataImport',
        meta: { title: '历史数据导入' }
      },
      {
        path: 'multimedia',
        component: _import('modules/multimedia/index'),
        name: 'Multimedia',
        meta: { title: '声像档案接收' }
      }
    ]
  },
  {
    path: '/archiveManagement',
    component: Layout,
    name: 'ArchiveManagement',
    redirect: 'noredirect',
    meta: {
      title: '档案管理',
      icon: 'icon-drawer'
    },
    children: [
      {
        path: 'archiveArrange',
        component: _import('modules/archiveArrange/index'),
        name: 'ArchiveArrange',
        meta: { title: '整理编目' },
        children: [
          {
            path: 'filePanel',
            component: _import(
              'modules/archiveArrange/components/ArchiveFilePanel'
            ),
            name: 'ArchiveArrange_ArchiveFilePanel',
            meta: { title: '文件层', noCache: true }
          },
          {
            path: 'folderPanel',
            component: _import(
              'modules/archiveArrange/components/ArchiveFolderPanel'
            ),
            name: 'ArchiveArrange_ArchiveFolderPanel',
            meta: { title: '案卷层', noCache: true }
          },
          {
            path: 'folderFile',
            component: _import(
              'modules/archiveArrange/components/ArchiveFolderFile'
            ),
            name: 'ArchiveArrange_ArchiveFolderFile',
            meta: { title: '卷内文件', noCache: true }
          }
        ]
      },
      {
        path: 'archiveDescription',
        component: _import('modules/archiveDescription/index'),
        name: 'ArchiveDescription',
        meta: { title: '档案维护' },
        children: [
          {
            path: 'filePanel',
            component: _import(
              'modules/archiveDescription/components/ArchiveFilePanel'
            ),
            name: 'ArchiveDescription_ArchiveFilePanel',
            meta: { title: '文件层', noCache: true }
          },
          {
            path: 'folderPanel',
            component: _import(
              'modules/archiveDescription/components/ArchiveFolder'
            ),
            name: 'ArchiveDescription_ArchiveFolder',
            meta: { title: '案卷层', noCache: true }
          },
          {
            path: 'folderFile',
            component: _import(
              'modules/archiveDescription/components/ArchiveFolderFile'
            ),
            name: 'ArchiveDescription_ArchiveFolderFile',
            meta: { title: '卷内文件', noCache: true }
          }
        ]
      },
      {
        path: 'handOver',
        component: _import('modules/handOver/index'),
        name: 'HandOver',
        meta: { title: '档案移交' },
        children: [
          {
            path: 'fileInside',
            component: _import(
              'modules/handOver/components/components/FileInside'
            ),
            name: 'HandOverFile',
            meta: { title: '文件层', noCache: true }
          },
          {
            path: 'folderInside',
            component: _import(
              'modules/handOver/components/components/FolderInside'
            ),
            name: 'HandOverFolder',
            meta: { title: '案卷层', noCache: true }
          },
          {
            path: 'folderFileInside',
            component: _import(
              'modules/handOver/components/components/FolderFileInside'
            ),
            name: 'HandOverFolderFileInside',
            meta: { title: '卷内文件层', noCache: true }
          }
        ]
      }
    ]
  },
  {
    path: '/archiveCheck',
    component: Layout,
    name: 'ArchiveCheck',
    redirect: 'noredirect',
    meta: {
      title: '档案审核',
      icon: 'icon-lock'
    },
    children: [
      {
        path: 'archivalCheck',
        component: _import('modules/archivalCheck/index'),
        name: 'ArchivalCheck',
        meta: { title: '收集审核' },
        children: [
          {
            path: 'folderPanel',
            component: _import('modules/archivalCheck/components/ArchivalCheckFolderPanel'),
            name: 'ArchivalCheck_Folder',
            meta: { title: '案卷层', noCache: true }
          },
          {
            path: 'filePanel',
            component: _import('modules/archivalCheck/components/ArchivalCheckFilePanel'),
            name: 'ArchivalCheck_File',
            meta: { title: '文件层', noCache: true }
          },
          {
            path: 'folderPanelFile',
            component: _import('modules/archivalCheck/components/ArchiveFolderList'),
            name: 'ArchivalCheck_FolderFile',
            meta: { title: '卷内文件', noCache: true }
          }
        ]
      },
      {
        path: 'deptReview',
        component: _import('modules/deptReview/index'),
        name: 'DeptReview',
        meta: { title: '部门审核' },
        children: [
          {
            path: 'fileList',
            component: _import('modules/deptReview/components/FileList'),
            name: 'DeptReviewFileList',
            meta: { title: '文件层', noCache: true }
          },
          {
            path: 'folderList',
            component: _import('modules/deptReview/components/FolderList'),
            name: 'DeptReviewFolderList',
            meta: { title: '案卷层', noCache: true }
          },
          {
            path: 'folderFileList',
            component: _import('modules/deptReview/components/FolderFileList'),
            name: 'DeptReviewFolderFileList',
            meta: { title: '卷内文件', noCache: true }
          }
        ]
      },
      {
        path: 'arrangeCheck',
        component: _import('modules/arrangeCheck/index'),
        name: 'ArrangeCheck',
        meta: { title: '归档审核' },
        children: [
          {
            path: 'fileList',
            component: _import('modules/arrangeCheck/components/FileList'),
            name: 'ArrangeCheckFileList',
            meta: { title: '文件层', noCache: true }
          },
          {
            path: 'folderList',
            component: _import('modules/arrangeCheck/components/FolderList'),
            name: 'ArrangeCheckFolderList',
            meta: { title: '案卷层', noCache: true }
          },
          {
            path: 'folderFileList',
            component: _import(
              'modules/arrangeCheck/components/FolderFileList'
            ),
            name: 'ArrangeCheckFolderFileList',
            meta: { title: '卷内文件', noCache: true }
          }
        ]
      }
    ]
  },
  {
    path: '/archiveSearch',
    component: Layout,
    name: 'ArchiveSearch',
    redirect: 'noredirect',
    meta: {
      title: '档案检索',
      icon: 'icon-search'
    },
    children: [
      {
        path: 'integrationSearch',
        component: _import('modules/integrationSearch/index'),
        name: 'IntegrationSearch',
        meta: { title: '一体化检索', Cache: true }
      },
      {
        path: 'customSearch',
        component: _import('modules/customSearch/index'),
        name: 'CustomSearch',
        meta: { title: '自定义检索' },
        children: [
          {
            path: 'CustomSearchFile',
            component: _import('modules/customSearch/components/CustomSearchFile'),
            name: 'CustomSearchFile',
            meta: {title: '文件层', Cache: true}
          },
          {
            path: 'customPreview',
            component: _import(
              'components/Preview'
            ),
            name: 'CustomSearch_Preview',
            meta: { title: '浏览', noCache: true }
          },
          {
            path: 'CustomSearchFolder',
            component: _import('modules/customSearch/components/CustomSearchFolder'),
            name: 'CustomSearchFolder',
            meta: {title: '案卷层', Cache: true}
          }
        ]
      },
      {
        path: 'classifySearch',
        component: _import('modules/classifySearch/index'),
        name: 'ClassifySearch',
        meta: { title: '档案分类检索' },
        children: [
          {
            path: 'documentLayer',
            component: _import('modules/classifySearch/components/DocumentLayer'),
            name: 'ClassifySearch_DocumentLayer',
            meta: { title: '文件层', Cache: true }
          },
          {
            path: 'searchPreview',
            component: _import(
              'components/Preview'
            ),
            name: 'ClassifySearch_Preview',
            meta: { title: '浏览', noCache: true }
          },
          {
            path: 'fileLayer',
            component: _import('modules/classifySearch/components/SearchFolderPanel'),
            name: 'ClassifySearch_SearchFolderPanel',
            meta: { title: '案卷层', Cache: true }
          }
        ]
      },
      {
        path: 'documentSearch',
        component: _import('modules/documentSearch/index'),
        name: 'DocumentSearch',
        meta: { title: '全文检索', Cache: true }
      }
    ]
  },
  {
    path: '/archiveUsing',
    component: Layout,
    name: 'ArchiveUsing',
    redirect: 'noredirect',
    meta: {
      title: '档案利用',
      icon: 'icon-google-drive'
    },
    children: [
      {
        path: 'myBorrow',
        component: _import('modules/myBorrow/index'),
        name: 'MyBorrow',
        meta: { title: '我的借阅信息' }
      },
      {
        path: 'borrowManage',
        component: _import('modules/borrowManage/index'),
        name: 'BorrowManage',
        meta: { title: '借阅管理' }
      },
      {
        path: 'entryDetail',
        component: _import('modules/borrowManage/components/entryDetail'),
        name: 'EntryDetail',
        meta: { title: '借阅明细', noCache: true },
        hidden: true
      }
    ]
  },
  {
    path: '/archiveJudge',
    component: Layout,
    name: 'ArchiveJudge',
    redirect: 'noredirect',
    meta: {
      title: '档案鉴定',
      icon: 'icon-pushpin'
    },
    children: [
      {
        path: 'judgeFlow',
        component: _import('modules/judgeFlow/index'),
        name: 'JudgeFlow',
        meta: { title: '档案鉴定', icon: 'icon-pushpin' }
      },
      {
        path: 'judgeSonList',
        component: _import('modules/judgeFlow/components/JudgeSonList'),
        name: 'JudgeSonList',
        meta: { title: '鉴定流程', noCache: true },
        hidden: true
      },
      // {
      //   path: 'judgeSonFile',
      //   component: _import('modules/judgeFlow/components/JudgeSonFile'),
      //   name: 'JudgeSonFile',
      //   meta: { title: '鉴定流程(文件)', noCache: true },
      //   hidden: true
      // },
      {
        path: 'judgeSonListFile',
        component: _import('modules/judgeFlow/components/JudgeSonListFile'),
        name: 'JudgeSonListFile',
        meta: { title: '案卷内文件', noCache: true },
        hidden: true
      }
    ]
  },
  {
    path: '/archiveStatistics',
    component: Layout,
    name: 'ArchiveStatistics',
    redirect: 'noredirect',
    meta: {
      title: '档案统计',
      icon: 'icon-pie-chart'
    },
    children: [
      {
        path: 'storageStatistic',
        component: _import('modules/storageStatistic/index'),
        name: 'StorageStatistic',
        meta: { title: '室藏情况统计' }
      },
      {
        path: 'receiveStatistic',
        component: _import('modules/receiveStatistic/index'),
        name: 'ReceiveStatistic',
        meta: { title: '档案接收统计' }
      },
      {
        path: 'usingStatistic',
        component: _import('modules/usingStatistic/index'),
        name: 'UsingStatistic',
        meta: { title: '利用情况统计' }
      },
      {
        path: 'judgeStatistic',
        component: _import('modules/judgeStatistic/index'),
        name: 'JudgeStatistic',
        meta: { title: '鉴定情况统计' }
      },
      {
        path: 'yearReportStatistic',
        component: _import('modules/yearReportStatistic/index'),
        name: 'YearReportStatistic',
        meta: { title: '年报统计' }
      },
      {
        path: 'customStatistic',
        component: _import('modules/customStatistic/index'),
        name: 'CustomStatistic',
        meta: { title: '自定义统计' }
      }
    ]
  },
  {
    path: '/archiveEdit',
    component: Layout,
    name: 'ArchiveEdit',
    redirect: 'noredirect',
    meta: {
      title: '档案编研',
      icon: 'icon-pencil'
    },
    children: [
      {
        path: 'editionLibrary',
        component: _import('modules/editionLibrary/index'),
        name: 'EditionLibrary',
        meta: { title: '编研库定义', Cache: true }
      },
      {
        path: 'editionMaterial',
        component: _import('modules/editionMaterial/index'),
        name: 'EditionMaterial',
        meta: { title: '素材库管理' }
      },
      {
        path: 'catalog',
        component: _import('modules/editionLibrary/Catalog'),
        name: 'Catalog',
        meta: { title: '编研目录', noCache: true },
        hidden: true
      },
      {
        path: 'onlineEdit',
        component: _import('modules/editionLibrary/OnlineEdit'),
        name: 'OnlineEdit',
        meta: { title: '在线编研', noCache: true },
        hidden: true
      },
      {
        path: 'editionArrange',
        component: _import('modules/editionLibrary/EditionArrange'),
        name: 'EditionArrange',
        meta: { title: '编研整理', noCache: true },
        hidden: true
      }
    ]
  },
  {
    path: '/systemManage',
    component: Layout,
    name: 'Manage',
    redirect: 'noredirect',
    meta: {
      title: '参数设置',
      icon: 'icon-cog'
    },
    children: [
      {
        path: 'userPermission',
        component: _import('modules/userPermission/index'),
        name: 'UserPermission',
        meta: { title: '用户权限管理' }
      },
      {
        path: 'medium',
        component: _import('modules/medium/index'),
        name: 'Medium',
        meta: { title: '光盘刻录' }
      },
      {
        path: 'recycleBin',
        component: _import('modules/recycleBin/index'),
        name: 'RecycleBin',
        meta: { title: '数据回收站' },
        children: [
          {
            path: 'recycleBinFile',
            component: _import('modules/recycleBin/components/RecycleBinFile'),
            name: 'RecycleBinFile',
            meta: { title: '文件列表', noCache: true }
          },
          {
            path: 'recycleBinFolder',
            component: _import('modules/recycleBin/components/RecycleBinFolder'),
            name: 'RecycleBinFolder',
            meta: { title: '案卷列表', noCache: true }
          },
          {
            path: 'recycleBinDoc',
            component: _import('modules/recycleBin/components/RecycleBinDoc'),
            name: 'RecycleBinDoc',
            meta: { title: '电子全文列表', noCache: true }
          }
        ]
      },
      {
        path: 'auditLog',
        component: _import('modules/auditLog/index'),
        name: 'AuditLog',
        meta: { title: '审计日志管理' }
      },
      {
        path: 'jzArchiveTreeDefine',
        component: _import('modules/jzArchiveTreeDefine/index'),
        name: 'JzArchiveTreeDefine',
        meta: { title: '兼职档案树维护' }
      }
    ]
  },
  {
    path: '/applicationDefine',
    component: Layout,
    name: 'ApplicationDefine',
    redirect: 'noredirect',
    meta: {
      title: '应用管理',
      icon: 'icon-stack'
    },
    children: [
      {
        path: 'fondsDept',
        component: _import('modules/fondsDept/index'),
        name: 'FondsDept',
        meta: { title: '全宗定义' }
      },
      {
        path: 'archiveTypeDefine',
        component: _import('modules/archiveTypeDefine/index'),
        name: 'ArchiveTypeDefine',
        meta: { title: '档案类型定义' }
      },
      {
        path: 'archiveRange',
        component: _import('modules/archiveRange/index'),
        name: 'ArchiveRange',
        meta: { title: '归档范围定义' }
      },
      {
        path: 'archiveTreeDefine',
        component: _import('modules/archiveTreeDefine/index'),
        name: 'ArchiveTreeDefine',
        meta: { title: '档案树定义' }
      },
      {
        path: 'appDefine',
        component: _import('modules/appDefine/index'),
        name: 'AppDefine',
        meta: { title: '应用定义' }
      },
      {
        path: 'reportDefine',
        component: _import('modules/reportDefine/index'),
        name: 'ReportDefine',
        meta: { title: '报表管理' }
      },
      {
        path: 'processManage',
        component: _import('modules/processManage/index'),
        name: 'ProcessManage',
        meta: { title: '流程管理' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]
