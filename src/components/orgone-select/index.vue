<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="visibleDept"
    :append-to-body="true"
    title="分配部门"
    width="400px"
    center
  >
    <el-input
      v-model="filterText"
      placeholder="输入关键字进行过滤"/>
    <el-tree
      ref="dept_tree"
      :data="treeData"
      :props="defaultProps"
      :filter-node-method="filterNode"
      class="filter-tree"
      default-expand-all
      @node-click="handleNodeClick"
    />
  </el-dialog>
</template>
<script>
export default {
  name: 'OrgSelect',
  props: {
    /* append: Boolean*/
  },
  data() {
    return {
      visibleDept: false,
      filterText: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      treeData: []
    }
  },
  watch: {
    filterText(val) {
      this.$refs.dept_tree.filter(val)
    }
  },
  methods: {
    init() {
      this.visibleDept = true
      this.getTreeData()
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleNodeClick(data, node, self) {
      this.$emit('getDeptOneSelectData', data)
      this.visibleDept = false
    },
    getTreeData() {
      this.$http.get(this.$http.adornUrl('/sysdept/depttree'))
        .then(({ data }) => {
          if (data) {
            this.treeData = []
            this.treeData.push(data)
          }
        }
        )
    }
  }
}
</script>

