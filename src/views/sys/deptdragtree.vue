<template>
  <el-container style="min-height: 800px">
    <el-aside width="500px" style="padding-top: 20px">
      <div class="left_list_box">
        <el-input
          v-model="filterText"
          placeholder="输入关键字进行过滤"/>
        <el-tree
          ref="deptTree"
          :data="treeData"
          :props="defaultProps"
          :default-expand-all="true"
          :expand-on-click-node="false"
          :highlight-current="true"
          :filter-node-method="filterNode"
          :allow-drag="allowDrag"
          class="filter-tree"
          draggable
          @node-click="handleNodeClick"
          @node-drag-start="handleDragStart"
          @node-drag-enter="handleDragEnter"
          @node-drag-leave="handleDragLeave"
          @node-drag-over="handleDragOver"
          @node-drag-end="handleDragEnd"
          @node-drop="handleDrop">
          <span slot-scope="{ node, data }" class="custom-tree-node">
            <span>{{ node.label }}</span>
            <span>
              <el-button
                type="text"
                size="mini"
                @click.stop="() => append(data)">
                <svg-icon icon-class="addition" />添加
              </el-button>
              <el-button
                v-if="node.level !== 1"
                type="text"
                size="mini"
                @click.stop="() => remove(node, data)">
                <svg-icon icon-class="shanchu2" />删除
              </el-button>
            </span>
          </span>
        </el-tree>
      </div>
    </el-aside>
    <el-main>
      <el-form ref="form" :model="form" :rules="dataRule" label-width="80px">
        <el-form-item label="组织全称" prop="fullname">
          <el-input v-model="form.fullname" clearable placeholder="请输入组织全称"/>
        </el-form-item>
        <!--        <el-form-item label="简称" prop="simplename">
                  <el-input
                    v-model="form.simplename"
                    clearable
                    placeholder="请输入简称"
                  />
                </el-form-item>
                <el-form-item label="组织类型" prop="deptType">
                  <el-input v-model="form.deptType" placeholder="组织类型" clearable/>
                </el-form-item>
                <el-form-item label="地市" prop="area">
                  <el-input v-model="form.area" placeholder="地市" clearable/>
                </el-form-item>-->
        <el-form-item label="地址" prop="adress">
          <el-input
            v-model="form.adress"
            clearable
            placeholder="地址"
          />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input
            v-model="form.phone"
            clearable
            placeholder="组织联系电话"
          />
        </el-form-item>
        <el-form-item label="排序号" prop="orderNum">
          <el-input-number v-model="form.num" :min="0" controls-position="right" label="排序号"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即更新</el-button>
          <!--<el-button>取消</el-button>-->
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>
<script>

export default {
  data() {
    return {
      filterText: '',
      treeData: [],
      group: [],
      itemOptions: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      form: {
        id: '',
        num: 0,
        deptType: '',
        area: '',
        pid: '',
        pname: '',
        simplename: '',
        fullname: '',
        adress: '',
        phone: ''
      },
      dataRule: {
        deptType: [{ required: true, message: '不能为空', trigger: 'blur' }],
        // area: [{required: true, message: '不能为空', trigger: 'blur'}],
        fullname: [{ required: true, message: '组织全称不能为空', trigger: 'blur' }]
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.deptTree.filter(val)
    }
  },
  created() {
    // this.iconList = Icon.getNameList()
    this.getTreeData()
  },
  methods: {
    append(data) {
      const newChild = { id: (new Date()).getTime(), label: '新建菜单，请在右侧修改', children: [] }
      this.$http.post(this.$http.adornUrl(`/sysdept/add`), this.$http.adornData({
        id: newChild.id,
        fullname: newChild.label,
        pid: data.id
      })
      ).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message({
            message: '添加成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
            }
          })
        } else {
          this.$message.error(data.msg)
        }
      })
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      data.children.push(newChild)
    },
    remove(node, nodeData) {
      console.log(nodeData)
      console.log(node)
      const parent = node.parent
      this.$confirm(`确定对[${node.label}]进行删除操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post(this.$http.adornUrl(`/sysdept/deleteAll/` + nodeData.id)
        ).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                const children = parent.data.children || parent.data
                const index = children.findIndex(d => d.id === nodeData.id)
                children.splice(index, 1)
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      })
    },
    handleDragStart(node, ev) {
      console.log('drag start', node)
    },
    handleDragEnter(draggingNode, dropNode, ev) {
      console.log('tree drag enter: ', dropNode.label)
    },
    handleDragLeave(draggingNode, dropNode, ev) {
      console.log('tree drag leave: ', dropNode.label)
    },
    handleDragOver(draggingNode, dropNode, ev) {
    },
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      console.log('tree drag end: ', dropNode.label)
    },
    allowDrag(draggingNode) {
      console.log('allowDrag drop: ', draggingNode)
      return draggingNode.level !== 1
    },
    handleDrop(draggingNode, dropNode, dropType, ev) {
      console.log('tree drop: ', dropNode, dropType)
      console.log('tree drop: ', dropNode.id, dropType)
      this.$http.post(this.$http.adornUrl(`/sysdept/updateNode`), this.$http.adornData({
        draggingNodeId: draggingNode.data.id,
        dropNodeId: dropNode.data.id,
        dropType: dropType
      })
      ).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
            }
          })
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    handChange(tag) {
      this.getItemOptions(tag)
    },
    handleClose(tag) {
      this.form.tagList = this.tagList.filter(el => el.id !== tag.id)
      this.group = this.group.filter(el => el !== tag.id)
    },
    onSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$http.post(this.$http.adornUrl(`/sysdept/update`), this.$http.adornData(this.form)
          ).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: '更新成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  const node = this.$refs.deptTree.getCurrentNode()
                  node.label = data.sysdept.fullname
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }
      })
    },
    handItem(tag) {
      if (this.form.tagList.find(v => v.id === tag.id)) {
        this.form.tagList = this.form.tagList.filter(el => el.id !== tag.id)
      } else {
        this.form.tagList.push(tag)
      }
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleNodeClick(treedata) {
      this.dataForm = Object.assign({})
      console.log(treedata)
      this.$http.get(this.$http.adornUrl(`/sysdept/info`), { params: this.$http.adornParams({ id: treedata.id }) }).then(({ data }) => {
        if (data && data.code === 0) {
          for (const key in data.sysdept) {
            if (data.sysdept[key]) {
              this.form[key] = data.sysdept[key]
            } else {
              this.form[key] = ''
            }
          }
        }
      })
    },
    // 图标选中
    iconActiveHandle(iconName) {
      this.form.icon = iconName
    },
    getTreeData() {
      if (!this.treeData.length) {
        this.$http.get(this.$http.adornUrl('/sysdept/depttree'))
          .then(({ data }) => {
            if (data) {
              this.treeData.push(data)
            }
          }
          )
      }
    }
  }

}
</script>
<style scoped>
  .el-tag + .el-tag {
    margin-left: 10px;
  }

  .left_list_box {
    width: 90%;
    height: 89%;
    /* max-height: 100%; */
    margin: 0 auto;
    border: 1px solid #B9C0CA;
    border-radius: 4px;
    overflow: auto;
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }

  .mod-menu__icon-list {
    max-width: 370px;
  }

</style>
