<template>
  <el-menu-item v-if="sidebarLogo" :class="{'submenu-title-noDropdown':isCollapse}" index="0" style="pointer-events: none;">
    <!-- 缩小时显示的logo，可以自定义，这里直接使用图标库中的 -->
    <!--<svg-icon v-if="isCollapse" icon-class="run" />-->
    <svg-icon v-if="isCollapse" icon-class="test"/>
    <!--正常状态下显示的，可以使用本地的logoImg-->
    <div class="logo-con">
      <!--<img src="https://aurora-1255840532.cos.ap-chengdu.myqcloud.com/logo.png">-->
      <h2>后台管理平台</h2>
      <!--<img :src="logoImg">-->
    </div>
  </el-menu-item>
</template>

<script>
// import logoImg from '@/assets/logo/logo.png'
import { mapState } from 'vuex'
export default {
  name: 'Logo',
  props: {
    isCollapse: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // logoImg: logoImg
    }
  },
  computed: {
    ...mapState({
      sidebarLogo: state => state.settings.sidebarLogo
    })
  }
}
</script>

<style scoped>

</style>
