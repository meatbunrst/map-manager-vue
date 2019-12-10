<template>
  <el-dialog
    :visible.sync="visible"
    :fullscreen="true"
    :append-to-body="true"
    title="创建模板"
    center>
    <el-container style="min-height: 600px">
      <el-aside width="450px" style="padding-top: 20px">
        <div class="left_list_box">
          <el-input
            v-model="filterText"
            placeholder="输入关键字进行过滤"/>
          <el-tree
            ref="menuTree"
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
                  <svg-icon icon-class="delete"/>删除
                </el-button>
              </span>
            </span>
          </el-tree>
        </div>
      </el-aside>
      <el-main>
        <el-form ref="form" :model="form" :rules="dataRule" label-width="80px">
          <el-form-item label="全称" prop="fullname">
            <el-input v-model="form.fullname" placeholder="全称" clearable/>
          </el-form-item>
          <el-form-item label="备注" prop="tips">
            <el-input v-model="form.tips" placeholder="Tips" clearable/>
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
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click=" submitUpload()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      filterText: '',
      treeData: [],
      menuTypeOptions: [],
      group: [],
      iconList: [],
      itemOptions: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      form: {
        id: '',
        num: '',
        pid: '',
        pids: '',
        projectId: '',
        fullname: '',
        tips: '',
        version: ''
      },
      dataRule: {
        name: [{ required: true, message: '不能为空', trigger: 'blur' }]
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.menuTree.filter(val)
      this.getTreeData(this.form.projectId)
    }
  },
  methods: {
    init(id) {
      this.form.projectId = id || ''
      this.visible = true
      this.getTreeData(id)
    },
    append(data) {
      const newChild = { id: (new Date()).getTime(), label: '新建模块，请在右侧修改', children: [] }
      console.log(this.form)
      this.$http.post(this.$http.adornUrl(`/debugmodule/add`), this.$http.adornData({
        id: newChild.id,
        projectId: this.form.projectId,
        fullname: newChild.label,
        pid: data.id
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
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      data.children.push(newChild)
    },
    remove(node, nodeData) {
      const parent = node.parent
      this.$confirm(`确定对[${node.label}]进行删除操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post(this.$http.adornUrl(`/debugmodule/deleteAll/` + nodeData.id)
        ).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
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
    allowDrag(draggingNode) {
      console.log('allowDrag drop: ', draggingNode)
      return draggingNode.level !== 1
    },
    handleDrop(draggingNode, dropNode, dropType, ev) {
      console.log('tree drop: ', dropNode, dropType)
      console.log('tree drop: ', dropNode.id, dropType)
      this.$http.post(this.$http.adornUrl(`/debugmodule/updateNode`), this.$http.adornData({
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
    handleClose(tag) {
      this.form.tagList = this.tagList.filter(el => el.id !== tag.id)
      this.group = this.group.filter(el => el !== tag.id)
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleNodeClick(data) {
      this.$http.get(this.$http.adornUrl('/debugmodule/info?id=' + data.id))
        .then(({ data }) => {
          if (data && data.code === 0) {
            for (const key in data.debugmodule) {
              if (data.debugmodule[key]) {
                this.form[key] = data.debugmodule[key]
              } else {
                this.form[key] = ''
              }
            }
          }
        }
        )
    },
    getTreeData(id) {
      if (!this.treeData.length) {
        this.$http.get(this.$http.adornUrl('/debugproject/tree'), { params: this.$http.adornParams({ id: id }) })
          .then(({ data }) => {
            if (data) {
              this.treeData.push(data)
            }
          })
      }
    },
    onSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$http.post(this.$http.adornUrl(`/debugmodule/update`), this.$http.adornData(this.form)
          ).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  const node = this.$refs.menuTree.getCurrentNode()
                  node.label = data.module.fullname
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }
      })
    },
    beforeUploadHandle(file) {
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
