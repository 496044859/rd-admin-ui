export default {
  getAllNames: () => {
    return {
      success: true,
      message: '',
      data: [
        {
          id: '1',
          mc: '件号',
          sxmc: 'itemNo'
        },
        {
          id: '2',
          mc: '文号',
          sxmc: 'fileCode'
        },
        {
          id: '3',
          mc: '文件日期',
          sxmc: 'dateOfCreation'
        }
      ]
    }
  }
}
