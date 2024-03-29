import { login, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { Notification } from 'element-ui'
const user = {
  state: {
    token: getToken(),
    user: {},
    roles: [],
    // 第一次加载菜单时用到
    loadMenus: false
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USER: (state, user) => {
      state.user = user
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_LOAD_MENUS: (state, loadMenus) => {
      state.loadMenus = loadMenus
    }
  },
  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const apollo = userInfo.apollo
      const app = userInfo.app
      const captcha = userInfo.captcha
      const uuid = userInfo.uuid
      const rememberMe = userInfo.rememberMe
      return new Promise((resolve, reject) => {
        login(apollo, app, captcha, uuid).then(res => {
          if (res && res.code === 0) {
            setToken(res.token, rememberMe)
            commit('SET_TOKEN', res.token)
            setUserInfo(res.user, commit)
            // debugger
            commit('SET_LOAD_MENUS', true)
            resolve()
          } else {
            Notification.error({
              title: '登录出错',
              message: res.msg
            })
            reject(new Error('登录错误'))
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(res => {
          setUserInfo(res, commit)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit }) {
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resolve()
      })
    },

    updateLoadMenus({ commit }) {
      return new Promise((resolve, reject) => {
        commit('SET_LOAD_MENUS', false)
      })
    }
  }
}

export const setUserInfo = (res, commit) => {
  // 如果没有任何权限，则赋予一个默认的权限，避免请求死循环
  commit('SET_ROLES', ['ROLE_SYSTEM_DEFAULT', 'admin'])
  /* if (res.roles.length === 0) {
    commit('SET_ROLES', ['ROLE_SYSTEM_DEFAULT'])
  } else {
    commit('SET_ROLES', res.roles)
  }*/
  commit('SET_USER', res)
}

export default user
