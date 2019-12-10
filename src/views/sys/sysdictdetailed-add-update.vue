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
          <el-form-item label="参数名" prop="paramKey">
            <el-input v-model="dataForm.paramKey" placeholder="参数名"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="参数值" prop="paramValue">
            <el-input v-model="dataForm.paramValue" placeholder="参数值"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="状态">
            <el-select v-model="dataForm.status" placeholder="状态">
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.name"
                :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="dataForm.remark" placeholder="备注" clearable/>
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
        paramKey: '',
        paramValue: '',
        status: '1',
        remark: '',
        label: '',
        labelId: ''
      },
      statusOptions: [
        { name: '启用', value: '1' },
        { name: '禁用', value: '0' }],
      dataRule: {
        paramValue: [{ required: true, message: '不能为空', trigger: 'blur' }],
        paramKey: [{ required: true, message: '不能为空', trigger: 'blur' }],
        label: [{ required: true, message: '不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    init(id, labelId) {
      id = id || ''
      this.flag = id || ''
      this.visible = true
      this.$nextTick(() => {
        this.resetForm()
        this.dataForm.labelId = labelId
        if (id) {
          this.$http.get(this.$http.adornUrl(`/sysdictdetailed/info`), { params: this.$http.adornParams({ id: id }) }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm = data.sysdictdetailed
              this.dataForm.status = data.sysdictdetailed.status + ''
            }
          })
        }
      })
    },
    show(id) {
      this.dataForm.id = id || ''
      this.formDisabled = true
      this.flag = id || ''
      this.title = '详情'
      this.visible = true
      this.$nextTick(() => {
        this.resetForm()
        if (id) {
          this.$http.get(this.$http.adornUrl(`/sysdictdetailed/info`), { params: this.$http.adornParams({ id: this.dataForm.id }) }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm = data.sysdictdetailed
            }
          })
        }
      })
    },
    resetForm() {
      this.$refs['dataForm'].resetFields()
      this.dataForm = Object.assign({
        id: '',
        paramKey: '',
        paramValue: '',
        status: '1',
        remark: '',
        label: '',
        labelId: ''
      })
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http.get(this.$http.adornUrl(`/sysdictdetailed/count`), { params: this.$http.adornParams(this.dataForm) }).then(({ data }) => {
            if (data && data.code === 0 && !data.flag) {
              this.$http({
                url: this.$http.adornUrl(`/sysdictdetailed/${!this.flag ? 'add' : 'update'}`),
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
            } else {
              this.$message.error('存在重复')
            }
          })
        }
      })
    }
  }
}
</script>
