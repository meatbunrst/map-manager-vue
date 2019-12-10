<template>
  <div class="mod-config">
    <div ref="queryFrom" style="margin-bottom: 20px;">
      <el-card class="filter-container" shadow="never" body-style="padding: 5px 20px 0px 20px;">
        <div style="margin-bottom: 20px">
          <i class="el-icon-search"/>
          <span>筛选搜索</span>
          <el-button style="float:right" type="primary" size="mini" @click="init()"><svg-icon icon-class="search" />查询搜索</el-button>
          <el-button v-if="isAuth('debugdetailed:add')" size="mini" style="float:right;margin-right: 10px" type="primary" @click="addOrUpdateHandle()"><svg-icon icon-class="add" /> 新增</el-button>
          <!--         <el-button v-if="isAuth('debugdetailed:add')" size="mini" type="primary" style="float:right;margin-right: 5px" @click="uploadExcel()"><svg-icon icon-class="upload" /> 导入</el-button>
          <el-button v-if="isAuth('debugdetailed:add')" size="mini" type="primary" style="float:right;margin-right: 5px" @click="exportExcel()"><svg-icon icon-class="yunduanxiazai" /> 导出</el-button>-->
          <el-button v-if="isAuth('debugdetailed:delete')" :disabled="dataListSelections.length <= 0" size="mini" type="danger" style="float:right;margin-right: 10px" @click="deleteHandle()"><svg-icon icon-class="shanchu2" /> 批量删除</el-button>
          <el-button style="float:right;" size="mini" @click="handleResetSearch()">重置</el-button>
        </div>
        <div style="margin-top: 15px">
          <el-form :inline="true" :model="dataForm" :rules="dataRule" @keyup.enter.native="getDataList()">
            <el-row>
              <el-col :span="6">
                <el-form-item prop="title" >
                  <el-input v-model="dataForm.title" placeholder="标题" clearable>
                    <template slot="prepend">标题</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item prop="projectId" >
                  <el-select
                    v-model="dataForm.projectId"
                    :remote-method="remoteMethod"
                    :loading="loading"
                    filterable
                    remote
                    reserve-keyword
                    style="width: 100%"
                    placeholder="请选择项目"
                    @change="selectProject">
                    <el-option
                      v-for="item in projectList"
                      :key="item.value"
                      :label="item.name"
                      :value="item.id"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item prop="projectId" >
                  <el-form-item label="模块" prop="moduleId">
                    <el-select
                      v-model="dataForm.moduleId"
                      :remote-method="remoteProject"
                      :loading="loading"
                      filterable
                      remote
                      reserve-keyword
                      style="width: 100%"
                      placeholder="请输入关键词">
                      <el-option
                        v-for="item in moduleList"
                        :key="item.id"
                        :label="item.fullname"
                        :value="item.id"/>
                    </el-select>
                  </el-form-item>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item prop="userId" >
                  <el-input v-model="dataForm.userId" placeholder="指派用户" clearable>
                    <template slot="prepend">指派用户</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="优先级" prop="priority" >
                  <el-radio-group v-model="dataForm.priority">
                    <el-radio-button v-for="(item, index) in dictMap.bug_priority" :key="index" :label="item.paramValue">{{ item.paramKey }}</el-radio-button>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="严重程度" prop="level" >
                  <el-radio-group v-model="dataForm.priority">
                    <el-radio-button v-for="(item,index) in dictMap.bug_level" :key="index" :label="item.paramValue">{{ item.paramKey }}
                    </el-radio-button>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item prop="keyWork" >
                  <el-input v-model="dataForm.keyWork" placeholder="关键词" clearable>
                    <template slot="prepend">关键词</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item prop="createBy" >
                  <el-input v-model="dataForm.createBy" placeholder="创建人" clearable>
                    <template slot="prepend">创建人</template>
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
      ref="debugdetailedTable"
      :height="tableHight"
      :data="dataList"
      :row-class-name="tableRowClassName"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      border
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
        prop="title"
        header-align="center"
        align="center"
        label="标题"/>
      <el-table-column
        prop="moduleName"
        header-align="center"
        align="center"
        label="模板名"/>
      <el-table-column
        prop="projectName"
        header-align="center"
        align="center"
        label="项目名"/>
      <el-table-column
        prop="userName"
        header-align="center"
        align="center"
        label="指派用户"/>
      <el-table-column
        prop="type"
        header-align="center"
        align="center"
        label="状态">
        <template slot-scope="scope">
          <el-tag v-if="getMapName(dictMap.bug_type,scope.row.type)" size="small" type="info">{{ getMapName(dictMap.bug_type,scope.row.type) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="priority"
        header-align="center"
        align="center"
        label="优先级">
        <template slot-scope="scope">
          <el-tag size="small" type="info">{{ getMapName(dictMap.bug_priority,scope.row.priority) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="level"
        header-align="center"
        align="center"
        label="严重程度">
        <template slot-scope="scope">
          <el-tag v-if="getMapName(dictMap.bug_level,scope.row.level)" size="small" type="info">{{ getMapName(dictMap.bug_level,scope.row.level) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="keyWork"
        header-align="center"
        align="center"
        label="关键词"/>
      <el-table-column
        prop="createBy"
        header-align="center"
        align="center"
        label="创建人"/>
      <el-table-column
        prop="createDate"
        header-align="center"
        align="center"
        label="创建日期"/>
      <el-table-column
        prop="endDate"
        header-align="center"
        align="center"
        label="截止日期"/>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="200"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click.stop="showHandle(scope.row.id)"><svg-icon icon-class="check" />查看</el-button>
          <router-link target="_blank" to="/pdf">
            <el-button type="text" size="small" ><svg-icon icon-class="image" />导出PDF</el-button>
          </router-link>
          <el-button v-if="isAuth('debugdetailed:add')" type="text" size="small" @click.stop="addOrUpdateHandle(scope.row.id)"><svg-icon icon-class="edit" />修改</el-button>
          <el-button v-if="isAuth('debugdetailed:delete')" type="text" size="small" class="red" @click.stop="deleteHandle(scope.row.id)"><svg-icon icon-class="delete-material" />删除</el-button>
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
    <add-or-update ref="addOrUpdate" @refreshDataList="init"/>
    <!--弹窗上传-->
    <upload ref="pdf"/>
    <!--展示的-->
    <show ref="show"/>
  </div>
</template>

<script>
import AddOrUpdate from './debugdetailed-add-update'
import Show from './debugdetailed-show'
import Upload from './debugdetailed-pdf'
import initPage from '@/mixins/initPage'
import initDict from '@/mixins/initNewDict'
export default {
  components: {
    AddOrUpdate,
    Show,
    Upload
  },
  mixins: [initPage, initDict],
  data() {
    return {
      dataForm: {
        id: '',
        title: '',
        moduleId: '',
        projectId: '',
        userId: '',
        versionId: '',
        type: '',
        priority: '',
        level: '',
        keyWork: '',
        endDate: '',
        content: '',
        fileIds: '',
        createBy: '',
        createDate: ''
      },
      projectList: [],
      dataRule: {},
      queryUrl: '/debugdetailed/list',
      deleteUrl: '/debugdetailed/delete',
      exportUrl: '/debugdetailed/export',
      offsetHeight: 0,
      queryList: [{ findType: 'EQ', joinType: 'And', name: 'title' }, { findType: 'EQ', joinType: 'And', name: 'moduleId' }, { findType: 'EQ', joinType: 'And', name: 'projectId' }, { findType: 'EQ', joinType: 'And', name: 'userId' }, { findType: 'EQ', joinType: 'And', name: 'priority' }, { findType: 'EQ', joinType: 'And', name: 'level' }, { findType: 'EQ', joinType: 'And', name: 'keyWork' }, { findType: 'EQ', joinType: 'And', name: 'createBy' }],
      tableHight: 0
    }
  },
  watch: {
    documentClientHeight: function(val) {
      setTimeout(() => {
        this.tableHight = val - this.offsetHeight - 190
      }, 50)
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  mounted() {
    this.offsetHeight = this.$refs.queryFrom.offsetHeight
    this.getDictMap('bug_priority,bug_level,bug_type')
    this.loadProject()
  },
  methods: {
    loadProject() {
      this.$http.get(this.$http.adornUrl(`/debugproject/all`)).then(({ data }) => {
        if (data && data.code === 0) {
          this.projectList = data.all
        }
      })
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.projectList = this.list.filter(item => {
            return item.name.toLowerCase()
              .includes(query.toLowerCase())
          })
        }, 200)
      } else {
        this.options = []
      }
    },
    // 触发一行的
    toggleSelection(row) {
      if (row) {
        this.$refs.debugdetailedTable.toggleRowSelection(row)
      } else {
        this.$refs.debugdetailedTable.clearSelection()
      }
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.colorType === '1') {
        return 'warning-row'
      } else if (row.colorType === '2') {
        return 'success-row'
      }
      return ''
    },
    showHandle(id) {
      // this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.show.show(id)
      })
    },
    pdfHandle(id) {
      /* const routes = this.$router.resolve({ path: '/fixBug/debugdetailed-pdf' })
      window.open(routes.href, '_blank')*/
    },
    getSort(prop) {
      this.sort = prop.prop
      this.order = prop.order
      this.getDataList()
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
          url: this.$http.adornUrl('/debugdetailed/delete'),
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
<style >
    .red{
        color: #ff0000;
    }
    .el-table .warning-row {
      background: oldlace;
    }
    .el-table .success-row {
      background: #f0f9eb;
    }
</style>
