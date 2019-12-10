<template>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
    :visible.sync="visible"
    :append-to-body="true"
    center>
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" :disabled="formDisabled" label-width="80px" @keyup.enter.native="dataFormSubmit()">
      <el-row>
        <el-col :span="12">
          <el-form-item label="Id" prop="id">
            <el-input v-model="dataForm.id" placeholder="Id" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Num" prop="num">
            <el-input v-model="dataForm.num" placeholder="Num" clearable/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="Pid" prop="pid">
            <el-input v-model="dataForm.pid" placeholder="Pid" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Pids" prop="pids">
            <el-input v-model="dataForm.pids" placeholder="Pids" clearable/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="简称" prop="simplename">
            <el-input v-model="dataForm.simplename" placeholder="简称" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="全称" prop="fullname">
            <el-input v-model="dataForm.fullname" placeholder="全称" clearable/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="Tips" prop="tips">
            <el-input v-model="dataForm.tips" placeholder="Tips" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Version" prop="version">
            <el-input v-model="dataForm.version" placeholder="Version" clearable/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="项目ID" prop="projectId">
            <el-input v-model="dataForm.projectId" placeholder="项目ID" clearable/>
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
        num: '',
        pid: '',
        pids: '',
        simplename: '',
        fullname: '',
        tips: '',
        version: '',
        projectId: ''
      },
      dataRule: {
        num: [{ required: true, message: '不能为空', trigger: 'blur' }],
        pid: [{ required: true, message: '不能为空', trigger: 'blur' }],
        pids: [{ required: true, message: '不能为空', trigger: 'blur' }],
        simplename: [{ required: true, message: '不能为空', trigger: 'blur' }],
        fullname: [{ required: true, message: '不能为空', trigger: 'blur' }],
        tips: [{ required: true, message: '不能为空', trigger: 'blur' }],
        version: [{ required: true, message: '不能为空', trigger: 'blur' }],
        projectId: [{ required: true, message: '不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    init(id) {
      this.dataForm.id = id || ''
      this.flag = id || ''
      this.formDisabled = false
      this.title = (id ? '修改' : '新增')
      this.visible = true
      this.$nextTick(() => {
        if (this.dataForm.id) {
          this.$http.get(this.$http.adornUrl(`/debugmodule/info`), { params: this.$http.adornParams({ id: this.dataForm.id }) }).then(({ data }) => {
            if (data && data.code === 0) {
              for (const key in data.debugmodule) {
                if (data.debugmodule[key]) {
                  this.dataForm[key] = data.debugmodule[key]
                } else {
                  this.dataForm[key] = ''
                }
              }
            }
          })
        } else {
          this.dataForm = Object.assign({})
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
        if (this.dataForm.id) {
          this.$http.get(this.$http.adornUrl(`/debugmodule/info`), { params: this.$http.adornParams({ id: this.dataForm.id }) }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm = Object.assign({})
              for (const key in data.debugmodule) {
                if (data.debugmodule[key]) {
                  this.dataForm[key] = data.debugmodule[key]
                }
              }
            }
          })
        } else {
          this.dataForm = Object.assign({})
        }
      })
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/debugmodule/${!this.flag ? 'add' : 'update'}`),
            method: 'post',
            data: this.$http.adornData({
              'id': this.dataForm.id || undefined,
              'num': this.dataForm.num,
              'pid': this.dataForm.pid,
              'pids': this.dataForm.pids,
              'simplename': this.dataForm.simplename,
              'fullname': this.dataForm.fullname,
              'tips': this.dataForm.tips,
              'version': this.dataForm.version,
              'projectId': this.dataForm.projectId
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
