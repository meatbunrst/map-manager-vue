<template>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
    :visible.sync="visible"
    :append-to-body="true"
    center>
    <el-form ref="dataForm" :rules="dataRule" :model="dataForm" :disabled="formDisabled" label-width="80px" >
      <el-row>
        <el-col :span="12">
          <el-form-item label="主键ID" prop="id">
            <span>{{ dataForm.id }} </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="名称" prop="name">
            <span>{{ dataForm.name }} </span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="排序" prop="menuSort">
            <span>{{ dataForm.menuSort }} </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="系统id" prop="sysId">
            <span>{{ dataForm.sysId }} </span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="权限标识" prop="permission">
            <span>{{ dataForm.permission }} </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="MenuType" prop="menuType">
            <span>{{ dataForm.menuType }} </span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="连接href" prop="meenuHref">
            <span>{{ dataForm.meenuHref }} </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="评论" prop="remarks">
            <span>{{ dataForm.remarks }} </span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="创建时间" prop="createTime">
            <span>{{ dataForm.createTime }} </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="更新时间" prop="updateTime">
            <span>{{ dataForm.updateTime }} </span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span v-if="!formDisabled" slot="footer" class="dialog-footer">
      <el-button @click="visible = false">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      flag: '',
      title: '',
      formDisabled: false,
      dataForm: {
        id: '',
        name: '',
        menuSort: '',
        sysId: '',
        permission: '',
        menuType: '',
        meenuHref: '',
        remarks: '',
        createTime: '',
        updateTime: ''
      },
      dataRule: {
      }
    }
  },
  methods: {
    show(id) {
      id = id || ''
      this.flag = id || ''
      this.title = '详情'
      this.visible = true
      this.$nextTick(() => {
        this.resetForm()
        if (this.id) {
          this.$http.get(this.$http.adornUrl(`/sysmenuitem/info`), { params: this.$http.adornParams({ id: id }) }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm = data.sysmenuitem
            }
          })
        }
      })
    },
    resetForm() {
      this.$refs['dataForm'].resetFields()
      this.dataForm = Object.assign({
        id: '',
        name: '',
        menuSort: '',
        sysId: '',
        permission: '',
        menuType: '',
        meenuHref: '',
        remarks: '',
        createTime: '',
        updateTime: ''
      })
    }
  }
}
</script>
