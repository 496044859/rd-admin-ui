export default {
  getTreeWidthCheck: () => {
    return {
      success: true,
      data: {
        trees: [
          {
            'id': '1354351648743',
            'mc': '企业档案树',
            'children': [
              {
                'id': '1380422117263',
                'mc': '待分类',
                'children': [
                  {
                    'id': '1541728167015',
                    'mc': '2005',
                    'children': [
                      {
                        'id': '1541728334690',
                        'mc': '001',
                        'leaf': true
                      }
                    ],
                    'leaf': false
                  },
                  {
                    'id': '1541728167020',
                    'mc': '2006',
                    'leaf': true
                  },
                  {
                    'id': '1541728167023',
                    'mc': '2007',
                    'leaf': true
                  },
                  {
                    'id': '1541728167028',
                    'mc': '2008',
                    'leaf': true
                  },
                  {
                    'id': '1541728167031',
                    'mc': '2009',
                    'leaf': true
                  }
                ],
                'leaf': false
              },
              {
                'id': '1541995449919',
                'mc': '业务待审核',
                'leaf': true
              },
              {
                'id': '1541995449930',
                'mc': '业务审核不通过',
                'leaf': true
              }
            ],
            'leaf': false
          }
        ],
        treeChecked: ['1541728334690', '1541995449919', '1541995449930']
      }
    }
  },
  getTree: () => {
    return {
      'message': '当前模块获取档案树成功。',
      'data': [
        {
          'id': '297e7a2a6730962b0167309f676e0003',
          'icon': 'images/2.bmp',
          'flid': null,
          'kdlb': 'f',
          'mc': '实物档案',
          'jdlx': 'a',
          'sxz': null,
          'zlfs': '0',
          'leaf': false,
          'dalxid': 'ff8080816729fe0f01672a03afee00c4',
          'sxmc': null,
          'fljdcc': null
        },
        {
          'id': '297e7a2a6730962b0167309f67b80004',
          'icon': 'images/2.bmp',
          'flid': null,
          'kdlb': 'v',
          'mc': '科技档案',
          'jdlx': 'a',
          'sxz': null,
          'zlfs': '0',
          'leaf': false,
          'dalxid': 'ff808081671b9f5001671bba699202b0',
          'sxmc': null,
          'fljdcc': null
        },
        {
          'id': '297e7a2a6730962b0167309f67d10006',
          'icon': 'images/2.bmp',
          'flid': null,
          'kdlb': 'v',
          'mc': '专业档案',
          'jdlx': 'a',
          'sxz': null,
          'zlfs': '0',
          'leaf': true,
          'dalxid': 'ff808081671bbeb501671bc6f2390053',
          'sxmc': null,
          'fljdcc': null
        },
        {
          'id': '297e7a2a6730962b0167309f67e40007',
          'icon': 'images/2.bmp',
          'flid': null,
          'kdlb': 'v',
          'mc': '声像档案',
          'jdlx': 'a',
          'sxz': null,
          'zlfs': '0',
          'leaf': true,
          'dalxid': 'ff8080816729fe0f01672a01d9320081',
          'sxmc': null,
          'fljdcc': null
        },
        {
          'id': 'ff808081673fa58501673fa898600001',
          'icon': 'images/2.bmp',
          'flid': null,
          'kdlb': 'f',
          'mc': '文书档案',
          'jdlx': 'a',
          'sxz': null,
          'zlfs': '0',
          'leaf': true,
          'dalxid': 'ff8080816729fe0f01672a00440e0001',
          'sxmc': null,
          'fljdcc': null
        }
      ],
      'success': true
    }
  }
}
