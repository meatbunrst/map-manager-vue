<template>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
    :visible.sync="visible"
    :append-to-body="true"
    center>
    <el-form
      ref="dataForm"
      :rules="dataRule"
      :model="dataForm"
      :disabled="formDisabled"
      label-width="80px"
      @keyup.enter.native="dataFormSubmit()">
      <el-row>
        <el-col :span="12">
          <el-form-item label="字典名" prop="dictName">
            <el-input v-model="dataForm.dictName" placeholder="字典名" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="描述" prop="remark">
            <el-input v-model="dataForm.remark" placeholder="描述" clearable/>
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
        dictName: '',
        remark: ''
      },
      dataRule: {
        dictName: [{ required: true, message: '不能为空', trigger: 'blur' }],
        remark: [{ required: true, message: '不能为空', trigger: 'blur' }]
      }
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
          this.$http.get(this.$http.adornUrl(`/sysdict/info`), { params: this.$http.adornParams({ id: id }) }).then(({ data }) => {
            if (data && data.code === 0) {
              for (const key in data.sysdict) {
                if (data.sysdict[key]) {
                  this.dataForm[key] = data.sysdict[key]
                }
              }
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
        if (id) {
          this.$http.get(this.$http.adornUrl(`/sysdict/info`), { params: this.$http.adornParams({ id: id }) }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm = Object.assign({})
              for (const key in data.sysdict) {
                if (data.sysdict[key]) {
                  this.dataForm[key] = data.sysdict[key]
                }
              }
            }
          })
        }
      })
    },
    resetForm() {
      this.$refs['dataForm'].resetFields()
      this.dataForm = Object.assign({
        id: '',
        dictName: '',
        remark: ''
      })
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/sysdict/${!this.flag ? 'add' : 'update'}`),
            method: 'post',
            data: this.$http.adornData({
              'id': this.dataForm.id || undefined,
              'dictName': this.dataForm.dictName,
              'remark': this.dataForm.remark
            })
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
