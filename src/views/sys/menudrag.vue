<template>
  <el-container style="min-height: 800px">
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
                <svg-icon icon-class="delete"/>删除
              </el-button>
            </span>
          </span>
        </el-tree>
      </div>
    </el-aside>
    <el-main>
      <el-form ref="form" :model="form" :rules="dataRule" label-width="80px">
        <el-form-item label="类型：" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio-button v-for="(type, index) in form.typeList" :label="index" :key="index">{{ type }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="form.typeList[form.type] + '名称'" prop="name">
          <el-input v-model="form.name" :placeholder="form.typeList[form.type] + '名称'"/>
        </el-form-item>
        <el-form-item v-if="form.type === 1" label="菜单路由" prop="url">
          <el-input v-model="form.url" placeholder="菜单路由"/>
        </el-form-item>
        <el-form-item v-if="form.type !== 0" label="授权标识" prop="perms">
          <el-input v-model="form.perms" placeholder="多个用逗号分隔, 如: user:list,user:create"/>
        </el-form-item>
        <el-form-item v-if="form.type !== 2" label="排序号" prop="orderNum">
          <el-input-number v-model="form.orderNum" :min="0" controls-position="right" label="排序号"/>
        </el-form-item>
        <el-form-item v-if="form.type !== 2" label="菜单图标" prop="icon">
          <el-row>
            <el-col :span="12">
              <el-popover
                ref="iconListPopover"
                v-model="visible"
                placement="bottom-start"
                trigger="manual"
                popper-class="mod-menu__icon-popover"
              >
                <div class="mod-menu__icon-list" >
                  <el-button
                    v-for="(item, index) in iconList"
                    :key="index"
                    @click="iconActiveHandle(item)">
                    <svg-icon :icon-class="item" class="icon-item" class-name="disabled" />
                  </el-button>
                </div>
              </el-popover>
              <el-input
                v-model="form.icon"
                placeholder="菜单图标名称"
                @focus="visible = true"
              />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="是否启用" prop="status">
          <!--<el-input v-model="form.status" placeholder="状态" clearable></el-input>-->
          <el-radio-group v-model="form.status">
            <el-radio :label="0">禁用</el-radio>
            <el-radio :label="1">正常</el-radio>
          </el-radio-group>
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
import icons from '@/components/IconSelect/requireIcons'
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
        menuId: '',
        parentId: 0,
        name: '',
        status: '1',
        id: 0,
        type: 1,
        typeList: ['目录', '菜单', '按钮'],
        url: '',
        perms: '',
        icon: '',
        orderNum: 0
      },
      dataRule: {
        name: [{ required: true, message: '不能为空', trigger: 'blur' }]
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.menuTree.filter(val)
    }
  },
  created() {
    this.iconList = icons
    this.$nextTick(() => {
      this.getTreeData()
    })
  },
  methods: {
    append(data) {
      const newChild = { id: (new Date()).getTime(), label: '新建菜单，请在右侧修改', children: [] }
      this.$http.post(this.$http.adornUrl(`/sys/menu/add`), this.$http.adornData({
        menuId: newChild.id,
        name: newChild.label,
        parentId: data.id
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
        this.$http.post(this.$http.adornUrl(`/sys/menu/deleteAll/` + nodeData.id)
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
      this.$http.post(this.$http.adornUrl(`/sys/menu/updateNode`), this.$http.adornData({
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
    onSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$http.post(this.$http.adornUrl(`/sys/menu/update`), this.$http.adornData(this.form)
          ).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  const node = this.$refs.menuTree.getCurrentNode()
                  node.label = data.menu.name
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
    handleNodeClick(data) {
      this.$http.get(this.$http.adornUrl('/sys/menu/info/' + data.id))
        .then(({ data }) => {
          if (data && data.code === 0) {
            this.form.parentId = data.menu.parentId
            this.form.name = data.menu.name
            this.form.menuId = data.menu.menuId
            this.form.url = data.menu.url
            this.form.perms = data.menu.perms
            this.form.type = data.menu.type
            this.form.orderNum = data.menu.orderNum
            this.form.icon = data.menu.icon
            this.form.status = parseInt(data.menu.status)
          }
        }
        )
    },
    // 图标选中
    iconActiveHandle(iconName) {
      this.form.icon = iconName
      this.visible = false
    },
    test() {
    },
    getTreeData() {
      if (!this.treeData.length) {
        this.$http.get(this.$http.adornUrl('/sys/menu/all'))
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
  .icon-item {
    margin: 5px;
    font-size: 24px;
    color: #24292e;
    cursor: pointer;
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
