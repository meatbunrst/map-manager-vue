<template>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
    :visible.sync="visible"
    :append-to-body="true"
    center>
    <el-form ref="dataForm" :rules="dataRule" :model="dataForm" :disabled="formDisabled" label-width="120px" >
      <el-row>
        <el-col :span="12">
          <el-form-item label="Id" prop="id">
            <span>{{ dataForm.id }} </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户名" prop="username">
            <span>{{ dataForm.username }} </span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>

        <el-col :span="12">
          <el-form-item label="用户操作" prop="operation">
            <span>{{ dataForm.operation }} </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="执行时长(毫秒)" prop="time">
            <span>{{ dataForm.time }} </span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="IP地址" prop="ip">
            <span>{{ dataForm.ip }} </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="创建时间" prop="createDate">
            <span>{{ dataForm.createDate }} </span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col >
          <el-form-item label="请求参数" prop="params">
            <span>{{ dataForm.params }} </span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col >
          <el-form-item label="请求方法" prop="method">
            <span>{{ dataForm.method }} </span>
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
        username: '',
        operation: '',
        method: '',
        params: '',
        time: '',
        ip: '',
        createDate: ''
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
      this.$nextTick(() => {
        this.resetForm()
        if (this.id) {
          this.$http.get(this.$http.adornUrl(`/syslog/info`), { params: this.$http.adornParams({ id: id }) }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm = data.syslog
            }
          })
        }
      })
    },
    resetForm() {
      this.$refs['dataForm'].resetFields()
      this.dataForm = Object.assign({
        id: '',
        username: '',
        operation: '',
        method: '',
        params: '',
        time: '',
        ip: '',
        createDate: ''
      })
    }
  }
}
</script>
