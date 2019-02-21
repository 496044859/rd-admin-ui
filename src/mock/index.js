import Mock from 'mockjs'
import loginAPI from './login'
import fondsDeptAPI from './fondsDept'
import propertyActionAPI from './propertyAction'
import metaDataAPI from './metaData'
import archiveTreeAPI from './archiveTreeDefine/archiveTree'
import archiveTreeBusinessAPI from './archiveTreeDefine/archiveTreeBusiness'
import archiveTreeViewAPI from './archiveTreeDefine/archiveTreeView'
import formDefineAPI from './appDefine/formDefine'
import queryDefineAPI from './appDefine/queryDefine'
import listDefineAPI from './appDefine/listDefine'
import sortDefineAPI from './appDefine/sortDefine'
import archiveNoDefineAPI from './appDefine/archiveNoDefine'
import assignedReportAPI from './appDefine/reportDefine'
import reportDefineAPI from './reportDefine'
import codingDefineAPI from './codingDefine'
import archiveTypeAPI from './archiveTypeDefine/archiveType'
import propertyAPI from './archiveTypeDefine/property'
import archiveComponentsAPI from './archiveComponents'
import syetemActionAPI from './systemAction'
import archiveRangeTypeApi from './archiveRange/archiveRangeType'
import archiveRangeApi from './archiveRange/archiveRange'
import documentAPI from './document'
import fileAPI from './file'
import folderAPI from './folder'
import batchConnectionAPI from './batchConnection'
import fillBoxAPI from './fillBox'
import mediumAPI from './medium'
import judgeAPI from './judge'
import jointDocApi from './jointDoc'
import storageStatisticAPI from './storageStatistic'
import handOverAPI from './handOver'
import borrowAPI from './borrow'
import borrowBusAPI from './borrowBus'
import integrativeQueryAPI from './integrativeQuery'
import archiveDescription from './archiveDescription'
import auditLog from './auditLog'
import customStatistic from './customStatistic'
import classifySearchAPI from './classifySearch'
import queryRepeatApi from './queryRepeat'
import archiveNoListDefineAPI from './archiveNoListDefine'

Mock.setup({
  timeout: '350-600'
})

// 登录相关
Mock.mock(/login@LoginAction.action/, 'post', loginAPI.loginByUsername)
Mock.mock(/\/login\/logout/, 'post', loginAPI.logout)
Mock.mock(/ssoLogin@LoginAction.action/, 'get', loginAPI.getUserInfo)

// 所有的档案类型
Mock.mock(/list@ArchiveTypeAction.action/, 'get', archiveTypeAPI.getArchiveTypes)

// 所有的分类类型
Mock.mock(/list@PropertyAction.action/, 'get', propertyActionAPI.getPropertyAll)

// 全宗定义
Mock.mock(/list@FondsCodeAction.action/, 'get', fondsDeptAPI.getList)
Mock.mock(/getFondsCodeByOrgId@FondsCodeAction.action/, 'get', fondsDeptAPI.getFondsCodeByOrgId)
Mock.mock(/add@FondsCodeAction.action/, 'post', fondsDeptAPI.create)
Mock.mock(/modify@FondsCodeAction.action/, 'post', fondsDeptAPI.update)
Mock.mock(/delete@FondsCodeAction.action/, 'post', fondsDeptAPI.delete)

// 归档范围定义
Mock.mock(/getDefineRangeYearData@ArchiveRangeTypeAction.action/, 'get', archiveRangeTypeApi.getRangeYear)
Mock.mock(/getDefineTree@ArchiveRangeTypeAction.action/, 'get', archiveRangeTypeApi.getTree)
Mock.mock(/add@ArchiveRangeTypeAction.action/, 'post', archiveRangeTypeApi.create)
Mock.mock(/modify@ArchiveRangeTypeAction.action/, 'post', archiveRangeTypeApi.update)
Mock.mock(/batchDelete@ArchiveRangeTypeAction.action/, 'post', archiveRangeTypeApi.delete)
Mock.mock(/query@ArchiveRangeAction.action/, 'get', archiveRangeApi.getList)
Mock.mock(/add@ArchiveRangeAction.action/, 'post', archiveRangeApi.create)
Mock.mock(/modify@ArchiveRangeAction.action/, 'post', archiveRangeApi.update)
Mock.mock(/batchDelete@ArchiveRangeAction.action/, 'post', archiveRangeApi.delete)
Mock.mock(/delete@ArchiveRangeTypeAction.action/, 'post', archiveRangeApi.delete)

// 档案树定义定义
Mock.mock(/getDefineTree@ArchiveTreeAction.action/, 'get', archiveTreeAPI.fetchTreeData)
Mock.mock(/add@ArchiveTreeAction.action/, 'post', archiveTreeAPI.create)
Mock.mock(/batchAdd@ArchiveTreeAction.action/, 'post', archiveTreeAPI.batchAdd)
Mock.mock(/modify@ArchiveTreeAction.action/, 'post', archiveTreeAPI.update)
Mock.mock(/batchDelete@ArchiveTreeAction.action/, 'post', archiveTreeAPI.delete)
Mock.mock(/listPropertyField@ArchiveTreeAction.action/, 'get', archiveTreeAPI.getListProperty)
Mock.mock(/listPropertyField1@ArchiveTreeAction.action/, 'get', archiveTreeAPI.getListProperty1)

// 档案数维护
Mock.mock(/getTreeWidthCheck@ArchiveTreeViewAction.action/, 'get', archiveTreeViewAPI.getTreeWidthCheck)
Mock.mock(/getViewJsonNew@ArchiveTreeViewAction.action/, 'get', archiveTreeViewAPI.getTree)

// 全文模板
Mock.mock(/listByNodeId@ArchiveTreeBusinessAction.action/, 'get', archiveTreeBusinessAPI.getList)
Mock.mock(/add@ArchiveTreeBusinessAction.action/, 'post', archiveTreeBusinessAPI.create)
Mock.mock(/modify@ArchiveTreeBusinessAction.action/, 'post', archiveTreeBusinessAPI.update)
Mock.mock(/delete@ArchiveTreeBusinessAction.action/, 'post', archiveTreeBusinessAPI.delete)
Mock.mock(/copy@ArchiveTreeBusinessAction.action/, 'post', archiveTreeBusinessAPI.copy)

// 编码定义
Mock.mock(/add@CodingAction.action/, 'post', codingDefineAPI.create)
Mock.mock(/modify@CodingAction.action/, 'post', codingDefineAPI.update)
Mock.mock(/listTree@CodingAction.action/, 'get', codingDefineAPI.getTree)
Mock.mock(/delete@CodingAction.action/, 'post', codingDefineAPI.delete)
Mock.mock(/list@BmAction.action/, 'get', codingDefineAPI.getCoding)
Mock.mock(/listAllItem@BmAction.action/, 'get', codingDefineAPI.getAllCoding)

// 档案类型定义
Mock.mock(/getDefineTree@ArchiveTypeAction.action/, 'get', archiveTypeAPI.getTree)
Mock.mock(/add@ArchiveTypeAction.action/, 'post', archiveTypeAPI.addTree)
Mock.mock(/modify@ArchiveTypeAction.action/, 'post', archiveTypeAPI.editTree)
Mock.mock(/delete@ArchiveTypeAction.action/, 'post', archiveTypeAPI.deleteTree)
Mock.mock(/findByType@ArchiveTypeAction.action/, 'get', archiveTypeAPI.findByType)
Mock.mock(/isArchiveInUse@ArchiveTypeAction.action/, 'get', archiveTypeAPI.isArchiveInUse)

Mock.mock(/list@TzhJgdaYsjdyAction.action/, 'get', propertyAPI.getList)
Mock.mock(/add@TzhJgdaYsjdyAction.action/, 'post', propertyAPI.create)
Mock.mock(/modify@TzhJgdaYsjdyAction.action/, 'post', propertyAPI.update)
Mock.mock(/delete@TzhJgdaYsjdyAction.action/, 'post', propertyAPI.delete)
Mock.mock(/apply@PropertyAction.action/, 'post', propertyAPI.apply)

Mock.mock(/\/archiveTypeDefine\/toSystem/, 'post', archiveTypeAPI.toSystem)
Mock.mock(/\/archiveTypeDefine\/unSystem/, 'post', archiveTypeAPI.unSystem)
Mock.mock(/getCustomDefinedDetail@ArchiveTypeAction.action/, 'get', archiveTypeAPI.getCustomDefinedDetail)
Mock.mock(/addCustomDefinedDetail@ArchiveTypeAction.action/, 'post', archiveTypeAPI.addCustomDefinedDetail)
Mock.mock(/deleteCustomDefinedDetail@ArchiveTypeAction.action/, 'post', archiveTypeAPI.deleteCustomDefinedDetail)
Mock.mock(/getCustomDefinedOption@ArchiveTypeAction.action/, 'get', archiveTypeAPI.getCustomDefinedOption)

// 元素据管理
Mock.mock(/queryPage@MetaDataAction.action/, 'get', metaDataAPI.getList)
Mock.mock(/add@MetaDataAction.action/, 'post', metaDataAPI.create)
Mock.mock(/modify@MetaDataAction.action/, 'post', metaDataAPI.update)
Mock.mock(/delete@MetaDataAction.action/, 'post', metaDataAPI.delete)

// 应用定义-表单定义
Mock.mock(/getJsonOfUnDefinedProperties@FormDefineAction.action/, 'get', formDefineAPI.getAllNames)
Mock.mock(/getJsonOfDefinedProperties@FormDefineAction.action/, 'get', formDefineAPI.getDefineNames)
Mock.mock(/get@FormDefineAction.action/, 'get', formDefineAPI.getConfig)
Mock.mock(/save@FormDefineAction.action/, 'post', formDefineAPI.save)
Mock.mock(/applyDefineTo@FormDefineAction.action/, 'post', formDefineAPI.applyDefine)

// 应用定义-检索定义
Mock.mock(/getJsonOfUnDefinedProperties@QueryDefineAction.action/, 'get', queryDefineAPI.getAllNames)
Mock.mock(/getJsonOfDefinedProperties@QueryDefineAction.action/, 'get', queryDefineAPI.getDefineNames)
Mock.mock(/save@QueryDefineAction.action/, 'post', queryDefineAPI.save)
Mock.mock(/applyDefineTo@FormDefineAction.action/, 'post', queryDefineAPI.applyDefine)

// 应用定义-列表定义
Mock.mock(/getJsonOfUnDefinedProperties@ListDefineAction.action/, 'get', listDefineAPI.getAllNames)
Mock.mock(/getJsonOfDefinedProperties@ListDefineAction.action/, 'get', listDefineAPI.getDefineNames)
Mock.mock(/save@ListDefineAction.action/, 'post', listDefineAPI.save)
Mock.mock(/applyDefineTo@ListDefineAction.action/, 'post', listDefineAPI.applyDefine)

// 应用定义-排序定义
Mock.mock(/getJsonOfUnDefinedProperties@SortDefineAction.action/, 'get', sortDefineAPI.getAllNames)
Mock.mock(/getJsonOfDefinedProperties@SortDefineAction.action/, 'get', sortDefineAPI.getDefineNames)
Mock.mock(/save@SortDefineAction.action/, 'post', sortDefineAPI.save)
Mock.mock(/applyDefineTo@SortDefineAction.action/, 'post', sortDefineAPI.applyDefine)

// 应用定义-档号定义
Mock.mock(/getAllArchiveNoList@ArchiveNoAction.action/, 'get', archiveNoDefineAPI.getAllArchiveNoList)
Mock.mock(/getAllArchiveNoArchiveDictList@ArchiveNoAction.action/, 'get', archiveNoDefineAPI.getAllArchiveNoArchiveDictList)
Mock.mock(/getAllArchiveDictList@ArchiveNoAction.action/, 'get', archiveNoDefineAPI.getAllArchiveDictList)
Mock.mock(/getAllFlowNoArchiveDictList@ArchiveNoAction.action/, 'get', archiveNoDefineAPI.getAllFlowNoArchiveDictList)
Mock.mock(/saveArchiveNoDefine@ArchiveNoAction.action/, 'post', archiveNoDefineAPI.saveArchiveNoDefine)
Mock.mock(/applyDefineTo@FormDefineAction.action/, 'post', formDefineAPI.applyDefine)
Mock.mock(/addOrModifyArchiveNo@ArchiveNoAction.action/, 'post', archiveNoDefineAPI.addOrModifyArchiveNo)
Mock.mock(/deleteArchiveNo@ArchiveNoAction.action/, 'post', archiveNoDefineAPI.deleteArchiveNo)

// 应用定义-挂接报表定义
Mock.mock(/listUnAssignedReport@ReportAction.action/, 'get', assignedReportAPI.getAllNames)
Mock.mock(/listAssignedReport@ReportAction.action/, 'get', assignedReportAPI.getDefineNames)
Mock.mock(/save@ReportAction.action/, 'post', assignedReportAPI.save)
Mock.mock(/applyDefineTo@ReportAction.action/, 'post', assignedReportAPI.applyDefine)

// 报表定义
Mock.mock(/getTree@ReportAction.action/, 'post', reportDefineAPI.getTree)
Mock.mock(/list@ReportAction.action/, 'post', reportDefineAPI.getList)
Mock.mock(/add@ReportAction.action/, 'post', reportDefineAPI.create)
Mock.mock(/defineReport@ReportAction.action/, 'post', reportDefineAPI.update)
Mock.mock(/delete@ReportAction.action/, 'post', reportDefineAPI.delete)
Mock.mock(/listAssignedReport@ReportAction.action/, 'get', reportDefineAPI.getListAssignedReport)
Mock.mock(/getReportDatas@ReportAction.action/, 'get', reportDefineAPI.getReportData)
Mock.mock(/generateReport@ BaseFolderAction.action/, 'get', reportDefineAPI.getRecords)
Mock.mock(/generateReport@BaseFileAction.action/, 'get', reportDefineAPI.getFile)

// 报表管理--报表挂接
Mock.mock(/listUnDefinedResource@ReportAction.action/, 'get', reportDefineAPI.unDefineHockList)
Mock.mock(/listDefinedResource@ReportAction.action/, 'get', reportDefineAPI.DefineHockList)
Mock.mock(/saveAssign@ReportAction.action/, 'post', reportDefineAPI.saveHockList)

// 报表管理--报表复制
Mock.mock(/getTreeByType@ReportAction.action/, 'post', reportDefineAPI.copySelectTo)
Mock.mock(/checkExist@ReportAction.action/, 'post', reportDefineAPI.copyCower)
Mock.mock(/copy@ReportAction.action/, 'post', reportDefineAPI.copyOk)
// 报表管理--文件上传
Mock.mock(/importReport@ReportAction.action/, 'post', reportDefineAPI.reportUpload)
// 报表管理--下载到本地
Mock.mock(/exportReport@ReportAction.action/, 'post', reportDefineAPI.downloadReport)
// 档案整理--档案著录
Mock.mock(/getPropsExclud@FileAction.action/, 'get', archiveDescription.getSelect)
Mock.mock(/batchModify@FileAction.action/, 'post', archiveDescription.postForm)
Mock.mock(/getCustomFormContent@ExcelExportDefineAction.action/, 'post', archiveDescription.getEssentialSelect)
Mock.mock(/getJsonOfUnDefinedProperties@ExcelExportDefineAction.action/, 'post', archiveDescription.getUnDefine)
Mock.mock(/getJsonOfDefinedProperties@ExcelExportDefineAction.action/, 'post', archiveDescription.getDefine)
Mock.mock(/save@ExcelExportDefineAction.action/, 'post', archiveDescription.saveDefien)
Mock.mock(/exportExcel@FileAction.action/, 'post', archiveDescription.downLoadExcel)
Mock.mock(/restore@ExcelExportDefineAction.action/, 'post', archiveDescription.setRecover)
// 前台通用模块相关
Mock.mock(/getQueryPropertyByType@ArchiveAction.action/, 'get', archiveComponentsAPI.getQueryPropertyByType)
Mock.mock(/syncOaData@CanConfigOaImportAction.action/, 'get', archiveComponentsAPI.OAUpdate)
Mock.mock(/getSeriesCode@ArchiveTreeViewAction.action/, 'get', archiveComponentsAPI.getSeriesCode)
Mock.mock(/apply@ReportAction.action/, 'get', archiveComponentsAPI.getSeriesCode)

// 系统配置
Mock.mock(/listFondsCode@SystemAction.action/, 'get', syetemActionAPI.getFondsCode)
Mock.mock(/listUsersByAuth@SystemAction.action/, 'get', syetemActionAPI.gethUsersByAuth)
Mock.mock(/listDeptsByAuth@SystemAction.action/, 'get', syetemActionAPI.getDeptsByAuth)
Mock.mock(/listSectionByAuth@SystemAction.action/, 'get', syetemActionAPI.getSectionByAuth)
Mock.mock(/listDepts@SystemAction.action/, 'get', syetemActionAPI.getDeptList)
Mock.mock(/getCustomDefinedDetail@SystemAction.action/, 'get', syetemActionAPI.getCustomDefinedDetail)
Mock.mock(/listDefineTree@SystemAction.action/, 'get', syetemActionAPI.getDefineTree)
Mock.mock(/getTreeWidthCheck@ArchiveTreeViewAction.action/, 'post', syetemActionAPI.getTreeWidthCheck)
Mock.mock(/listViews@ArchiveDataViewAction.action/, 'get', syetemActionAPI.listViews)
Mock.mock(/getResourceTree@SystemAction.action/, 'get', syetemActionAPI.getResourceTree)
Mock.mock(/getTreeViewChecked@ArchiveTreeViewAction.action/, 'get', syetemActionAPI.getTreeViewChecked)
Mock.mock(/add@ArchiveTreeViewAction.action/, 'post', syetemActionAPI.addArchiveTreeView)
Mock.mock(/modify@ArchiveTreeViewAction.action/, 'post', syetemActionAPI.modifyArchiveTreeView)
Mock.mock(/saveRoleAsign@ArchiveDataViewAction.action/, 'post', syetemActionAPI.saveDataDoc)

// 电子全文
Mock.mock(/query@DocumentAction.action/, 'get', documentAPI.getList)
Mock.mock(/delete@DocumentAction.action/, 'post', documentAPI.delete)
// 整理归档-excel导入(上接电子全文)
Mock.mock(/getAllArchiveNoArchiveDictList@ArchiveNoAction.action/, 'get', documentAPI.getAllArchiveNo)
Mock.mock(/getView@DataImportAction.action/, 'get', documentAPI.getTableList)

// 文件
Mock.mock(/queryPage@BaseFileAction.action/, 'get', fileAPI.getList)
Mock.mock(/add@BaseFileAction.action/, 'post', fileAPI.create)
Mock.mock(/modify@BaseFileAction.action/, 'post', fileAPI.a)
Mock.mock(/delete@BaseFileAction.action/, 'post', fileAPI.delete)
Mock.mock(/deptCheck@BaseFileAction.action/, 'post', fileAPI.deptCheck)
Mock.mock(/filing@BaseFileAction.action/, 'post', fileAPI.filing)
Mock.mock(/receive@BaseFileAction.action/, 'post', fileAPI.filing)
Mock.mock(/reject@BaseFileAction.action/, 'post', fileAPI.reject)
Mock.mock(/queryDeletedPage@BaseFileAction.action/, 'get', fileAPI.getBinList)
Mock.mock(/isDelParent@BaseFileAction.action/, 'get', fileAPI.isDelParent)
Mock.mock(/recover@BaseFileAction.action/, 'post', fileAPI.recover)
Mock.mock(/deleteForRever@BaseFileAction.action/, 'post', fileAPI.deleteForRever)
Mock.mock(/deleteAllForRever@BaseFileAction.action/, 'post', fileAPI.deleteAllForRever)
Mock.mock(/validateYj@BaseFileAction.action/, 'post', fileAPI.validateYj)
Mock.mock(/handOver@BaseFileAction.action/, 'post', fileAPI.handOver)
Mock.mock(/remove@BaseFileAction.action/, 'post', fileAPI.remove)
Mock.mock(/coding@BaseFileAction.action/, 'get', fileAPI.getCodingFile)

// 案卷
Mock.mock(/queryPage@BaseFolderAction.action/, 'get', folderAPI.getList)
Mock.mock(/add@BaseFolderAction.action/, 'post', folderAPI.create)
Mock.mock(/modify@BaseFolderAction.action/, 'post', folderAPI.update)
Mock.mock(/delete@BaseFolderAction.action/, 'post', folderAPI.delete)
Mock.mock(/deptCheck@BaseFolderAction.action/, 'post', folderAPI.deptCheck)
Mock.mock(/filing@BaseFolderAction.action/, 'post', folderAPI.filing)
Mock.mock(/receive@BaseFolderAction.action/, 'post', folderAPI.filing)
Mock.mock(/reject@BaseFolderAction.action/, 'post', folderAPI.reject)
Mock.mock(/takeApartVerify@BaseFolderAction.action/, 'get', folderAPI.takeApartVerify)
Mock.mock(/coding@BaseFolderAction.action/, 'get', folderAPI.getCodingFolder)

// 批量挂接
Mock.mock(/queryAttach@BatchAttachAction.action/, 'get', batchConnectionAPI.getAttach)
Mock.mock(/queryUnattach@BatchAttachAction.action/, 'get', batchConnectionAPI.getUnAttach)
Mock.mock(/add@BatchAttachAction.action/, 'post', batchConnectionAPI.delete)
Mock.mock(/attach@BatchAttachAction.action/, 'post', batchConnectionAPI.attach)

// 档案盒管理
Mock.mock(/pageList@BoxAction.action/, 'get', fillBoxAPI.getBoxList)
Mock.mock(/checkBoxNo@BoxAction.action/, 'post', fillBoxAPI.checkBoxNo)
Mock.mock(/add@BoxAction.action/, 'post', fillBoxAPI.create)
Mock.mock(/modify@BoxAction.action/, 'post', fillBoxAPI.update)
Mock.mock(/checkStored@BoxAction.action/, 'post', fillBoxAPI.checkStored)
Mock.mock(/delete@BoxAction.action/, 'post', fillBoxAPI.delete)

// 载体管理
Mock.mock(/listConditionPage@MediumAction.action/, 'get', mediumAPI.getList)
Mock.mock(/add@MediumAction.action/, 'post', mediumAPI.create)
Mock.mock(/deleteContinuingTransferAndMediumOrFile@ContinuingTransferAction.action/, 'post', mediumAPI.delete)
Mock.mock(/countFileSize@MediumAction.action/, 'get', mediumAPI.countFileSize)

// 档案鉴定
Mock.mock(/list@JudgeAction.action/, 'get', judgeAPI.getList)
Mock.mock(/add@JudgeAction.action/, 'post', judgeAPI.create)
Mock.mock(/modify@JudgeAction.action/, 'post', judgeAPI.update)
Mock.mock(/delete@JudgeAction.action/, 'post', judgeAPI.delete)
Mock.mock(/checkConfim@JudgeAction.action/, 'post', judgeAPI.checkConfim)
Mock.mock(/judgeConfim@JudgeAction.action/, 'post', judgeAPI.judgeConfim)
Mock.mock(/listItem@JudgeAction.action/, 'get', judgeAPI.getItemList)
Mock.mock(/addJudgeItems@judgeAction.action/, 'get', judgeAPI.addItemList)

// 流程
Mock.mock(/startProcessInstance@JointDocAction.action/, 'get', jointDocApi.startProcessInstance)
// 档案移交
Mock.mock(/queryPage@BaseFileAction.action/, 'get', fileAPI.fetchGridData)
Mock.mock(/queryPage@BaseFolderAction.action/, 'get', fileAPI.fetchGridDataV)
// 档案移交批次
Mock.mock(/query@HandOverAction.action/, 'get', handOverAPI.getHandOverList)

// 室藏统计
Mock.mock(/query@StorageStatisticAction.action/, 'get', storageStatisticAPI.getStatistic)

// 我的借阅信息
Mock.mock(/query@BorrowAction.action/, 'get', borrowAPI.getList)
Mock.mock(/saveBorrowInfo@BorrowAction.action/, 'post', borrowAPI.saveBorrowInfo)
Mock.mock(/BackBorrowInfo@BorrowAction.action/, 'post', borrowAPI.BackBorrowInfo)
Mock.mock(/queryDetail@BorrowAction.action/, 'get', borrowAPI.getDetailList)

// 借阅管理
Mock.mock(/delete@BorrowAction.action/, 'get', borrowAPI.deleteList)
Mock.mock(/get@BorrowAction.action/, 'get', borrowAPI.getRegister)
Mock.mock(/queryAsk@BorrowAction.action/, 'get', borrowAPI.getQuery)
Mock.mock(/queryBorrowDetail@BorrowAction.action/, 'get', borrowAPI.getRegisterList)
Mock.mock(/queryDetailByBorrowNo@BorrowAction.action/, 'get', borrowAPI.getEntryList)
Mock.mock(/queryDetailByBorrowId@BorrowAction.action/, 'get', borrowAPI.getEntryIdList)
Mock.mock(/entitiesReturn@BorrowAction.action/, 'post', borrowAPI.returenNice)

// 借阅车
Mock.mock(/queryList@BorrowBusAction.action/, 'get', borrowBusAPI.getList)
Mock.mock(/save@BorrowBusAction.action/, 'post', borrowBusAPI.save)
Mock.mock(/delete@BorrowBusAction.action/, 'post', borrowBusAPI.delete)

// 一体化检索
Mock.mock(/queryFromIndex@IntegrativeQueryAction.action/, 'get', integrativeQueryAPI.getList)
Mock.mock(/getGroupingDataFromIndex@IntegrativeQueryAction.action/, 'get', integrativeQueryAPI.getGroup)
Mock.mock(/addArchive@JudgeAction.action/, 'get', integrativeQueryAPI.addSearch)

// 档案分类检索
Mock.mock(/queryPage@ProjectAction.action/, 'get', classifySearchAPI.getList)

// 审计日志管理
Mock.mock(/queryAllLoginLogs@UserLogAction.action/, 'post', auditLog.queryLog)
Mock.mock(/exportLoginLogs@UserLogAction.action/, 'post', auditLog.downLoad)
Mock.mock(/queryAllOpLogs@UserLogAction.action/, 'post', auditLog.queryLogs)
Mock.mock(/queryOpData@UserLogAction.action/, 'get', auditLog.queryInfo)

// 自定义统计
Mock.mock(/queryPage@StatisticAction.action/, 'post', customStatistic.queryList)
Mock.mock(/getArchiveTypeTree@ArchiveTypeAction.action/, 'get', customStatistic.queryArchiveType)
Mock.mock(/listSystem@PropertyAction.action/, 'get', customStatistic.queryField)
Mock.mock(/del@StatisticAction.action/, 'post', customStatistic.delList)
// 自定义统计-上面是已定义，下面是未定义
Mock.mock(/getJsonOfPropertiesByIds@QueryDefineAction.action/, 'get', customStatistic.queryloakList)
Mock.mock(/getJsonOfPropertiesByType@QueryDefineAction.action/, 'get', customStatistic.queryNoloakList)
Mock.mock(/getFondsDepts@FondsDeptAction.action/, 'get', customStatistic.getFondsDepts)
Mock.mock(/saveStatConditions@StatisticAction.action/, 'post', customStatistic.saveLockList)

// 查重复
Mock.mock(/getJsonOfUnDefinedProperties@RepeatQueryDefineAction.action/, 'get', queryRepeatApi.getAllNames)

// 整理编目
Mock.mock(/query@ArchiveNoListDefineAction.action/, 'get', archiveNoListDefineAPI.getAllList)

export default Mock
