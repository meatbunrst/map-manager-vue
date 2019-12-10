<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="8" :lg="6" :xl="5">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>个人信息</span>
          </div>
          <div>
            <ul class="user-info">
              <li><svg-icon icon-class="user1" /> 用户名称 <div class="user-right">{{ user.username }}</div></li>
              <li><svg-icon icon-class="phone" /> 手机号码 <div class="user-right">{{ user.phone }}</div></li>
              <li><svg-icon icon-class="email" /> 用户邮箱 <div class="user-right">{{ user.email }}</div></li>
              <li><svg-icon icon-class="dept" /> 所属部门 <div class="user-right"> {{ user.deptName }} </div></li>
              <li><svg-icon icon-class="date" /> 创建日期 <div class="user-right">{{ parseTime(user.createTime) }}</div></li>
              <li>
                <svg-icon icon-class="anq" /> 安全设置
                <div class="user-right">
                  <a @click="$refs.pass.dialog = true">修改密码</a>
                </div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="16" :lg="18" :xl="19">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>操作日志</span>
            <div style="display:inline-block;float: right;cursor: pointer" @click="init"><i :class="ico"/></div>
          </div>
          <div>
            <el-table
              v-loading="dataListLoading"
              ref="syslogTable"
              :data="dataList"
              element-loading-text="拼命加载中"
              element-loading-spinner="el-icon-loading"
              border
              stripe
              style="width: 100%;">
              <el-table-column
                prop="username"
                header-align="center"
                align="center"
                label="用户名"/>
              <el-table-column
                :show-overflow-tooltip="true"
                prop="operation"
                header-align="center"
                align="center"
                label="用户操作"/>
              <el-table-column
                :show-overflow-tooltip="true"
                prop="method"
                header-align="center"
                align="center"
                label="请求方法"/>
              <el-table-column
                :show-overflow-tooltip="true"
                prop="params"
                header-align="center"
                align="center"
                label="请求参数"/>
              <el-table-column
                prop="time"
                header-align="center"
                align="center"
                label="执行时长(毫秒)"/>
              <el-table-column
                prop="ip"
                header-align="center"
                align="center"
                label="IP地址"/>
              <el-table-column
                prop="createDate"
                header-align="center"
                align="center"
                label="创建时间"/>
            </el-table>
            <el-pagination
              :current-page="pageIndex"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="pageSize"
              :total="totalPage"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="sizeChangeHandle"
              @current-change="currentChangeHandle"/>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <updatePass ref="pass"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import updatePass from './center/updatePass'
import { getToken } from '@/utils/auth'
import { parseTime } from '@/utils/index'
import initPage from '@/mixins/initPage'
export default {
  name: 'Center',
  components: { updatePass },
  mixins: [initPage],
  data() {
    return {
      pageSize: 10,
      queryUrl: '/syslog/listByUser',
      deleteUrl: '/syslog/delete',
      exportUrl: '/syslog/export',
      queryList: [],
      ico: 'el-icon-refresh',
      headers: {
        'token': 'Bearer ' + getToken()
      }
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'updateAvatarApi'
    ])
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    parseTime,
    beforeInit() {
      return true
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  .avatar-uploader-icon {
    font-size: 28px;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center
  }
  .user-info {
    padding-left: 0px;
    list-style: none;
    li{
      border-bottom: 1px solid #F0F3F4;
      /*border-top: 1px solid #F0F3F4;*/
      padding: 11px 0px;
      font-size: 13px;
    }
    .user-right {
      float: right;
      a{
        color: #317EF3;
      }
    }
  }
</style>
