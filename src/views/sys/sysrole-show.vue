<template>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
    :visible.sync="visible"
    :append-to-body="true"
    center>
    <el-form ref="dataForm" :rules="dataRule" :model="dataForm" :disabled="formDisabled" label-width="80px" >
      <el-row>
        <el-col >
          <el-form-item label="角色名称:" prop="roleName">
            <span>{{ dataForm.roleName }} </span>
          </el-form-item>
        </el-col>
      </el-row>
      <!--      <el-divider></el-divider>-->
      <el-row>
        <el-col :span="12">
          <el-form-item label="备注:" prop="remark">
            <span>{{ dataForm.remark }} </span>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item label="创建者ID:" prop="createUserId">
            <span>{{ dataForm.createUserId }} </span>
          </el-form-item>
        </el-col>-->
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="创建时间:" prop="createTime">
            <span>{{ dataForm.createTime }} </span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item size="mini" label="授权">
        <el-tree
          ref="menuListTree"
          :data="menuList"
          :props="menuListTreeProps"
          :default-expand-all="true"
          node-key="menuId"
          check-strictly
          show-checkbox
          @node-click="handleNodeClick"/>
      </el-form-item>
    </el-form>
    <span v-if="!formDisabled" slot="footer" class="dialog-footer">
      <el-button @click="visible = false">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { treeDataTranslate } from '@/utils'
export default {
  data() {
    return {
      visible: false,
      flag: '',
      menuList: [],
      menuListTreeProps: {
        label: 'name',
        children: 'children'
      },
      title: '',
      id: '',
      tempKey: -666666, // 临时key, 用于解决tree半选中状态项不能传给后台接口问题. # 待优化
      formDisabled: false,
      dataForm: {
        roleId: '',
        roleName: '',
        remark: '',
        createUserId: '',
        createTime: ''
      },
      dataRule: {
      }
    }
  },
  methods: {
    show(id) {
      this.id = id || ''
      this.flag = id || ''
      this.title = '详情'
      this.visible = true

      this.$http({
        url: this.$http.adornUrl('/sys/menu/list'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.menuList = treeDataTranslate(data, 'menuId')
      }).then(() => {
        this.visible = true
        this.$nextTick(() => {
          this.resetForm()
          this.$refs.menuListTree.setCheckedKeys([])
        })
      }).then(() => {
        this.$nextTick(() => {
          if (this.id) {
            this.$http.get(this.$http.adornUrl(`/sysrole/info/${this.id}`)).then(({ data }) => {
              if (data && data.code === 0) {
                this.dataForm = data.role
                const idx = data.role.menuIdList.indexOf(this.tempKey)
                if (idx !== -1) {
                  data.role.menuIdList.splice(idx, data.role.menuIdList.length - idx)
                }
                this.$refs.menuListTree.setCheckedKeys(data.role.menuIdList)
              }
            })
          }
        })
      })
    },
    handleNodeClick(data, node, tree) {
      if (node.checked) {
        this.$refs.menuListTree.setChecked(data, false, true)
      } else {
        this.$refs.menuListTree.setChecked(data, true, true)
      }
    },
    resetForm() {
      this.$refs['dataForm'].resetFields()
      this.dataForm = Object.assign({
        roleId: '',
        roleName: '',
        remark: '',
        createUserId: '',
        createTime: ''
      })
    }
  }
}
</script>
