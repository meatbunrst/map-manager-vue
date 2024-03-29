<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div :class="{hasTagsView:needTagsView}" class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <navbar />
        <tags-view v-if="needTagsView" />
      </div>
      <app-main />
      <right-panel>
        <settings />
      </right-panel>
    </div>
  </div>
</template>
<script>
import RightPanel from '@/components/RightPanel'
import { AppMain, Navbar, Settings, Sidebar, TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState } from 'vuex'

export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    Settings,
    Sidebar,
    TagsView,
    RightPanel
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      // documentClientHeight: state => state.settings.documentClientHeight,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader
    }),
    documentClientHeight: {
      get() {
        return this.$store.state.settings.documentClientHeight
      },
      set(val) {
        this.$store.dispatch('changeSetting', {
          key: 'documentClientHeight',
          value: val
        })
      }
    },
    initHeight: {
      get() {
        return this.$store.state.settings.initHeight
      },
      set(val) {
        this.$store.dispatch('changeSetting', {
          key: 'initHeight',
          value: val
        })
      }
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  mounted() {
    this.resetDocumentClientHeight()
  },
  methods: {
    // 重置窗口可视高度
    resetDocumentClientHeight() {
      this.documentClientHeight = document.documentElement.clientHeight
      this.initHeight = document.documentElement.clientHeight
      window.onresize = () => {
        this.documentClientHeight = document.documentElement.clientHeight
      }
    },
    handleClickOutside() {
      this.$store.dispatch('closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar {
      position: fixed;
      top: 0;
    }
  }

  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    background: #ffffff;
    z-index: 99;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - #{$hideSidebarWidth})
  }

  .mobile .fixed-header {
    width: 100%;
  }
</style>
