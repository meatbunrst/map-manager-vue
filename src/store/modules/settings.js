import Config from '@/config'
import variables from '@/styles/element-variables.scss'

const settings = {
  state: {
    showRightPanel: false,
    documentClientHeight: 0,
    initHeight: 0,
    tagsView: Config.tagsView,
    fixedHeader: Config.fixedHeader,
    sidebarLogo: Config.sidebarLogo,
    theme: variables.theme,
    settingBtn: Config.settingBtn,
    uniqueOpened: Config.uniqueOpened,
    showFooter: Config.showFooter,
    footerTxt: Config.footerTxt,
    caseNumber: Config.caseNumber
  },
  mutations: {
    CHANGE_SETTING: (state, { key, value }) => {
      if (state.hasOwnProperty(key)) {
        state[key] = value
      }
    }
  },
  actions: {
    changeSetting({ commit }, data) {
      commit('CHANGE_SETTING', data)
    }
  }
}
export default settings
