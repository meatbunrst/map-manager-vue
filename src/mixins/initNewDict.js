export default {
  data() {
    return {
      dicts: [], dictMap: {}
    }
  },
  methods: {
    async getDict(name) {
      this.$http.get(this.$http.adornUrl('/sysdictdetailed/dictDetail'), { params: this.$http.adornParams({ name: name }) })
        .then(({ data }) => {
          if (data && data.code === 0) {
            this.dicts = data.list
          }
        })
    },
    // 多个字典查询时使用逗号拼接， 如：
    // 加载多个数据字典，如何调用如下：
    // this.getDict('user_status,job_status')
    // 在vue中使用加载出来的字典：
    // dictMap.[字典名称] 如：dictMap.user_status、 dictMap.job_status
    async getDictMap(names) {
      // 优先放入到dictMap中，避免页面加载时 undefined
      const arr = names.split(',')
      for (let i = 0; i < arr.length; i++) {
        this.dictMap[arr[i]] = []
      }
      this.$http.get(this.$http.adornUrl('/sysdictdetailed/dictDetail/map'), { params: this.$http.adornParams({ name: names }) })
        .then(({ data }) => {
          if (data && data.code === 0) {
            this.dictMap = data.map
          }
        })
    },
    getMapName(list, value) {
      if (list && value) {
        for (let i = 0; i < list.length; i++) {
          if (list[i].paramValue === value.toString()) {
            return list[i].paramKey
          }
        }
      } else {
        return false
      }
    },
    getMapLabelName(list, value) {
      if (list && value) {
        for (let i = 0; i < list.length; i++) {
          if (list[i].paramValue === value.toString()) {
            return list[i].paramKey
          }
        }
      } else {
        return false
      }
    }

  }
}
