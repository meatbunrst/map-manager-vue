<template>
  <div class="mod-config">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>事件</span>
            <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
          </div>
          <div
            v-infinite-scroll="load"
            infinite-scroll-disabled="disabled"
            style="height: 500px;overflow:auto"
            class="infinite-list-wrapper">
            <div v-for="(value,index) in dataList" :key="index">
              <svg-icon icon-class="gonggao"/>
              <span>{{ value.title }}</span>
            </div>
            <p v-if="dataloading">加载中...</p>
            <p v-if="noMore">没有更多了</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="16" >
        <el-tabs type="border-card" @tab-click="handleChangeTab">
          <el-tab-pane>
            <span slot="label"><i class="el-icon-s-order"/> 待办任务</span>
            <el-table
              :data="todoList"
              :show-header="false"
              height="400"
              border
              style="width: 100%;font-size:14px;">
              <el-table-column>
                <template slot-scope="scope">
                  <div class="todo-item">{{ scope.row.title }}</div>
                </template>
              </el-table-column>
              <el-table-column width="120">
                <template slot-scope="scope">
                  <el-button type="text" size="small" class="red" @click.stop="showHandle(scope.row.projectId)">
                    <i class="el-icon-edit">反馈</i>
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              :current-page="toDoPageIndex"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="toDoPageSize"
              :total="totalDoPage"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="sizeChangeHandle"
              @current-change="currentChangeHandle"/>
          </el-tab-pane>
          <el-tab-pane >
            <span slot="label"><i class="el-icon-s-claim"/> 已办任务</span>
            <el-table
              :data="todoList"
              :show-header="false"
              height="400"
              border
              stripe
              style="width: 100%;font-size:14px;">
              <el-table-column>
                <template slot-scope="scope">
                  <div class="todo-item" >{{ scope.row.projectName }}</div>
                </template>
              </el-table-column>
              <el-table-column width="120">
                <template slot-scope="scope">
                  <!--<el-button type="text" size="small" class="red" @click.stop="showAddressHandle(scope.row.projectId)">
                    <i class="el-icon-zoom-in">查看</i>
                  </el-button>-->
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              :current-page="toDoPageIndex"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="toDoPageSize"
              :total="totalDoPage"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="sizeChangeHandle"
              @current-change="currentChangeHandle"/>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dataloading: false,
      showVisible: false,
      dataForm: {
        type: '1',
        title: '',
        files: '',
        status: '',
        createBy: '',
        createDate: '',
        attachIds: '',
        infoIds: '',
        userType: '',
        sumNumber: ''
      },
      dataToDoForm: {
        title: '',
        content: '',
        roleid: '',
        userId: '',
        projectName: '',
        type: '',
        status: '0',
        projectId: '',
        remarks: ''
      },
      checkUrl: this.$http.adornUrl('/systask/list'),
      count: 0,
      toDoPageSize: 10,
      toDoPageIndex: 1,
      totalDoPage: 0,
      queryList: [],
      pageIndex: 1,
      dataList: [],
      pageSize: 5,
      sort: '',
      order: '',
      totalPage: 1,
      dataListLoading: false,
      showMore: false,
      todoList: [
      ]
    }
  },
  computed: {
    noMore() {
      return this.count >= this.totalPage
    },
    disabled() {
      return this.dataloading || this.noMore
    }
  },
  created() {
    this.getToDoDataList()
  },
  activated() {
    // this.getDataList()
  },
  deactivated() {
    // window.removeEventListener('resize', this.renderChart)
  },
  methods: {
    // 获取数据列表
    getToDoDataList() {
      this.$http({
        url: this.checkUrl,
        method: 'get',
        params: this.$http.adornParams({
          'page': this.toDoPageIndex,
          'limit': this.toDoPageSize,
          'json': this.getQueryString(this.dataToDoForm)
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.todoList = data.page.list
          this.totalDoPage = data.page.totalCount
        } else {
          this.todoList = []
          this.totalDoPage = 0
        }
      })
    },
    getQueryString(from) {
      const queryNew = []
      for (const key in from) {
        if (from[key]) {
          let found = false
          for (let i = 0; i < this.queryList.length; i++) {
            if (this.queryList[i].name === key) {
              this.queryList[i].values = []
              if (Array.isArray(from[key])) {
                this.queryList[i].values = from[key]
              } else {
                this.queryList[i].values.push(from[key])
              }
              queryNew.push(this.queryList[i])
              found = true
              break
            }
          }
          if (!found) {
            queryNew.push({ values: [from[key]], findType: 'EQ', joinType: 'And', name: key })
          }
        }
      }
      return JSON.stringify(queryNew)
    },
    // 每页数
    sizeChangeHandle(val) {
      this.toDoPageSize = val
      this.toDoPageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle(val) {
      this.toDoPageIndex = val
      this.getToDoDataList()
    },

    load() {
      this.dataloading = true
      this.count += 1
      this.$http.get(this.$http.adornUrl(`/sysnotify/listModel`), { params: this.$http.adornParams({ page: this.count }) }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = this.dataList.concat(data.page.list)
          this.totalPage = data.page.pageSize
          this.dataloading = false
        }
      })
    },
    showHandle(id) {
      console.log(id)
      this.showVisible = true
      this.$nextTick(() => {
        this.$refs.show.show(id)
      })
    },
    handleChangeTab(data) {
      // this.dataToDoForm
      console.log(data)
      if (data.index === '1') {
        this.dataToDoForm.status = '1'
      } else {
        this.dataToDoForm.status = '0'
      }
      this.getToDoDataList()
    },
    /* showHandle(id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.show.show(id)
      })
    },*/
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true
      this.sort = 'createDate'
      this.order = 'descending'
      this.$http({
        url: this.$http.adornUrl('/sysnotify/list'),
        method: 'get',
        params: this.$http.adornParams({
          'page': this.pageIndex,
          'limit': this.pageSize,
          'order': this.order,
          'sort': this.sort,
          'json': this.getQueryString()
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          if (data.page.list.length) {
            this.dataList = this.dataList.concat(data.page.list)
          } else {
            this.showMore = true
            // this.$message.error('已经加载完毕')
          }
        } else {
          this.dataList = []
          this.totalPage = 0
        }
        this.dataListLoading = false
      })
    }
  }
}
</script>
<style scoped>
  .user-info-cont div:first-child {
    font-size: 30px;
    color: #222;
  }

  .user-info-list span {
    margin-left: 70px;
  }

  .mgb20 {
    margin-bottom: 20px;
  }

</style>
