<template>
  <div class="mod-config">
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :md="10" :lg="10" :xl="10">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>字典列表</span>
            <el-button
              size="mini"
              style="float: right;padding: 4px 10px"
              type="primary"
              icon="el-icon-plus"
              @click="addOrUpdateHandle()">新增
            </el-button>
          </div>
          <div class="head-container" style="margin-bottom: 20px">
            <el-input
              v-model="dataForm.dictName"
              clearable
              placeholder="输入搜索内容"
              style="width: 200px;"
              @keyup.enter.native="getDataList">
              <template slot="prepend">标签名</template>
            </el-input>
            <el-button style="float: right" size="mini" type="success" icon="el-icon-search" @click="getDataList()">搜索
            </el-button>
          </div>
          <el-table
            v-loading="dataListLoading"
            ref="sysdictTable"
            :data="dataList"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            border
            highlight-current-row
            style="width: 100%;"
            @selection-change="selectionChangeHandle"
            @row-click="toggleSelection">
            <el-table-column
              prop="dictName"
              header-align="center"
              align="center"
              label="字典名称"/>
            <el-table-column
              prop="remark"
              header-align="center"
              align="center"
              label="描述"/>
            <el-table-column
              fixed="right"
              header-align="center"
              align="center"
              width="150"
              label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click.stop="addOrUpdateHandle(scope.row.id)">
                  <i class="el-icon-edit-outline"/>
                  修改
                </el-button>
                <el-button type="text" size="small" class="red" @click.stop="deleteHandle(scope.row.id)">
                  <i class="el-icon-delete"/>
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            :current-page="pageIndex"
            :page-sizes="[10, 20, 50]"
            :page-size="pageSize"
            :total="totalPage"
            layout="total, sizes, prev, pager, next"
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"/>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="14" :lg="14" :xl="14">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>字典详情</span>
            <el-button
              class="filter-item"
              size="mini"
              style="float: right;padding: 4px 10px"
              type="primary"
              icon="el-icon-plus"
              @click="showDetailHandle()"
            >新增
            </el-button>
          </div>
          <div class="head-container" style="margin-bottom: 20px">
            <el-input
              v-model="dataForm.paramKey"
              clearable
              placeholder="输入搜索内容"
              style="width: 200px;"
              @keyup.enter.native="getDataDictList()">
              <template slot="prepend">参数名</template>
            </el-input>
            <el-input
              v-model="dataForm.paramValue"
              clearable
              placeholder="输入搜索内容"
              style="width: 200px;"
              @keyup.enter.native="getDataDictList()">
              <template slot="prepend">参数值</template>
            </el-input>
            <el-button style="float: right" size="mini" type="success" icon="el-icon-search" @click="getDataDictList()">
              搜索
            </el-button>
          </div>
          <el-table
            v-loading="dataListDictLoading"
            ref="sysconfigTable"
            :data="dataDictList"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            border
            stripe
            empty-text="请点击左方的标签查询数据"
            style="width: 100%;">
            <el-table-column
              prop="paramKey"
              header-align="center"
              align="center"
              label="参数名"/>
            <el-table-column
              prop="paramValue"
              header-align="center"
              align="center"
              label="参数值"/>
            <el-table-column
              prop="status"
              header-align="center"
              align="center"
              label="状态">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.status === '0'" size="small" type="danger">禁用</el-tag>
                <el-tag v-else size="small">启动</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="remark"
              header-align="center"
              align="center"
              label="备注"/>
            <el-table-column
              fixed="right"
              header-align="center"
              align="center"
              width="150"
              label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click.stop="showDetailHandle(scope.row.id)">
                  <i class="el-icon-edit-outline"/>
                  修改
                </el-button>
                <el-button type="text" size="small" class="red" @click.stop="deleteDictHandle(scope.row.id)">
                  <i class="el-icon-delete"/>
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            :current-page="pageDictIndex"
            :page-sizes="[10, 20, 50]"
            :page-size="pageDictSize"
            :total="totalDictPage"
            layout="total, sizes, prev, pager, next"
            @size-change="sizeDictChangeHandle"
            @current-change="currentDictChangeHandle"/>
        </el-card>
      </el-col>
    </el-row>
    <add-or-update v-if="addOrUpdateVisible" ref="dictAdd" @refreshDataList="getDataList"/>
    <add-detail v-if="addDetailVisible" ref="addDetail" @refreshDataList="getDataDictList"/>
  </div>
</template>

<script>
import AddDetail from './sysdictdetailed-add-update'
import AddOrUpdate from './sysdict-add-update'

export default {
  components: {
    AddOrUpdate,
    AddDetail
  },
  data() {
    return {
      dataForm: {
        dictName: '',
        paramKey: '',
        paramValue: '',
        remark: ''
      },
      labelId: '',
      dataList: [],
      dataDictList: [],
      pageIndex: 1,
      pageDictIndex: 1,
      pageSize: 10,
      pageDictSize: 10,
      sort: '',
      order: '',
      totalPage: 0,
      totalDictPage: 0,
      dataListLoading: false,
      dataListDictLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      addDetailVisible: false,
      offsetHeight: 0,
      tableHight: 0
    }
  },
  created() {
    this.$nextTick(() => {
      this.getDataList()
    })
  },
  methods: {
    // 获取数据列表
    getDataList() {
      /*      this.$http.post(this.$http.adornUrl(`/sysnotify/test`), { id: 'test' }
      ).then(({ data }) => {
        if (data && data.code === 0) {
          console.log(1111)
        }
      })*/
      this.$http.postForm(this.$http.adornUrl(`/sysnotify/test`), { ids: 'test' }).then(({ data }) => {
        console.log(data)
      })
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/sysdict/listModel'),
        method: 'get',
        params: this.$http.adornParams({
          'page': this.pageIndex,
          'limit': this.pageSize,
          'order': this.order,
          'sort': this.sort,
          'dictName': this.dataForm.dictName
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list
          this.totalPage = data.page.totalCount
        } else {
          this.dataList = []
          this.totalPage = 0
        }
        this.dataListLoading = false
      })
    },
    // 获取数据列表
    getDataDictList() {
      this.dataListDictLoading = true
      this.$http({
        url: this.$http.adornUrl('/sysdictdetailed/listModel'),
        method: 'get',
        params: this.$http.adornParams({
          'page': this.pageDictIndex,
          'limit': this.pageDictSize,
          'order': this.order,
          'paramValue': this.dataForm.paramValue,
          'sort': this.sort,
          'labelId': this.labelId,
          'paramKey': this.dataForm.paramKey
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataDictList = data.page.list
          this.totalDictPage = data.page.totalCount
        } else {
          this.dataDictList = []
          this.totalDictPage = 0
        }
        this.dataListDictLoading = false
      })
    },
    toggleSelection(row) {
      this.labelId = row.id
      this.label = row.dictName
      this.getDataDictList()
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 每页数
    sizeDictChangeHandle(val) {
      this.pageDictSize = val
      this.pageDictIndex = 1
      this.getDataDictList()
    },
    // 当前页
    currentDictChangeHandle(val) {
      this.pageDictIndex = val
      this.getDataDictList()
    },
    currentChangeHandle(val) {
      this.pageIndex = val
      this.getDataList()
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.dictAdd.init(id)
      })
    },
    showHandle(id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.show(id)
      })
    },
    showDetailHandle(id) {
      this.addDetailVisible = true
      this.$nextTick(() => {
        this.$refs.addDetail.init(id, this.labelId)
      })
    },
    getSort(prop) {
      this.sort = prop.prop
      this.order = prop.order
      this.getDataList()
    },
    // 删除
    deleteHandle(id) {
      const ids = id ? [id] : this.dataListSelections.map(item => {
        return item.dictName
      })
      this.$confirm(`确定对进行删除操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/sysdict/delete'),
          method: 'post',
          data: this.$http.adornData(ids, false)
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataDictList()
                this.getDataList()
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      })
    },
    deleteDictHandle(id) {
      const ids = id ? [id] : this.dataListSelections.map(item => {
        return item.dictName
      })
      this.$confirm(`确定对进行删除操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/sysdictdetailed/delete'),
          method: 'post',
          data: this.$http.adornData(ids, false)
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataDictList()
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

