import { loginByUsername, logout, getUserInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    id: '',
    loginName: '',
    token: getToken(),
    name: '',
    roles: [],
    menus: [],
    deptId: '',
    deptName: ''
  },

  mutations: {
    SET_MENUS: (state, data) => {
      state.menus = data
    },
    SET_FONDSCODE: (state, code) => {
      state.fondsCode = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_ID: (state, userId) => {
      state.id = userId
    },
    SET_DEPTID: (state, deptId) => {
      state.deptId = deptId
    },
    SET_DEPTNAME: (state, deptName) => {
      state.deptName = deptName
    },
    SET_LOGINNAME: (state, loginName) => {
      state.loginName = loginName
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername ({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        loginByUsername(username, userInfo.password).then(response => {
          const data = response.data
          commit('SET_TOKEN', data.token)
          setToken(response.data.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetUserInfo ({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.token).then(response => {
          if (!response.data) { // 由于mockjs 不支持自定义状态码只能这样hack
            reject(new Error('error'))
          }
          const data = response.data
          commit('SET_ID', data.userdto.userId)
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          commit('SET_MENUS', data.menus)
          commit('SET_DEPTID', data.userdto.deptId)
          commit('SET_LOGINNAME', data.userdto.loginName)
          commit('SET_DEPTNAME', data.userdto.deptName)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 单点登录
    SSOLogin ({ commit }, token) {
      return new Promise(resolve => {
        commit('SET_TOKEN', token)
        setToken(token)
        resolve()
      })
    },
    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },
    // 登出
    LogOut ({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut ({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },

    // 动态修改权限
    ChangeRoles ({ commit }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        setToken(role)
        getUserInfo(role).then(response => {
          const data = response.data
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.userdto.loginName)
          commit('SET_MENUS', data.menus)
          resolve()
        })
      })
    }
  }
}

export default user
