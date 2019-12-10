<template>
  <div>
    <div ref="editor" style="text-align:left;margin: 5px">
      <h3 style="text-align: center;">欢迎使用 wangEditor 富文本编辑器!</h3>
      <ul>
        <li>富文本中图片上传使用的是sm.ms图床，支持上传到七牛云：<a style="color: #42b983" target="_blank" href="https://sm.ms/">sm.ms</a></li>
        <li>更多帮助请查看官方文档：<a style="color: #42b983" target="_blank" href="https://www.kancloud.cn/wangfupeng/wangeditor3/332599">wangEditor</a></li>
      </ul>
    </div>
    <div style="margin: 12px 5px;font-size: 16px;font-weight: bold;color: #696969">HTML渲染如下：</div>
    <div class="editor-content" v-html="editorContent"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import E from 'wangeditor'
import { getToken } from '@/utils/auth'
export default {
  data() {
    return {
      headers: {
        'token': 'Bearer ' + getToken()
      },
      editorContent:
        `<h3 style="text-align: center;">欢迎使用 wangEditor 富文本编辑器!</h3>
        <ul>
          <li>富文本中图片上传使用的是sm.ms图床，支持上传到七牛云：<a style="color: #42b983" target="_blank" href="https://sm.ms/">sm.ms</a></li>
          <li>更多帮助请查看官方文档：<a style="color: #42b983" target="_blank" href="https://www.kancloud.cn/wangfupeng/wangeditor3/332599">wangEditor</a></li>
        </ul>`
    }
  },
  computed: {
    ...mapGetters([
      'imagesUploadApi'
    ])
  },
  mounted() {
    const editor = new E(this.$refs.editor)
    const self = this
    editor.customConfig.uploadImgShowBase64 = true // 使用 base64 保存图片
    // 不可修改
    editor.customConfig.uploadImgHeaders = this.headers
    // 自定义文件名，不可修改，修改后会上传失败
    editor.customConfig.uploadFileName = 'file'
    editor.customConfig.uploadImgServer = this.imagesUploadApi // 上传图片到服务器
    editor.customConfig.onchange = (html) => {
      this.editorContent = html
    }
    editor.customConfig.uploadImgHooks = {
      success: function(xhr, editor, result) {
        // 图片上传并返回结果，图片插入成功之后触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
      },
      fail: function(xhr, editor, result) {
        // 图片上传并返回结果，但图片插入错误时触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
      },
      error: function(xhr, editor) {
        // 图片上传出错时触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
      },
      timeout: function(xhr, editor) {
        // 图片上传超时时触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
      },

      // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
      // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
      customInsert: function(insertImg, result, editor) {
        // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
        // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果

        // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
        // const url = result.url
        const url = self.$http.adornUrl(`/batchattach/viewImage?id=` + result.batch.battchId + `&token=` + 'Bearer ' + getToken())
        insertImg(url)
        // console.log(result)
        // result 必须是一个 JSON 格式字符串！！！否则报错
      }
    }
    editor.create()
  }
}
</script>

<style scoped>
  .editor-content{
    padding-left: 5px;
  }
</style>
