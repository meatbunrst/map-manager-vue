<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本信息</span>
      </div>
      <el-form ref="dataForm" :model="dataForm" :rules="dataRule" :disabled="formDisabled" label-width="100px" >
        <el-row>
          <el-col :span="8">
            <el-form-item label="项目:" prop="projectId">
              <span>{{ dataForm.projectName }} </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="模块:" prop="moduleId">
              <span>{{ dataForm.moduleName }} </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="指派用户:" prop="userId">
              <span>{{ dataForm.userName }} </span>
            </el-form-item>
          </el-col>
        </el-row>
        <!--<el-row>
          <el-col :span="12">
            <el-form-item label="版本id" prop="versionId">
              <span>{{ dataForm.versionId }} </span>
            </el-form-item>
          </el-col>
        </el-row>-->
        <el-row>
          <el-col :span="8">
            <el-form-item label="类型：" prop="type">
              <el-radio-group v-model="dataForm.type">
                <el-radio-button v-for="(item, index) in dictMap.bug_type" :key="index" :label="item.paramValue">{{ item.paramKey }}
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="优先级：" prop="priority">
              <el-radio-group v-model="dataForm.priority">
                <el-radio-button v-for="(item, index) in dictMap.bug_priority" :key="index" :label="item.paramValue">{{ item.paramKey }}
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="严重程度：" prop="level">
              <el-radio-group v-model="dataForm.level">
                <el-radio-button v-for="(item, index) in dictMap.bug_level" :key="index" :label="item.paramValue">{{ item.paramKey }}
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="截止日期" prop="endDate">
              <span>{{ dataForm.endDate }} </span>
              <el-tag v-if="dataForm.colorType === '1'" type="warning">{{ dataForm.warnString }}</el-tag>
              <el-tag v-else-if="dataForm.colorType === '2'" type="danger">{{ dataForm.warnString }}</el-tag>
              <el-tag v-else-if="dataForm.colorType === '0'" type="info">{{ dataForm.warnString }}</el-tag>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="创建日期" prop="endDate">
              <span>{{ dataForm.createDate }} </span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="关键词" prop="keyWork">
              <span>{{ dataForm.keyWork }} </span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row/>
      </el-form>
    </el-card>
    <el-card class="box-card" style="margin-top: 20px">
      <div slot="header" class="clearfix" >
        <span>详细问题</span>
      </div>
      <div ref="editor" style="text-align:left;margin: 5px" v-html="editorContent"/>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
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
      projectList: [],
      userList: [],
      moduleList: [],
      editor: {},
      editorContent: '',
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
      }
    }
  },
  computed: {
    ...mapGetters([
      'imagesUploadApi'
    ])
  },
  created() {
    this.$nextTick(() => {
      this.pdf(1)
    })
  },
  mounted() {
    this.loadProject()
    this.getDictMap('bug_priority,bug_level,bug_type')
  },
  methods: {
    loadProject() {
      this.$http.get(this.$http.adornUrl(`/debugproject/all`)).then(({ data }) => {
        if (data && data.code === 0) {
          this.projectList = data.all
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
    pdf(id) {
      id = id || ''
      this.title = 'pdf下载'
      this.$nextTick(() => {
        this.resetForm()
        if (id) {
          this.$http.get(this.$http.adornUrl(`/debugdetailed/info`), { params: this.$http.adornParams({ id: id }) }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm = data.debugdetailed
              this.editorContent = data.debugdetailed.content
              this.title = data.debugdetailed.title
              setTimeout(() => {
                // window.print()
              }, 3000)
            }
          })
        }
      })
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
    }
  }
}
</script>
