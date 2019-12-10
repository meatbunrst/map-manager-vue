<template>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
    :visible.sync="visible"
    :fullscreen="true"
    :append-to-body="true"
    center>
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" :disabled="formDisabled" label-width="80px" @keyup.enter.native="dataFormSubmit()" >
      <el-row>
        <el-col :span="24">
          <el-form-item label="标题" prop="title">
            <el-input v-model="dataForm.title" placeholder="请输入标题" clearable/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="项目" prop="projectId">
            <el-select
              v-model="dataForm.projectId"
              :remote-method="remoteMethod"
              :loading="loading"
              filterable
              remote
              reserve-keyword
              style="width: 100%"
              placeholder="请输入关键词"
              @change="selectProject">
              <el-option
                v-for="item in projectList"
                :key="item.value"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="模块" prop="moduleId">
            <el-select
              v-model="dataForm.moduleId"
              :remote-method="remoteProject"
              :loading="loading"
              filterable
              remote
              reserve-keyword
              style="width: 100%"
              placeholder="请输入关键词">
              <el-option
                v-for="item in moduleList"
                :key="item.id"
                :label="item.fullname"
                :value="item.id"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="指派用户" prop="userId">
            <el-select
              v-model="dataForm.userId"
              :remote-method="remoteUser"
              :loading="loading"
              filterable
              remote
              reserve-keyword
              style="width: 100%"
              placeholder="请输入关键词">
              <el-option
                v-for="item in userList"
                :key="item.userId"
                :label="item.accountName"
                :value="item.userId"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="版本id" prop="versionId">
            <el-input v-model="dataForm.versionId" placeholder="版本id" clearable/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="类型" prop="type">
            <el-radio-group v-model="dataForm.type">
              <el-radio-button v-for="(item,index) in dictMap.bug_type" :key="index" :label="item.paramValue">{{ item.paramKey }}</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="优先级" prop="priority">
            <el-radio-group v-model="dataForm.priority">
              <el-radio-button v-for="(item,index) in dictMap.bug_priority" :key="index" :label="item.paramValue">{{ item.paramKey }}
              </el-radio-button>
            </el-radio-group>
            <!--            <el-input v-model="dataForm.priority" placeholder="优先级" clearable/>-->
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="严重程度" prop="level">
            <el-radio-group v-model="dataForm.level">
              <el-radio-button v-for="(item,index) in dictMap.bug_level" :key="index" :label="item.paramValue">{{ item.paramKey }}
              </el-radio-button>
            </el-radio-group>
            <!--            <el-input v-model="dataForm.level" placeholder="严重程度" clearable/>-->
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="关键词" prop="keyWork">
            <el-input v-model="dataForm.keyWork" placeholder="关键词" clearable/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="截止日期" prop="endDate">
            <el-date-picker
              v-model="dataForm.endDate"
              clearable
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="截止日期"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row/>
    </el-form>
    <div ref="editor" style="text-align:left;margin: 5px" v-html="editorContent">
      <h3 style="text-align: center;">bug详情</h3>
      <ul>
        <li>细节描述：</li>
        <li>更多帮助请查看官方文档：<a style="color: #42b983" target="_blank" href="https://www.kancloud.cn/wangfupeng/wangeditor3/332599">wangEditor</a></li>
      </ul>
    </div>
    <span v-if="!formDisabled" slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import E from 'wangeditor'
import { getToken } from '@/utils/auth'
import initDict from '@/mixins/initNewDict'

export default {
  mixins: [initDict],
  data() {
    return {
      visible: false,
      flag: '',
      loading: false,
      ifCreated: false,
      title: '',
      formDisabled: false,
      restaurants: [],
      projectList: [],
      userList: [],
      moduleList: [],
      editor: {},
      editorContent:
        `<h3 style="text-align: center;">bug详情</h3>
        <ul>
          <li>其他的显示2</a></li>
          <li>更多帮助请查看官方文档：<a style="color: #42b983" target="_blank" href="https://www.kancloud.cn/wangfupeng/wangeditor3/332599">wangEditor</a></li>
        </ul>`,
      dataForm: {
        id: '',
        title: '1',
        moduleId: '1',
        projectId: '1',
        userId: '1',
        versionId: '1',
        type: '1',
        priority: '1',
        level: '1',
        keyWork: '1',
        endDate: '',
        content: '',
        fileIds: '',
        createBy: '',
        createDate: ''
      },
      headers: {
        'token': 'Bearer ' + getToken()
      },
      dataRule: {
        title: [{ required: true, message: '不能为空', trigger: 'blur' }],
        moduleId: [{ required: true, message: '不能为空', trigger: 'blur' }],
        projectId: [{ required: true, message: '不能为空', trigger: 'blur' }],
        userId: [{ required: true, message: '不能为空', trigger: 'blur' }],
        endDate: [{ required: true, message: '不能为空', trigger: 'blur' }],
        versionId: [{ required: true, message: '不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'imagesUploadApi'
    ])
  },
  mounted() {
    this.restaurants = this.loadAll()
    this.loadProject()
    this.getDictMap('bug_priority,bug_level,bug_type')
  },
  methods: {
    loadAll() {
      return [
        { 'value': '南拳妈妈龙虾盖浇饭', 'address': '普陀区金沙江路1699号鑫乐惠美食广场A13' }
      ]
    },
    loadProject() {
      this.$http.get(this.$http.adornUrl(`/debugproject/all`)).then(({ data }) => {
        if (data && data.code === 0) {
          this.projectList = data.all
        }
      })
    },
    editorCreate() {
      if (!this.ifCreated) {
        const editorVue = this.$refs.editor
        this.editor = new E(editorVue)
        const self = this
        this.editor.customConfig.uploadImgShowBase64 = true // 使用 base64 保存图片
        // 不可修改
        this.editor.customConfig.uploadImgHeaders = this.headers
        // 自定义文件名，不可修改，修改后会上传失败
        this.editor.customConfig.uploadFileName = 'file'
        this.editor.customConfig.uploadImgServer = this.imagesUploadApi // 上传图片到服务器
        this.editor.customConfig.onchange = (html) => {
          this.dataForm.content = html
        }
        this.editor.customConfig.uploadImgHooks = {
          customInsert: function(insertImg, result, editor) {
            const url = self.$http.adornUrl(`/batchattach/viewImage?id=` + result.batch.battchId + `&token=` + 'Bearer ' + getToken())
            insertImg(url)
          }
        }
        this.editor.create()
        this.ifCreated = true
      }
    },
    init(id) {
      this.id = id || ''
      this.flag = id || ''
      this.formDisabled = false
      this.title = (id ? '修改' : '新增')
      this.visible = true
      this.$nextTick(() => {
        this.resetForm()
        this.editorCreate()
        if (this.id) {
          this.$http.get(this.$http.adornUrl(`/debugdetailed/info`), { params: this.$http.adornParams({ id: id }) }).then(({ data }) => {
            if (data && data.code === 0) {
              for (const key in data.debugdetailed) {
                if (data.debugdetailed[key]) {
                  this.dataForm[key] = data.debugdetailed[key]
                }
              }
              this.editor.txt.html(data.debugdetailed.content)
            }
          })
        } else {
          this.editor.txt.html(this.editorContent)
        }
      })
    },
    selectProject(queryString) {
      this.$http.get(this.$http.adornUrl(`/debugmodule/all`), { params: this.$http.adornParams({ projectId: queryString }) }).then(({ data }) => {
        if (data && data.code === 0) {
          this.moduleList = data.all
        }
      })
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.projectList = this.list.filter(item => {
            return item.name.toLowerCase()
              .includes(query.toLowerCase())
          })
        }, 200)
      } else {
        this.options = []
      }
    },
    remoteProject(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.projectList = this.list.filter(item => {
            return item.name.toLowerCase()
              .includes(query.toLowerCase())
          })
        }, 200)
      } else {
        this.options = []
      }
    },
    remoteUser(query) {
      if (query !== '') {
        this.loading = true
        this.$http.get(this.$http.adornUrl(`/systemuser/listModel`), { params: this.$http.adornParams({ username: query }) }).then(({ data }) => {
          if (data && data.code === 0) {
            this.userList = data.page.list
            setTimeout(() => {
              this.loading = false
              this.userList = this.list.filter(item => {
                return item.name.toLowerCase()
                  .includes(query.toLowerCase())
              })
            }, 200)
          }
        })
      } else {
        this.options = []
      }
    },
    resetForm() {
      this.$refs['dataForm'].resetFields()
      this.dataForm = Object.assign({
        id: '',
        title: '1',
        moduleId: '1',
        projectId: '1',
        userId: '1',
        versionId: '1',
        type: '1',
        priority: '1',
        level: '1',
        keyWork: '1',
        endDate: '',
        content: '',
        fileIds: '',
        createBy: '',
        createDate: '' })
    },
    handleSelect(item) {
      this.dataForm.projectId = item.name
      this.$refs['dataForm'].validateField('projectId', (phoneError) => {
      })
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/debugdetailed/${!this.flag ? 'add' : 'update'}`),
            method: 'post',
            data: this.$http.adornData({
              'id': this.dataForm.id || undefined,
              'title': this.dataForm.title,
              'moduleId': this.dataForm.moduleId,
              'projectId': this.dataForm.projectId,
              'userId': this.dataForm.userId,
              'versionId': this.dataForm.versionId,
              'type': this.dataForm.type,
              'priority': this.dataForm.priority,
              'level': this.dataForm.level,
              'keyWork': this.dataForm.keyWork,
              'endDate': this.dataForm.endDate,
              'content': this.dataForm.content,
              'fileIds': this.dataForm.fileIds,
              'createBy': this.dataForm.createBy,
              'createDate': this.dataForm.createDate
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
