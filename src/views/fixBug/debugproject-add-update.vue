<template>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"

    :visible.sync="visible"
    :append-to-body="true"
    center>
    <el-form ref="dataForm" :rules="dataRule" :model="dataForm" :disabled="formDisabled" label-width="80px" @keyup.enter.native="dataFormSubmit()">
      <el-row>
        <!--  <el-col :span="12">
          <el-form-item label="主键id" prop="id">
            <el-input v-model="dataForm.id" placeholder="主键id" clearable/>
          </el-form-item>
        </el-col>-->
        <el-col :span="12">
          <el-form-item label="项目名" prop="name">
            <el-input v-model="dataForm.name" placeholder="项目名" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <el-input v-model="dataForm.status" placeholder="状态" clearable/>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-row>

        <el-col :span="12">
          <el-form-item label="bug总数" prop="sumBug">
            <el-input v-model="dataForm.sumBug" placeholder="bug总数" clearable/>
          </el-form-item>
        </el-col>
      </el-row>-->
      <!--<el-row>
        <el-col :span="12">
          <el-form-item label="描述" prop="marks">
            <el-input v-model="dataForm.marks" placeholder="描述" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="文件ID字符串" prop="fileIds">
            <el-input v-model="dataForm.fileIds" placeholder="文件ID字符串" clearable/>
          </el-form-item>
        </el-col>
      </el-row>-->
      <el-row>
        <el-col :span="12">
          <el-form-item label="起始时间" prop="createDate">
            <el-date-picker
              v-model="dataForm.createDate"
              clearable
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="起始时间"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="结束时间" prop="endDate">
            <el-date-picker
              v-model="dataForm.endDate"
              clearable
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="结束时间"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="项目拥有人" prop="ownPerson">
            <el-input v-model="dataForm.ownPerson" placeholder="项目拥有人" clearable/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="描述" prop="marks">
          <el-input v-model="dataForm.marks" :autosize="{ minRows: 3, maxRows: 6}" type="textarea" placeholder="描述" clearable/>
        </el-form-item>
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
        status: '',
        sumBug: '',
        marks: '',
        fileIds: '',
        createDate: '',
        endDate: '',
        ownPerson: ''
      },
      dataRule: {
        name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        ownPerson: [{ required: true, message: '不能为空', trigger: 'blur' }] }
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
          this.$http.get(this.$http.adornUrl(`/debugproject/info`), { params: this.$http.adornParams({ id: this.dataForm.id }) }).then(({ data }) => {
            if (data && data.code === 0) {
              for (const key in data.debugproject) {
                if (data.debugproject[key]) {
                  this.dataForm[key] = data.debugproject[key]
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
          this.$http.get(this.$http.adornUrl(`/debugproject/info`), { params: this.$http.adornParams({ id: this.dataForm.id }) }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm = Object.assign({})
              for (const key in data.debugproject) {
                if (data.debugproject[key]) {
                  this.dataForm[key] = data.debugproject[key]
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
            url: this.$http.adornUrl(`/debugproject/${!this.flag ? 'add' : 'update'}`),
            method: 'post',
            data: this.$http.adornData({
              'id': this.dataForm.id || undefined,
              'name': this.dataForm.name,
              'status': this.dataForm.status,
              'sumBug': this.dataForm.sumBug,
              'marks': this.dataForm.marks,
              'fileIds': this.dataForm.fileIds,
              'createDate': this.dataForm.createDate,
              'endDate': this.dataForm.endDate,
              'ownPerson': this.dataForm.ownPerson
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
