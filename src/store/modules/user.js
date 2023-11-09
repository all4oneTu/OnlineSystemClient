import Vue from 'vue'
import { login, getInfo, logout } from '../../api/login'
import { ACCESS_TOKEN } from '../../store/mutation-types'
import { welcome } from '../../utils/util'

const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    }
  },

  actions: {
      Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
          login(userInfo).then(response => {
            console.log('Login')
          if (response.code === 0) {
            const token = response.data     
            Vue.ls.set(ACCESS_TOKEN, token, 24 * 60 * 60 * 1000)
            commit('SET_TOKEN', token)
            resolve()
          } else {
            reject(new Error('Tên người dùng hoặc mật khẩu sai'))
          }
        }).catch(error => {
          console.log(error)
          reject(error)
        })
      })
    },

  
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          console.log('/user/info：')
          console.log(response)
          const result = response.data 

          if (result.role && result.role.permissions.length > 0) { 
            const role = result.role
            console.log('role：')
            console.log(role)
            role.permissions = result.role.permissions 
            role.permissions.map(per => {
              if (per.actionEntitySet != null && per.actionEntitySet.length > 0) {
                const action = per.actionEntitySet.map(action => {
                  return action.action
                })
                per.actionList = action
              }
            })
            role.permissionList = role.permissions.map(permission => { 
              return permission.permissionId
            })   
            commit('SET_ROLES', result.role) 
            commit('SET_INFO', result)
          } else {
            reject(new Error('getInfo: roles must be a non-null array !'))
          }
          commit('SET_NAME', { name: result.name, welcome: welcome() }) 
          commit('SET_AVATAR', result.avatar) 

          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },


    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        Vue.ls.remove(ACCESS_TOKEN)

        logout(state.token).then(() => {
          resolve()
        }).catch(() => {
          console.log('remove token error')
          resolve()
        })
      })
    }

  }
}

export default user
