<template>
  <el-dialog
    :append-to-body="true"
    :visible.sync="visible"
    title="导入"
    width="30%"
    center>
    <el-upload
      ref="upload"
      :action="url"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-upload="beforeUploadHandle"
      :file-list="fileList"
      :auto-upload="false">
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      <div slot="tip" class="el-upload__tip">注意：只能上传Excel文件，且第一行是标题，正式的内容是从第二行开始的</div>
    </el-upload>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click=" submitUpload()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getToken } from '@/utils/auth'
export default {
  data() {
    return {
      visible: false,
      fileList: [],
      url: ''
    }
  },
  methods: {
    init() {
      this.visible = true
      this.url = this.$http.adornUrl(`/sysmenuitem/import?token=` + getToken)
      this.$refs.upload.clearFiles()
    },
    submitUpload() {
      this.$refs.upload.submit()
      this.visible = false
    },
    handleRemove(file, fileList) {
    },
    handlePreview(file) {

    },
    beforeUploadHandle(file) {
      if (!file.name.endsWith('.xls') && !file.name.endsWith('.xlsx')) {
        this.$message.error('只支持Excel格式的文件！')
        return false
      }
    }
  }
}
</script>
