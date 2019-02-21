import { fetchPropertyAll } from '@/api/archiveTypeDefine/property'
import { fetchArchiveTypes } from '@/api/archiveTypeDefine/archiveType'
import { fetchCoding, fetchCodingAll } from '@/api/codingDefine'
import { fetchSysDepts } from '@/api/systemAction'
import { fetchList } from '@/api/borrowBus'

const globalData = {
  namespaced: true,
  state: {
    codingData: [],
    codingAll: [], // 所有的编码
    archiveTypes: [], // 所有的档案类型
    propertyAll: [],
    deptList: [],
    etcType: [{ // 电子文件类型
      value: 't',
      label: '文本类'
    }, {
      value: 'p',
      label: '照片类'
    }, {
      value: 'v',
      label: '音像类'
    }],
    borrowType: [{ // 借阅类型
      label: '电子查阅',
      value: '1'
    }, {
      label: '实体调阅',
      value: '2'
    }],
    borrowBus: 0
  },
  mutations: {
    SET_CODINGDATA (state, data) {
      state.codingData = data
    },
    SET_CODINGALL (state, data) {
      state.codingAll = data
    },
    SET_ARCHIVETYPES (state, data) {
      state.archiveTypes = data
    },
    SET_PROPERTYALL (state, data) {
      state.propertyAll = data
    },
    SET_DEPTLIST (state, data) {
      state.deptList = data
    },
    SET_BORROWBUS (state, data) {
      state.borrowBus = data
    },
    ADD_BORROWBUS (state, num) {
      for (let i = 0; i < num; i++) {
        state.borrowBus++
      }
    },
    DEL_BORROWBUS (state, num) {
      for (let i = 0; i < num; i++) {
        state.borrowBus--
      }
    }
  },
  actions: {
    async getCodingData ({ commit }) {
      let res = await fetchCoding()
      if (res.data) {
        commit('SET_CODINGDATA', res.data)
      }
    },
    async getCodingAll ({ commit }) {
      let res = await fetchCodingAll()
      if (res.data) {
        commit('SET_CODINGALL', res.data)
      }
    },
    async getArchiveTypes ({ commit }) {
      let res = await fetchArchiveTypes()
      if (res.data) {
        // 过滤掉'待分类'的档案类型
        const newArray = res.data.filter(item => item.mldm !== 'DFL')
        commit('SET_ARCHIVETYPES', newArray)
      }
    },
    async getPropertyAll ({ commit }) {
      let res = await fetchPropertyAll()
      if (res.data) {
        commit('SET_PROPERTYALL', res.data)
      }
    },
    async getDeptList ({ commit }) {
      let res = await fetchSysDepts()
      if (res.data) {
        commit('SET_DEPTLIST', res.data)
      }
    },
    async getBorrowBus ({ commit }) {
      let res = await fetchList()
      if (res.data) {
        commit('SET_BORROWBUS', res.data.length)
      }
    },
    addBorrowBus ({ commit }, num) {
      commit('ADD_BORROWBUS', num)
    },
    delBorrowBus ({ commit }, num) {
      commit('DEL_BORROWBUS', num)
    }
  }
}
export default globalData
