import Cookies from 'js-cookie'
export default {
  data() {
    return {
      dataForm: {
      },
      dataListLoading: true,
      dataList: [],
      dataRule: {},
      queryList: [],
      dataListSelections: [],
      pageIndex: 0,
      pageSize: 20,
      totalPage: 0,
      queryUrl: '',
      deleteUrl: '',
      exportUrl: '',
      sort: '',
      order: '',
      params: {},
      offsetHeight: 0,
      tableHight: 0,
      query: {},
      addOrUpdateVisible: false,
      uploadVisible: false,
      time: 170,
      isAdd: false
    }
  },
  computed: {
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
    }
  },
  watch: {
    documentClientHeight: function(val) {
      // 最后的高度
      setTimeout(() => {
        this.setTableHight()
      }, 50)
    }
  },
  mounted() {
    if (this.$refs.queryFrom) {
      this.offsetHeight = this.$refs.queryFrom.offsetHeight
    }
  },
  methods: {
    getQueryString() {
      const queryNew = []
      for (const key in this.dataForm) {
        if (this.dataForm[key]) {
          let found = false
          for (let i = 0; i < this.queryList.length; i++) {
            if (this.queryList[i].name === key) {
              this.queryList[i].values = []
              if (Array.isArray(this.dataForm[key])) {
                this.queryList[i].values = this.dataForm[key]
              } else {
                this.queryList[i].values.push(this.dataForm[key])
              }
              queryNew.push(this.queryList[i])
              found = true
              break
            }
          }
          if (!found) {
            queryNew.push({ values: [this.dataForm[key]], findType: 'EQ', joinType: 'And', name: key })
          }
        }
      }
      return JSON.stringify(queryNew)
    },
    async init() {
      if (!await this.beforeInit()) {
        return
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl(this.queryUrl),
        method: 'get',
        params: this.$http.adornParams({
          'page': this.pageIndex,
          'limit': this.pageSize,
          'order': this.order,
          'json': this.getQueryString(),
          'sort': this.sort
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list
          this.totalPage = data.page.totalCount
        } else {
          this.dataList = []
          this.totalPage = 0
        }
        this.setTableHight()
        setTimeout(() => {
          this.dataListLoading = false
        }, this.time)
      })
    },
    beforeInit() {
      return true
    },
    setTableHight() {
      this.tableHight = this.documentClientHeight - this.offsetHeight - 205
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.init()
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val
      this.init()
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val
    },
    getSort(prop) {
      this.sort = prop.prop
      this.order = prop.order
      this.init()
    },
    exportExcel() {
      this.$notify({
        title: '警告',
        message: '开始下载，请勿多次点击',
        type: 'warning'
      })
      this.$axios({
        url: this.$http.adornUrl(this.exportUrl + `?token=` + 'Bearer ' + Cookies.get('token')),
        method: 'GET',
        responseType: 'blob',
        params: {
          'json': this.getQueryString()
        }
      }).then((response) => {
        const blob = new Blob([response.data], { type: response.data.type })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        const name = decodeURI(response.headers['name'])
        let fileName = 'unknown'
        if (name) {
          fileName = decodeURI(name)
        }
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
      })
    },
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
    },
    // 预防删除第二页最后一条数据时，或者多选删除第二页的数据时，页码错误导致请求无数据
    /*   dleChangePage(size) {
      if (size === undefined) {
        size = 1
      }
      if (this.data.length === size && this.page !== 0) {
        this.page = this.page - 1
      }
    },*/
    toQuery() {
      this.pageIndex = 1
      this.init()
    }
  }
}
