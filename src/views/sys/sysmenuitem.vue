<template>
  <div class="mod-config">
    <div ref="queryFrom" style="margin-bottom: 20px;">
      <el-card class="filter-container" shadow="never" body-style="padding: 5px 20px 0px 20px;">
        <div style="margin-bottom: 20px">
          <i class="el-icon-search"/>
          <span>筛选搜索</span>
          <el-button style="float:right" type="primary" size="mini" @click="init()"><svg-icon icon-class="search" />查询搜索</el-button>
          <el-button v-if="isAuth('sysmenuitem:add')" size="mini" style="float:right;margin-right: 10px" type="primary" @click="addOrUpdateHandle()"><svg-icon icon-class="add" /> 新增</el-button>
          <el-button v-if="isAuth('sysmenuitem:add')" size="mini" type="primary" style="float:right;margin-right: 5px" @click="uploadExcel()"><svg-icon icon-class="upload" /> 导入</el-button>
          <el-button v-if="isAuth('sysmenuitem:add')" size="mini" type="primary" style="float:right;margin-right: 5px" @click="exportExcel()"><svg-icon icon-class="yunduanxiazai" /> 导出</el-button>
          <el-button v-if="isAuth('sysmenuitem:delete')" :disabled="dataListSelections.length <= 0" size="mini" type="danger" style="float:right;margin-right: 10px" @click="deleteHandle()"><svg-icon icon-class="shanchu2" /> 批量删除</el-button>
          <el-button style="float:right;margin-right: 5px;" size="mini" @click="handleResetSearch()"><i class="el-icon-refresh" />重置</el-button>
        </div>
        <div style="margin-top: 15px">
          <el-form :inline="true" :model="dataForm" :rules="dataRule" @keyup.enter.native="init()">
            <el-row>
              <el-col :span="6">
                <el-form-item prop="name" >
                  <el-input v-model="dataForm.name" placeholder="名称" clearable>
                    <template slot="prepend">名称</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item prop="permission" >
                  <el-input v-model="dataForm.permission" placeholder="权限标识" clearable>
                    <template slot="prepend">权限标识</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-card>
    </div>
    <el-table
      v-loading="dataListLoading"
      ref="sysmenuitemTable"
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
        prop="id"
        header-align="center"
        align="center"
        label="主键ID"/>
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        label="名称"/>
      <el-table-column
        prop="menuSort"
        header-align="center"
        align="center"
        label="排序"/>
      <el-table-column
        prop="sysId"
        header-align="center"
        align="center"
        label="系统id"/>
      <el-table-column
        prop="permission"
        header-align="center"
        align="center"
        label="权限标识"/>
      <el-table-column
        prop="menuType"
        header-align="center"
        align="center"
        label="MenuType"/>
      <el-table-column
        prop="meenuHref"
        header-align="center"
        align="center"
        label="连接href"/>
      <el-table-column
        prop="remarks"
        header-align="center"
        align="center"
        label="评论"/>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        label="创建时间"/>
      <el-table-column
        prop="updateTime"
        header-align="center"
        align="center"
        label="更新时间"/>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="200"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click.stop="showHandle(scope.row.id)"><svg-icon icon-class="check" />查看</el-button>
          <el-button v-if="isAuth('sysmenuitem:add')" type="text" size="small" @click.stop="addOrUpdateHandle(scope.row.id)"><svg-icon icon-class="edit" />修改</el-button>
          <el-button v-if="isAuth('sysmenuitem:delete')" type="text" size="small" class="red" @click.stop="deleteHandle(scope.row.id)"><svg-icon icon-class="delete-material" />删除</el-button>
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
  </div>
</template>

<script>
import AddOrUpdate from './sysmenuitem-add-update'
import Upload from './sysmenuitem-upload'
import initPage from '@/mixins/initPage'
export default {
  components: {
    AddOrUpdate,
    Upload
  },
  mixins: [initPage],
  data() {
    return {
      dataForm: {
        id: '',
        name: '',
        menuSort: '',
        sysId: '',
        permission: '',
        menuType: '',
        meenuHref: '',
        remarks: '',
        createTime: '',
        updateTime: ''
      },
      dataRule: {},
      queryUrl: '/sysmenuitem/list',
      deleteUrl: '/sysmenuitem/delete',
      exportUrl: '/sysmenuitem/export',
      queryList: [{ findType: 'EQ', joinType: 'And', name: 'name' }, { findType: 'EQ', joinType: 'And', name: 'permission' }],
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
        this.$refs.sysmenuitemTable.toggleRowSelection(row)
      } else {
        this.$refs.sysmenuitemTable.clearSelection()
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
    // 删除
    deleteHandle(id) {
      const ids = id ? [id] : this.dataListSelections.map(item => {
        return item.id
      })
      this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/sysmenuitem/delete'),
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
    }
  }
}
</script>
<style scoped>
    .red{
        color: #ff0000;
    }
</style>
