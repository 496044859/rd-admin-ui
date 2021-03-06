import Mock from 'mockjs'
import { param2Obj } from '@/utils'

const count = 100
const List = []

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    'reject': false,
    'fileCode': '@integer(300, 5000)',
    'status|1': ['30', '41', '66'],
    'yearCode': '@date("yyyy")',
    'fondsCode': '1524210653883',
    'type': 'f',
    'deleted': false,
    'dateOfCreation': '@date',
    'officeArchivalCode': '2.01-2015-30年-0002',
    'isModifyByRejected': null,
    'combined': false,
    'id': '@integer(300, 5000)',
    'author': '@cname',
    'retentionPeriod': '8',
    'caseNo': null,
    'titleProper': '@ctitle(5, 10)',
    'itemCount': 0,
    'archiveTypeId': 1352286661109
  }))
}

const queryPropertyByTypeList = [
  {
    'align': 'C',
    'archiveNo': false,
    'archiveType': {
      'filingMode': '0',
      'id': 1352286661109,
      'leaf': true,
      'name': '文书档案',
      'orderNo': 1,
      'processInfo': true,
      'remark': '',
      'retentionPeriod': '',
      'showFlag': '0',
      'storeMode': '1',
      'storeType': 't',
      'text': '文书档案',
      'type': 'f'
    },
    'codingId': 'RETENTION_PERIOD',
    'colspan': 1,
    'columnName': 'RETENTION_PERIOD',
    'dataItemPermissions': true,
    'dataLength': 100,
    'dataType': 'm',
    'defaultValue': '',
    'empty': false,
    'export': true,
    'exportColumnName': 'RETENTION_PERIOD',
    'exportName': '保管期限0',
    'exportOrderNo': 9,
    'flowNo': false,
    'hidden': false,
    'id': 1352286661151,
    'inheritFolder': false,
    'inheritLast': false,
    'inheritProject': false,
    'input': true,
    'list': true,
    'name': '保管期限',
    'noempty': false,
    'orderNo': 7,
    'primaryKey': false,
    'propertyName': 'retentionPeriod',
    'query': true,
    'queryType': '=',
    'readonly': false,
    'remark': '',
    'retrieveFlag': false,
    'sort': true,
    'sortType': 'A',
    'system': true,
    'textArea': false,
    'type': 'f',
    'update': true,
    'used': true,
    'width': 80
  },
  {
    'align': 'C',
    'archiveNo': false,
    'archiveType': {
      'filingMode': '0',
      'id': 1352286661109,
      'leaf': true,
      'name': '文书档案',
      'orderNo': 1,
      'processInfo': true,
      'remark': '',
      'retentionPeriod': '',
      'showFlag': '0',
      'storeMode': '1',
      'storeType': 't',
      'text': '文书档案',
      'type': 'f'
    },
    'codingId': 'SECURITY_CLASSIFICATION',
    'colspan': 1,
    'columnName': 'SECURITY_CLASSIFICATION',
    'dataItemPermissions': true,
    'dataLength': 100,
    'dataType': 'm',
    'defaultValue': '',
    'empty': false,
    'export': true,
    'exportColumnName': 'SECURITY_CLASSIFICATION',
    'exportName': '密级',
    'exportOrderNo': 16,
    'flowNo': false,
    'hidden': false,
    'id': 1352286661166,
    'inheritFolder': false,
    'inheritLast': false,
    'inheritProject': false,
    'input': true,
    'list': true,
    'name': '密级',
    'noempty': false,
    'orderNo': 8,
    'primaryKey': false,
    'propertyName': 'securityClassification',
    'query': true,
    'queryType': '=',
    'readonly': false,
    'remark': '',
    'retrieveFlag': true,
    'sort': true,
    'sortType': 'A',
    'system': true,
    'textArea': false,
    'type': 'f',
    'update': true,
    'used': true,
    'width': 80
  },
  {
    'align': 'C',
    'archiveNo': false,
    'archiveType': {
      'filingMode': '0',
      'id': 1352286661109,
      'leaf': true,
      'name': '文书档案',
      'orderNo': 1,
      'processInfo': true,
      'remark': '',
      'retentionPeriod': '',
      'showFlag': '0',
      'storeMode': '1',
      'storeType': 't',
      'text': '文书档案',
      'type': 'f'
    },
    'codingId': '',
    'colspan': 1,
    'columnName': 'AUTHOR',
    'dataItemPermissions': true,
    'dataLength': 200,
    'dataType': 'c',
    'defaultValue': '',
    'empty': false,
    'export': true,
    'exportColumnName': 'AUTHOR',
    'exportName': '责任者',
    'exportOrderNo': 53,
    'flowNo': false,
    'hidden': false,
    'id': 1352286661152,
    'inheritFolder': false,
    'inheritLast': false,
    'inheritProject': false,
    'input': true,
    'list': true,
    'name': '责任者',
    'noempty': false,
    'orderNo': 12,
    'primaryKey': false,
    'propertyName': 'author',
    'query': true,
    'queryType': 'like',
    'readonly': false,
    'remark': '',
    'retrieveFlag': true,
    'sort': true,
    'sortType': 'A',
    'system': true,
    'textArea': false,
    'type': 'f',
    'update': true,
    'used': true,
    'width': 80
  },
  {
    'align': 'C',
    'archiveNo': false,
    'archiveType': {
      'filingMode': '0',
      'id': 1352286661109,
      'leaf': true,
      'name': '文书档案',
      'orderNo': 1,
      'processInfo': true,
      'remark': '',
      'retentionPeriod': '',
      'showFlag': '0',
      'storeMode': '1',
      'storeType': 't',
      'text': '文书档案',
      'type': 'f'
    },
    'codingId': '',
    'colspan': 1,
    'columnName': 'FONDS_CODE',
    'dataItemPermissions': true,
    'dataLength': 100,
    'dataType': 'f',
    'defaultValue': '',
    'empty': false,
    'export': true,
    'exportColumnName': 'FONDS_CODE',
    'exportName': '全宗',
    'exportOrderNo': 56,
    'flowNo': false,
    'hidden': false,
    'id': 1352286661168,
    'inheritFolder': false,
    'inheritLast': false,
    'inheritProject': false,
    'input': true,
    'list': true,
    'name': '全宗',
    'noempty': false,
    'orderNo': 15,
    'primaryKey': false,
    'propertyName': 'fondsCode',
    'query': true,
    'queryType': '=',
    'readonly': false,
    'remark': '',
    'retrieveFlag': false,
    'sort': true,
    'sortType': 'A',
    'system': true,
    'textArea': false,
    'type': 'f',
    'update': true,
    'used': true,
    'width': 80
  },
  {
    'align': 'C',
    'archiveNo': false,
    'archiveType': {
      'filingMode': '0',
      'id': 1352286661109,
      'leaf': true,
      'name': '文书档案',
      'orderNo': 1,
      'processInfo': true,
      'remark': '',
      'retentionPeriod': '',
      'showFlag': '0',
      'storeMode': '1',
      'storeType': 't',
      'text': '文书档案',
      'type': 'f'
    },
    'codingId': '',
    'colspan': 1,
    'columnName': 'CATALOGUE_NAME',
    'dataItemPermissions': true,
    'dataLength': 200,
    'dataType': 'c',
    'defaultValue': '',
    'empty': false,
    'export': true,
    'exportColumnName': 'CATALOGUE_NAME',
    'exportName': '类目名称',
    'exportOrderNo': 58,
    'flowNo': false,
    'hidden': false,
    'id': 1352286661116,
    'inheritFolder': false,
    'inheritLast': false,
    'inheritProject': false,
    'input': false,
    'list': true,
    'name': '类目名称',
    'noempty': false,
    'orderNo': 18,
    'primaryKey': false,
    'propertyName': 'catalogueName',
    'query': true,
    'queryType': 'like',
    'readonly': false,
    'remark': '',
    'retrieveFlag': true,
    'sort': true,
    'sortType': 'A',
    'system': true,
    'textArea': false,
    'type': 'f',
    'update': true,
    'used': true,
    'width': 80
  },
  {
    'align': 'C',
    'archiveNo': false,
    'archiveType': {
      'filingMode': '0',
      'id': 1352286661109,
      'leaf': true,
      'name': '文书档案',
      'orderNo': 1,
      'processInfo': true,
      'remark': '',
      'retentionPeriod': '',
      'showFlag': '0',
      'storeMode': '1',
      'storeType': 't',
      'text': '文书档案',
      'type': 'f'
    },
    'codingId': '',
    'colspan': 1,
    'columnName': 'SERIES_CODE',
    'dataItemPermissions': true,
    'dataLength': 100,
    'dataType': 'c',
    'defaultValue': '',
    'empty': false,
    'export': true,
    'exportColumnName': 'SERIES_CODE',
    'exportName': '分类号',
    'exportOrderNo': 59,
    'flowNo': false,
    'hidden': false,
    'id': 1352286661137,
    'inheritFolder': false,
    'inheritLast': false,
    'inheritProject': false,
    'input': true,
    'list': true,
    'name': '分类号',
    'noempty': false,
    'orderNo': 19,
    'primaryKey': false,
    'propertyName': 'seriesCode',
    'query': true,
    'queryType': 'like',
    'readonly': false,
    'remark': '',
    'retrieveFlag': true,
    'sort': true,
    'sortType': 'A',
    'system': true,
    'textArea': false,
    'type': 'f',
    'update': true,
    'used': true,
    'width': 80
  },
  {
    'align': 'C',
    'archiveNo': false,
    'archiveType': {
      'filingMode': '0',
      'id': 1352286661109,
      'leaf': true,
      'name': '文书档案',
      'orderNo': 1,
      'processInfo': true,
      'remark': '',
      'retentionPeriod': '',
      'showFlag': '0',
      'storeMode': '1',
      'storeType': 't',
      'text': '文书档案',
      'type': 'f'
    },
    'codingId': '',
    'colspan': 1,
    'columnName': 'YEAR_CODE',
    'dataItemPermissions': true,
    'dataLength': 4,
    'dataType': 'n',
    'defaultValue': '',
    'empty': false,
    'export': true,
    'exportColumnName': 'YEAR_CODE',
    'exportName': '年度',
    'exportOrderNo': 61,
    'flowNo': false,
    'hidden': false,
    'id': 1352286661136,
    'inheritFolder': false,
    'inheritLast': false,
    'inheritProject': false,
    'input': true,
    'list': true,
    'name': '年度',
    'noempty': false,
    'orderNo': 21,
    'primaryKey': false,
    'propertyName': 'yearCode',
    'query': true,
    'queryType': '=',
    'readonly': false,
    'remark': '',
    'retrieveFlag': true,
    'sort': true,
    'sortType': 'A',
    'system': true,
    'textArea': false,
    'type': 'f',
    'update': true,
    'used': true,
    'width': 80
  },
  {
    'align': 'C',
    'archiveNo': false,
    'archiveType': {
      'filingMode': '0',
      'id': 1352286661109,
      'leaf': true,
      'name': '文书档案',
      'orderNo': 1,
      'processInfo': true,
      'remark': '',
      'retentionPeriod': '',
      'showFlag': '0',
      'storeMode': '1',
      'storeType': 't',
      'text': '文书档案',
      'type': 'f'
    },
    'codingId': '',
    'colspan': 1,
    'columnName': 'STORAGE_PLACE',
    'dataItemPermissions': true,
    'dataLength': 200,
    'dataType': 'c',
    'defaultValue': '',
    'empty': false,
    'export': true,
    'exportColumnName': 'STORAGE_PLACE',
    'exportName': '档案存址',
    'exportOrderNo': 65,
    'flowNo': false,
    'hidden': false,
    'id': 1352286661182,
    'inheritFolder': false,
    'inheritLast': false,
    'inheritProject': false,
    'input': false,
    'list': true,
    'name': '档案存址',
    'noempty': false,
    'orderNo': 23,
    'primaryKey': false,
    'propertyName': 'storagePlace',
    'query': true,
    'queryType': 'like',
    'readonly': false,
    'remark': '',
    'retrieveFlag': true,
    'sort': true,
    'sortType': 'A',
    'system': true,
    'textArea': false,
    'type': 'f',
    'update': false,
    'used': true,
    'width': 80
  },
  {
    'align': 'C',
    'archiveNo': true,
    'archiveType': {
      'filingMode': '0',
      'id': 1352286661109,
      'leaf': true,
      'name': '文书档案',
      'orderNo': 1,
      'processInfo': true,
      'remark': '',
      'retentionPeriod': '',
      'showFlag': '0',
      'storeMode': '1',
      'storeType': 't',
      'text': '文书档案',
      'type': 'f'
    },
    'codingId': '',
    'colspan': 1,
    'columnName': 'OFFICE_ARCHIVAL_CODE',
    'dataItemPermissions': true,
    'dataLength': 200,
    'dataType': 'c',
    'defaultValue': '',
    'empty': false,
    'export': true,
    'exportColumnName': 'OFFICE_ARCHIVAL_CODE',
    'exportName': '室编档号',
    'exportOrderNo': 72,
    'flowNo': false,
    'hidden': false,
    'id': 1352286661189,
    'inheritFolder': false,
    'inheritLast': false,
    'inheritProject': false,
    'input': true,
    'list': true,
    'name': '室编档号',
    'noempty': false,
    'orderNo': 26,
    'primaryKey': false,
    'propertyName': 'officeArchivalCode',
    'query': true,
    'queryType': 'like',
    'readonly': false,
    'remark': '',
    'retrieveFlag': true,
    'sort': true,
    'sortType': 'A',
    'system': true,
    'textArea': false,
    'type': 'f',
    'update': true,
    'used': true,
    'width': 80
  },
  {
    'align': 'C',
    'archiveNo': false,
    'archiveType': {
      'filingMode': '0',
      'id': 1352286661109,
      'leaf': true,
      'name': '文书档案',
      'orderNo': 1,
      'processInfo': true,
      'remark': '',
      'retentionPeriod': '',
      'showFlag': '0',
      'storeMode': '1',
      'storeType': 't',
      'text': '文书档案',
      'type': 'f'
    },
    'codingId': '',
    'colspan': 1,
    'columnName': 'CASE_NO',
    'dataItemPermissions': true,
    'dataLength': 100,
    'dataType': 'c',
    'defaultValue': '',
    'empty': false,
    'export': true,
    'exportColumnName': 'CASE_NO',
    'exportName': '盒号',
    'exportOrderNo': 74,
    'flowNo': false,
    'hidden': false,
    'id': 1352286661158,
    'inheritFolder': false,
    'inheritLast': false,
    'inheritProject': false,
    'input': true,
    'list': true,
    'name': '盒号',
    'noempty': false,
    'orderNo': 28,
    'primaryKey': false,
    'propertyName': 'caseNo',
    'query': true,
    'queryType': 'like',
    'readonly': false,
    'remark': '',
    'retrieveFlag': true,
    'sort': true,
    'sortType': 'A',
    'system': true,
    'textArea': false,
    'type': 'f',
    'update': true,
    'used': true,
    'width': 80
  },
  {
    'align': 'C',
    'archiveNo': false,
    'archiveType': {
      'filingMode': '0',
      'id': 1352286661109,
      'leaf': true,
      'name': '文书档案',
      'orderNo': 1,
      'processInfo': true,
      'remark': '',
      'retentionPeriod': '',
      'showFlag': '0',
      'storeMode': '1',
      'storeType': 't',
      'text': '文书档案',
      'type': 'f'
    },
    'codingId': '',
    'colspan': 1,
    'columnName': 'DATE_OF_CREATION',
    'dataItemPermissions': true,
    'dataLength': 20,
    'dataType': 'd',
    'defaultValue': '',
    'empty': false,
    'export': true,
    'exportColumnName': 'DATE_OF_CREATION',
    'exportName': '文件日期',
    'exportOrderNo': 80,
    'flowNo': false,
    'hidden': false,
    'id': 1352286661184,
    'inheritFolder': false,
    'inheritLast': false,
    'inheritProject': false,
    'input': true,
    'list': true,
    'name': '文件日期',
    'noempty': false,
    'orderNo': 31,
    'primaryKey': false,
    'propertyName': 'dateOfCreation',
    'query': true,
    'queryType': '=',
    'readonly': false,
    'remark': '',
    'retrieveFlag': false,
    'sort': true,
    'sortType': 'A',
    'system': true,
    'textArea': false,
    'type': 'f',
    'update': true,
    'used': true,
    'width': 80
  },
  {
    'align': 'C',
    'archiveNo': false,
    'archiveType': {
      'filingMode': '0',
      'id': 1352286661109,
      'leaf': true,
      'name': '文书档案',
      'orderNo': 1,
      'processInfo': true,
      'remark': '',
      'retentionPeriod': '',
      'showFlag': '0',
      'storeMode': '1',
      'storeType': 't',
      'text': '文书档案',
      'type': 'f'
    },
    'codingId': '',
    'colspan': 1,
    'columnName': 'FILE_CODE',
    'dataItemPermissions': true,
    'dataLength': 100,
    'dataType': 'c',
    'defaultValue': '',
    'empty': false,
    'export': true,
    'exportColumnName': 'FILE_CODE',
    'exportName': '文号',
    'exportOrderNo': 83,
    'flowNo': false,
    'hidden': false,
    'id': 1352286661144,
    'inheritFolder': false,
    'inheritLast': false,
    'inheritProject': false,
    'input': true,
    'list': true,
    'name': '文号',
    'noempty': false,
    'orderNo': 36,
    'primaryKey': false,
    'propertyName': 'fileCode',
    'query': true,
    'queryType': 'like',
    'readonly': false,
    'remark': '',
    'retrieveFlag': true,
    'sort': true,
    'sortType': 'A',
    'system': true,
    'textArea': false,
    'type': 'f',
    'update': true,
    'used': true,
    'width': 80
  },
  {
    'align': 'C',
    'archiveNo': false,
    'archiveType': {
      'filingMode': '0',
      'id': 1352286661109,
      'leaf': true,
      'name': '文书档案',
      'orderNo': 1,
      'processInfo': true,
      'remark': '',
      'retentionPeriod': '',
      'showFlag': '0',
      'storeMode': '1',
      'storeType': 't',
      'text': '文书档案',
      'type': 'f'
    },
    'codingId': '',
    'colspan': 1,
    'columnName': 'FILING_DEPT',
    'dataItemPermissions': true,
    'dataLength': 100,
    'dataType': 'p',
    'defaultValue': '',
    'empty': false,
    'export': true,
    'exportColumnName': 'FILING_DEPT',
    'exportName': '归档部门',
    'exportOrderNo': 87,
    'flowNo': false,
    'hidden': false,
    'id': 1352286661143,
    'inheritFolder': false,
    'inheritLast': false,
    'inheritProject': false,
    'input': true,
    'list': true,
    'name': '归档部门',
    'noempty': false,
    'orderNo': 39,
    'primaryKey': false,
    'propertyName': 'filingDept',
    'query': true,
    'queryType': '=',
    'readonly': false,
    'remark': '',
    'retrieveFlag': false,
    'sort': true,
    'sortType': 'A',
    'system': true,
    'textArea': false,
    'type': 'f',
    'update': true,
    'used': true,
    'width': 80
  },
  {
    'align': 'L',
    'archiveNo': false,
    'archiveType': {
      'filingMode': '0',
      'id': 1352286661109,
      'leaf': true,
      'name': '文书档案',
      'orderNo': 1,
      'processInfo': true,
      'remark': '',
      'retentionPeriod': '',
      'showFlag': '0',
      'storeMode': '1',
      'storeType': 't',
      'text': '文书档案',
      'type': 'f'
    },
    'codingId': '',
    'colspan': 1,
    'columnName': 'DESCRIPTOR',
    'dataItemPermissions': true,
    'dataLength': 200,
    'dataType': 'c',
    'defaultValue': '',
    'empty': false,
    'export': true,
    'exportColumnName': 'DESCRIPTOR',
    'exportName': '主题词',
    'exportOrderNo': 92,
    'flowNo': false,
    'hidden': false,
    'id': 1352286661190,
    'inheritFolder': false,
    'inheritLast': false,
    'inheritProject': false,
    'input': true,
    'list': true,
    'name': '主题词',
    'noempty': false,
    'orderNo': 42,
    'primaryKey': false,
    'propertyName': 'descriptor',
    'query': true,
    'queryType': 'like',
    'readonly': false,
    'remark': '',
    'retrieveFlag': true,
    'sort': true,
    'sortType': 'A',
    'system': true,
    'textArea': false,
    'type': 'f',
    'update': true,
    'used': true,
    'width': 80
  },
  {
    'align': 'L',
    'archiveNo': false,
    'archiveType': {
      'filingMode': '0',
      'id': 1352286661109,
      'leaf': true,
      'name': '文书档案',
      'orderNo': 1,
      'processInfo': true,
      'remark': '',
      'retentionPeriod': '',
      'showFlag': '0',
      'storeMode': '1',
      'storeType': 't',
      'text': '文书档案',
      'type': 'f'
    },
    'codingId': '',
    'colspan': 1,
    'columnName': 'TITLE_PROPER',
    'dataItemPermissions': true,
    'dataLength': 200,
    'dataType': 'c',
    'defaultValue': '',
    'empty': false,
    'export': true,
    'exportColumnName': 'TITLE_PROPER',
    'exportName': '题名',
    'exportOrderNo': 7,
    'flowNo': false,
    'hidden': false,
    'id': 1352286661124,
    'inheritFolder': false,
    'inheritLast': false,
    'inheritProject': false,
    'input': true,
    'list': true,
    'name': '正题名',
    'noempty': false,
    'orderNo': 67,
    'primaryKey': false,
    'propertyName': 'titleProper',
    'query': true,
    'queryType': 'like',
    'readonly': false,
    'remark': '',
    'retrieveFlag': true,
    'sort': true,
    'sortType': 'A',
    'system': true,
    'textArea': false,
    'type': 'f',
    'update': true,
    'used': true,
    'width': 80
  },
  {
    'align': 'C',
    'archiveNo': false,
    'archiveType': {
      'filingMode': '0',
      'id': 1352286661109,
      'leaf': true,
      'name': '文书档案',
      'orderNo': 1,
      'processInfo': true,
      'remark': '',
      'retentionPeriod': '',
      'showFlag': '0',
      'storeMode': '1',
      'storeType': 't',
      'text': '文书档案',
      'type': 'f'
    },
    'codingId': '',
    'colspan': 1,
    'columnName': 'COLLECTION_TYPE_TAG',
    'dataItemPermissions': true,
    'dataLength': 2000,
    'dataType': 'c',
    'defaultValue': '',
    'empty': false,
    'export': true,
    'exportColumnName': 'COLLECTION_TYPE_TAG',
    'exportName': '对应资料树节点表TAG',
    'exportOrderNo': 86,
    'flowNo': false,
    'hidden': false,
    'id': 1352286661174,
    'inheritFolder': false,
    'inheritLast': false,
    'inheritProject': false,
    'input': true,
    'list': true,
    'name': '对应资料树节点表TAG',
    'noempty': false,
    'orderNo': 86,
    'primaryKey': false,
    'propertyName': 'collectionTypeTag',
    'query': true,
    'queryType': 'like',
    'readonly': false,
    'remark': '',
    'retrieveFlag': true,
    'sort': true,
    'sortType': 'A',
    'system': true,
    'textArea': false,
    'type': 'f',
    'update': true,
    'used': true,
    'width': 80
  },
  {
    'align': 'L',
    'archiveNo': false,
    'archiveType': {
      'filingMode': '0',
      'id': 1352286661109,
      'leaf': true,
      'name': '文书档案',
      'orderNo': 1,
      'processInfo': true,
      'remark': '',
      'retentionPeriod': '',
      'showFlag': '0',
      'storeMode': '1',
      'storeType': 't',
      'text': '文书档案',
      'type': 'f'
    },
    'codingId': '',
    'colspan': 1,
    'columnName': 'FILING_USER',
    'dataItemPermissions': true,
    'dataLength': 100,
    'dataType': 'u',
    'defaultValue': '',
    'empty': false,
    'export': true,
    'exportColumnName': 'FILING_USER',
    'exportName': '归档人',
    'exportOrderNo': 1,
    'flowNo': false,
    'hidden': false,
    'id': 1352286661160,
    'inheritFolder': false,
    'inheritLast': false,
    'inheritProject': false,
    'input': true,
    'list': true,
    'name': '归档人',
    'noempty': false,
    'orderNo': 133,
    'primaryKey': false,
    'propertyName': 'filingUser',
    'query': true,
    'queryType': '=',
    'readonly': false,
    'remark': '',
    'retrieveFlag': false,
    'sort': true,
    'sortType': 'A',
    'system': true,
    'textArea': false,
    'type': 'f',
    'update': true,
    'used': true,
    'width': 80
  },
  {
    'align': 'C',
    'archiveNo': false,
    'archiveType': {
      'filingMode': '0',
      'id': 1352286661109,
      'leaf': true,
      'name': '文书档案',
      'orderNo': 1,
      'processInfo': true,
      'remark': '',
      'retentionPeriod': '',
      'showFlag': '0',
      'storeMode': '1',
      'storeType': 't',
      'text': '文书档案',
      'type': 'f'
    },
    'codingId': '',
    'colspan': 1,
    'columnName': 'REMARKS',
    'dataItemPermissions': true,
    'dataLength': 500,
    'dataType': 'c',
    'defaultValue': '',
    'empty': false,
    'export': true,
    'exportColumnName': 'REMARKS',
    'exportName': '备注',
    'exportOrderNo': 1300,
    'flowNo': false,
    'hidden': false,
    'id': 1352286661130,
    'inheritFolder': false,
    'inheritLast': false,
    'inheritProject': false,
    'input': true,
    'list': true,
    'name': '备注',
    'noempty': false,
    'orderNo': 1300,
    'primaryKey': false,
    'propertyName': 'remarks',
    'query': true,
    'queryType': 'like',
    'readonly': false,
    'remark': '',
    'retrieveFlag': true,
    'sort': false,
    'sortType': 'A',
    'system': true,
    'textArea': false,
    'type': 'f',
    'update': true,
    'used': true,
    'width': 80
  },
  {
    'align': 'L',
    'archiveNo': false,
    'archiveType': {
      'filingMode': '0',
      'id': 1352286661109,
      'leaf': true,
      'name': '文书档案',
      'orderNo': 1,
      'processInfo': true,
      'remark': '',
      'retentionPeriod': '',
      'showFlag': '0',
      'storeMode': '1',
      'storeType': 't',
      'text': '文书档案',
      'type': 'f'
    },
    'codingId': '',
    'colspan': 1,
    'columnName': 'TAG',
    'dataItemPermissions': true,
    'dataLength': 1000,
    'dataType': 'c',
    'defaultValue': '',
    'empty': false,
    'export': true,
    'exportColumnName': 'TAG',
    'exportName': '新全宗',
    'exportOrderNo': 66,
    'flowNo': false,
    'hidden': false,
    'id': 1352286661178,
    'inheritFolder': false,
    'inheritLast': false,
    'inheritProject': false,
    'input': true,
    'list': true,
    'name': '新全宗',
    'noempty': false,
    'orderNo': 1342,
    'primaryKey': false,
    'propertyName': 'tag',
    'query': true,
    'queryType': 'like',
    'readonly': false,
    'remark': '',
    'retrieveFlag': false,
    'sort': true,
    'sortType': 'A',
    'system': true,
    'textArea': false,
    'type': 'f',
    'update': true,
    'used': true,
    'width': 80
  },
  {
    'align': 'C',
    'archiveNo': false,
    'archiveType': {
      'filingMode': '0',
      'id': 1352286661109,
      'leaf': true,
      'name': '文书档案',
      'orderNo': 1,
      'processInfo': true,
      'remark': '',
      'retentionPeriod': '',
      'showFlag': '0',
      'storeMode': '1',
      'storeType': 't',
      'text': '文书档案',
      'type': 'f'
    },
    'codingId': '',
    'colspan': 1,
    'columnName': 'FILING_SECTION',
    'dataItemPermissions': true,
    'dataLength': 100,
    'dataType': 'p',
    'defaultValue': '',
    'empty': false,
    'export': true,
    'exportColumnName': 'FILING_SECTION',
    'exportName': '归档处室',
    'exportOrderNo': 2101,
    'flowNo': false,
    'hidden': false,
    'id': 1380085759657,
    'inheritFolder': false,
    'inheritLast': false,
    'inheritProject': false,
    'input': true,
    'list': true,
    'name': '归档处室',
    'noempty': false,
    'orderNo': 2101,
    'primaryKey': false,
    'propertyName': 'filingSection',
    'query': true,
    'queryType': '=',
    'readonly': false,
    'remark': '',
    'retrieveFlag': true,
    'sort': true,
    'sortType': 'A',
    'system': true,
    'textArea': false,
    'type': 'f',
    'update': true,
    'used': true,
    'width': 80
  }
]

export default {
  getList: config => {
    const { importance, type, title, page = 1, limit = 20, sort } = param2Obj(config.url)

    let mockList = List.filter(item => {
      if (importance && item.importance !== +importance) return false
      if (type && item.type !== type) return false
      if (title && item.title.indexOf(title) < 0) return false
      return true
    })

    if (sort === '-id') {
      mockList = mockList.reverse()
    }

    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

    return {
      success: true,
      message: '',
      data: {
        totalCount: mockList.length,
        content: pageList
      }
    }
  },
  getQueryPropertyByType: () => {
    return {
      success: true,
      message: '',
      data: queryPropertyByTypeList
    }
  },
  OAUpdate: () => {
    return {
      success: true,
      message: '',
      data: ''
    }
  },
  getSeriesCode: () => {
    return {
      success: true,
      message: '',
      data: [
        {propertyValue: '1'},
        {propertyValue: '2'},
        {propertyValue: '3'},
        {propertyValue: '4'},
        {propertyValue: '5'}
      ]
    }
  }
}
