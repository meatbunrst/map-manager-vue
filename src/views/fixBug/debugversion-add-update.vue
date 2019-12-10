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
          <el-form-item label="编号" prop="id">
            <el-input v-model="dataForm.id" placeholder="编号" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="迭代名称" prop="name">
            <el-input v-model="dataForm.name" placeholder="迭代名称" clearable/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="迭代代号" prop="code">
            <el-input v-model="dataForm.code" placeholder="迭代代号" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开始日期" prop="startDate">
            <el-date-picker
              v-model="dataForm.startDate"
              clearable
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="开始日期"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="结束日期" prop="endDate">
            <el-date-picker
              v-model="dataForm.endDate"
              clearable
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="结束日期"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="可用工作日" prop="sumWorkday">
            <el-input v-model="dataForm.sumWorkday" placeholder="可用工作日" clearable/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="迭代类型" prop="status">
            <el-input v-model="dataForm.status" placeholder="迭代类型" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="创建时间" prop="createDate">
            <el-date-picker
              v-model="dataForm.createDate"
              clearable
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="创建时间"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="创建人" prop="createBy">
            <el-input v-model="dataForm.createBy" placeholder="创建人" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="关联项目ID" prop="projectId">
            <el-input v-model="dataForm.projectId" placeholder="关联项目ID" clearable/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="描述" prop="describe">
            <el-input v-model="dataForm.describe" placeholder="描述" clearable/>
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
        startDate: '',
        endDate: '',
        sumWorkday: '',
        status: '',
        createDate: '',
        createBy: '',
        projectId: '',
        describe: ''
      },
      dataRule: {
        name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '不能为空', trigger: 'blur' }],
        startDate: [{ required: true, message: '不能为空', trigger: 'blur' }],
        endDate: [{ required: true, message: '不能为空', trigger: 'blur' }],
        sumWorkday: [{ required: true, message: '不能为空', trigger: 'blur' }],
        status: [{ required: true, message: '不能为空', trigger: 'blur' }],
        createDate: [{ required: true, message: '不能为空', trigger: 'blur' }],
        createBy: [{ required: true, message: '不能为空', trigger: 'blur' }],
        projectId: [{ required: true, message: '不能为空', trigger: 'blur' }],
        describe: [{ required: true, message: '不能为空', trigger: 'blur' }]
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
          this.$http.get(this.$http.adornUrl(`/debugversion/info`), { params: this.$http.adornParams({ id: this.dataForm.id }) }).then(({ data }) => {
            if (data && data.code === 0) {
              for (const key in data.debugversion) {
                if (data.debugversion[key]) {
                  this.dataForm[key] = data.debugversion[key]
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
          this.$http.get(this.$http.adornUrl(`/debugversion/info`), { params: this.$http.adornParams({ id: this.dataForm.id }) }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm = Object.assign({})
              for (const key in data.debugversion) {
                if (data.debugversion[key]) {
                  this.dataForm[key] = data.debugversion[key]
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
            url: this.$http.adornUrl(`/debugversion/${!this.flag ? 'add' : 'update'}`),
            method: 'post',
            data: this.$http.adornData({
              'id': this.dataForm.id || undefined,
              'name': this.dataForm.name,
              'code': this.dataForm.code,
              'startDate': this.dataForm.startDate,
              'endDate': this.dataForm.endDate,
              'sumWorkday': this.dataForm.sumWorkday,
              'status': this.dataForm.status,
              'createDate': this.dataForm.createDate,
              'createBy': this.dataForm.createBy,
              'projectId': this.dataForm.projectId,
              'describe': this.dataForm.describe
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
