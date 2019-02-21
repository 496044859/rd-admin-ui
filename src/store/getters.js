const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  userId: state => state.user.id,
  name: state => state.user.name,
  roles: state => state.user.roles,
  menus: state => state.user.menus,
  deptId: state => state.user.deptId,
  deptName: state => state.user.deptName,
  loginName: state => state.user.loginName,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  errorLogs: state => state.errorLog.logs,
  borrowBus: state => state.globalData.borrowBus,
  deptList: state => state.globalData.deptList
}
export default getters
