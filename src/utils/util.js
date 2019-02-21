const FondsDeptType = {
  /**
   * 全宗
   */
  FONDSCODE: 'f',
  /**
   * 部门
   */
  DEPARTMENT: 'd',
  /**
   * 处室
   */
  SECTION: 's'
}
/**
 * 数据类型
 *
 * @type {}
 */
const DataType = {
  /**
   * 字符型
   *
   * @type {String}
   */
  CHAR: 'c',
  /**
   * 数字型
   *
   * @type {String}
   */
  NUMBER: 'n',
  /**
   * 货币型
   *
   * @type {String}
   */
  MONEY: 'h',
  /**
   * 编码型
   *
   * @type {String}
   */
  CODING: 'm',
  /**
   * 树形编码型
   *
   * @type {String}
   */
  TREE_CODING: 't',
  /**
   * 布尔型
   *
   * @type {String}
   */
  BOOL: 'b',
  /**
   * 日期型
   *
   * @type {String}
   */
  DATE: 'd',
  /**
   * 部门型
   *
   * @type {String}
   */
  DEPT: 'p',
  /**
   * 用户型
   *
   * @type {String}
   */
  USER: 'u',
  /**
   * 全宗型
   *
   * @type{String}
   */
  FONDS: 'f',
  /**
   * 年度型
   *
   * @type{String}
   */
  YEAR: 'y'
}

// 档案状态
const Status = {
  /**
   * 初始
   */
  INIT: '10',
  /**
   * 已发布
   */
  PUBlISHED: '20',
  /**
   * 已收集
   */
  COLLECTED: '3',
  /**
   * 档案管理员退回（兼职档案管理员处）
   */
  ARCMANARETURN: '31',
  /**
   * 已退回
   */
  // RETURNED: '40',
  /**
   * 待审核
   */
  RECHECK: '40',
  /**
   * 部门审核通过
   */
  PASSCHECK: '41',
  /**
   * 部门审核未通过
   */
  FAILCHECK: '42',
  /**
   * 业务待审核
   */
  ARCRECHECK: '45',
  /**
   * 业务审核不通过
   */
  ARCFAILCHECK: '46',
  /**
   * 档案管理员退回（业务档案管理员处）
   */
  ARCRETURN: '47',
  /**
   * 已归档
   */
  FILLED: '50',
  /**
   * 档案接收未通过
   */
  FAILRECEIVING: '51',
  /**
   * 领导待审核
   */
  LEADRECHECK: '65',
  /**
   * 领导审核通过
   */
  PASSLEADRECHECK: '66',
  /**
   * 领导审核不通过
   */
  LEADFAILCHECK: '67',
  /**
   * 已接收
   */
  RECEIVED: '60',
  /**
   * 已整理
   */
  SETTLED: '80',
  /**
   * 已销毁
   */
  DESTROIED: '00'
}

// 数据类型编码表
const dataTypeMap = {
  'c': '字符型',
  'm': '编码型',
  'p': '部门型',
  'u': '用户型',
  'n': '数字型',
  'b': '布尔型',
  'd': '日期型',
  'y': '年度型'
}

// 借阅单状态
const BorrowStatus = {
  /**
   * 未审批
   */
  APPROVE_NO: '0',
  /**
   * 已审批
   */
  APPROVE_YES: '1',
  /**
   * 移交审批中
   */
  HAND_APPROVE: '2',
  /**
   * 已办结
   */
  APPROVE_FINISHED: '3',
  /**
   * 续借申请中
   */
  AGAIN_APPLY: '4',
  /**
   * 流程处理中
   */
  IN_PROCESS: '9',
  /**
   * 预约中
   */
  CONVENTION: '5',
  /**
   * 被退回
   */
  BACK_APPROVE: '6'
}

const viewUrl = process.env.BASE_DOC
const webSocketUrl = process.env.BASE_SOCKET

export default {
  FondsDeptType,
  DataType,
  dataTypeMap,
  Status,
  BorrowStatus,
  viewUrl,
  webSocketUrl
}
