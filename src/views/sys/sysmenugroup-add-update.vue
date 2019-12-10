<template>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
    :visible.sync="visible"
    :append-to-body="true"
    center>
    <el-form ref="dataForm" :rules="dataRule" :model="dataForm" :disabled="formDisabled" label-width="80px" @keyup.enter.native="dataFormSubmit()">
      <el-row>
        <el-col :span="12">
          <el-form-item label="主键ID" prop="id">
            <el-input v-model="dataForm.id" placeholder="主键ID" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="名称" prop="name">
            <el-input v-model="dataForm.name" placeholder="名称" clearable/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="简称" prop="code">
            <el-input v-model="dataForm.code" placeholder="简称" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="创建日期" prop="createTime">
            <el-date-picker
              v-model="dataForm.createTime"
              clearable
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="创建日期"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="更新日期" prop="updateTime">
            <el-date-picker
              v-model="dataForm.updateTime"
              clearable
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="更新日期"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="评论" prop="remarks">
            <el-input v-model="dataForm.remarks" placeholder="评论" clearable/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span v-if="!formDisabled" slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
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
        code: '',
        createTime: '',
        updateTime: '',
        remarks: ''
      },
      dataRule: {
        name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '不能为空', trigger: 'blur' }],
        createTime: [{ required: true, message: '不能为空', trigger: 'blur' }],
        updateTime: [{ required: true, message: '不能为空', trigger: 'blur' }],
        remarks: [{ required: true, message: '不能为空', trigger: 'blur' }] }
    }
  },
  methods: {
    init(id) {
      id = id || ''
      this.flag = id || ''
      this.formDisabled = false
      this.title = (id ? '修改' : '新增')
      this.visible = true
      this.$nextTick(() => {
        this.resetForm()
        if (id) {
          this.$http.get(this.$http.adornUrl(`/sysmenugroup/info`), { params: this.$http.adornParams({ id: id }) }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm = data.sysmenugroup
            }
          })
        }
      })
    },
    show(id) {
      id = id || ''
      this.formDisabled = true
      this.flag = id || ''
      this.title = '详情'
      this.visible = true
      this.$nextTick(() => {
        this.resetForm()
        if (this.id) {
          this.$http.get(this.$http.adornUrl(`/sysmenugroup/info`), { params: this.$http.adornParams({ id: id }) }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm = data.sysmenugroup
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
        code: '',
        createTime: '',
        updateTime: '',
        remarks: ''
      })
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/sysmenugroup/${!this.flag ? 'add' : 'update'}`),
            method: 'post',
            data: this.$http.adornData(this.dataForm)
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }
      })
    }
  }
}
</script>
