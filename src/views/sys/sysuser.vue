<template>
  <div class="mod-config">
    <div ref="queryFrom" style="margin-bottom: 20px;">
      <el-card class="filter-container" shadow="never" body-style="padding: 5px 20px 0px 20px;">
        <div style="margin-bottom: 20px">
          <i class="el-icon-search"/>
          <span>筛选搜索</span>
          <el-button style="float:right" type="primary" size="mini" @click="init()"><svg-icon icon-class="search" />查询搜索</el-button>
          <el-button v-if="isAuth('systemuser:add')" size="mini" style="float:right;margin-right: 10px" type="primary" @click="addOrUpdateHandle()"><svg-icon icon-class="add" /> 新增</el-button>
          <el-tooltip v-if="isAuth('systemuser:delete')" class="item" effect="dark" content="初始密码是：123@456" placement="bottom">
            <el-button v-if="isAuth('systemuser:delete')" :disabled="dataListSelections.length <= 0" type="danger" size="mini" style="float:right;margin-right: 5px" @click="initHandle()"><svg-icon icon-class="keys" /> 初始化密码</el-button>
          </el-tooltip>
          <el-button v-if="isAuth('systemuser:delete')" :disabled="dataListSelections.length <= 0" type="danger" size="mini" style="float:right;margin-right: 5px" @click="disenableHandle()"><svg-icon icon-class="password1" />批量禁用</el-button>
          <el-button v-if="isAuth('systemuser:delete')" :disabled="dataListSelections.length <= 0" type="danger" size="mini" style="float:right;margin-right: 5px" @click="enableHandle()"><svg-icon icon-class="unlock" />批量启用</el-button>
          <!--<el-button v-if="isAuth('systemuser:add')" size="mini" type="primary" style="float:right;margin-right: 5px" @click="uploadExcel()"><svg-icon icon-class="upload" /> 导入</el-button>-->
          <!--<el-button v-if="isAuth('systemuser:add')" size="mini" type="primary" style="float:right;margin-right: 5px" @click="exportExcel()"><svg-icon icon-class="yunduanxiazai" /> 导出</el-button>-->
          <el-button v-if="isAuth('systemuser:delete')" :disabled="dataListSelections.length <= 0" size="mini" type="danger" style="float:right;margin-right: 10px" @click="deleteHandle()"><svg-icon icon-class="shanchu2" /> 批量删除</el-button>
          <el-button style="float:right;margin-right: 5px;" size="mini" @click="handleResetSearch()"><i class="el-icon-refresh" />重置</el-button>
        </div>
        <div style="margin-top: 15px">
          <el-form :inline="true" :model="dataForm" :rules="dataRule" @keyup.enter.native="getDataList()">
            <el-row>
              <el-col :span="6">
                <el-form-item>
                  <el-input v-model="dataForm.accountName" placeholder="用户名" clearable>
                    <template slot="prepend">用户名</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item prop="username" >
                  <el-input v-model="dataForm.username" placeholder="账户名" clearable>
                    <template slot="prepend">账户名</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item >
                  <el-input v-model="dataForm.mobile" placeholder="电话" clearable>
                    <template slot="prepend">电话</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6"/>
            </el-row>
            <!--  <el-row>
                  <el-col :span="6">
                      <el-form-item >
                          <el-input v-model="dataForm.email" placeholder="邮箱">
                              <template slot="prepend">邮箱</template>
                          </el-input>
                      </el-form-item>
                  </el-col>

                <el-col :span="6">
                  <el-form-item >
                    <el-input v-model="dataForm.status" placeholder="状态">
                      <template slot="prepend">状态</template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item >
                    <el-date-picker
                      v-model="dataForm.createTime"
                      type="date"
                      value-format="yyyy-MM-dd"
                      placeholder="创建时间">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>-->
          </el-form>
        </div>
      </el-card>
    </div>
    <el-table
      v-loading="dataListLoading"
      ref="sysuserTable"
      :height="tableHight"
      :data="dataList"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      border
      stripe
      style="width: 100%;"
      @selection-change="selectionChangeHandle"
      @row-click="toggleSelection">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50"/>
      <el-table-column
        prop="userId"
        header-align="center"
        align="center"
        label="UserId"/>
      <el-table-column
        prop="username"
        header-align="center"
        align="center"
        label="帐号"/>
      <el-table-column
        prop="accountName"
        header-align="center"
        align="center"
        label="用户名"/>
      <!--      <el-table-column
        prop="salt"
        header-align="center"
        align="center"
        label="盐"/>-->
      <el-table-column
        prop="email"
        header-align="center"
        align="center"
        label="邮箱"/>
      <el-table-column
        prop="mobile"
        header-align="center"
        align="center"
        label="手机号"/>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="状态"
        width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === '0'" size="small" type="danger">禁用</el-tag>
          <el-tag v-else size="small">正常</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        label="创建时间"/>
      <el-table-column
        prop="deptName"
        header-align="center"
        align="center"
        label="部门名"/>

      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="200"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click.stop="showHandle(scope.row.userId)"><svg-icon icon-class="check" />查看</el-button>
          <el-button type="text" size="small" @click.stop="roleHandle(scope.row.userId)"><svg-icon icon-class="dept" />分配角色</el-button>
          <el-button v-if="isAuth('systemuser:add')" type="text" size="small" @click.stop="addOrUpdateHandle(scope.row.userId)"><svg-icon icon-class="edit" />修改</el-button>
          <el-button v-if="isAuth('systemuser:delete')" type="text" size="small" class="red" @click.stop="deleteHandle(scope.row.userId)"><svg-icon icon-class="delete-material" />删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"/>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="init"/>
    <!--弹窗上传-->
    <upload v-if="uploadVisible" ref="upload"/>
    <role v-if="roleVisible" ref="role"/>
  </div>
</template>

<script>
import AddOrUpdate from './sysuser-add-update'
import Upload from './sysuser-upload'
import Role from './systemuser-role'
import initPage from '@/mixins/initPage'
export default {
  components: {
    AddOrUpdate,
    Role,
    Upload
  },
  mixins: [initPage],
  data() {
    return {
      dataForm: {
        userId: '',
        username: '',
        password: '',
        salt: '',
        email: '',
        mobile: '',
        status: '',
        createUserId: '',
        createTime: '',
        deptId: '',
        accountName: ''
      },
      dataRule: {},
      roleVisible: false,
      queryUrl: '/systemuser/list',
      deleteUrl: '/systemuser/delete',
      exportUrl: '/systemuser/export',
      queryList: [{ findType: 'LIKE', joinType: 'And', name: 'username' }, { findType: 'LIKE', joinType: 'And', name: 'accountName' }, { findType: 'LIKE', joinType: 'And', name: 'mobile' }],
      tableHight: 0
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  mounted() {
    this.offsetHeight = this.$refs.queryFrom.offsetHeight
  },
  methods: {

    // 触发一行的
    toggleSelection(row) {
      if (row) {
        this.$refs.sysuserTable.toggleRowSelection(row)
      } else {
        this.$refs.sysuserTable.clearSelection()
      }
    },
    // 设置table 的宽度
    setTableHight() {
      this.tableHight = this.documentClientHeight - this.offsetHeight - 205
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    showHandle(id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.show(id)
      })
    },
    getSort(prop) {
      this.sort = prop.prop
      this.order = prop.order
      this.init()
    },
    uploadExcel(id) {
      this.uploadVisible = true
      this.$nextTick(() => {
        this.$refs.upload.init()
      })
    },
    handleResetSearch() {
      this.dataForm = Object.assign({})
    },
    roleHandle(id) {
      this.roleVisible = true
      this.$nextTick(() => {
        this.$refs.role.init(id)
      })
    },
    // 删除
    deleteHandle(id) {
      const ids = id ? [id] : this.dataListSelections.map(item => {
        return item.userId
      })
      this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl(this.deleteUrl),
          method: 'post',
          data: this.$http.adornData(ids, false)
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.init()
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      })
    },
    // 批量启用
    enableHandle(id) {
      const ids = id ? [id] : this.dataListSelections.map(item => {
        return item.userId
      })
      const names = id ? [id] : this.dataListSelections.map(item => {
        return item.username
      })
      this.$confirm(`确定对用户${names.join(',')}进行[${id ? '启用' : '批量启用'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/systemuser/able'),
          method: 'post',
          data: this.$http.adornData(ids, false, 'json')
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: '启用成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.init()
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      })
    },
    // 批量初始化密码
    initHandle(id) {
      const ids = id ? [id] : this.dataListSelections.map(item => {
        return item.userId
      })
      const names = id ? [id] : this.dataListSelections.map(item => {
        return item.username
      })
      this.$confirm(`确定对用户：${names.join(',')}进行['初始化密码']操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/systemuser/init'),
          method: 'post',
          data: this.$http.adornData(ids, false)
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: '初始化密码成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.init()
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      })
    },
    // 批量禁用
    disenableHandle(id) {
      const ids = id ? [id] : this.dataListSelections.map(item => {
        return item.userId
      })
      const names = id ? [id] : this.dataListSelections.map(item => {
        return item.username
      })
      this.$confirm(`确定对用户：${names.join(',')} 进行[${id ? '禁用' : '批量禁用'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/systemuser/disable'),
          method: 'post',
          data: this.$http.adornData(ids, false)
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: '禁用成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.init()
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      })
    }
  }
}
</script>
<style scoped>
    .red{
        color: #ff0000;
    }
</style>
