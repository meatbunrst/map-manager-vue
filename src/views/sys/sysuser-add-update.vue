<template>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
    :visible.sync="visible"
    :append-to-body="true"
    center>
    <el-form
      ref="SysUserForm"
      :model="SysUserForm"
      :rules="dataRule"
      :disabled="formDisabled"
      label-width="80px"
      @keyup.enter.native="dataFormSubmit()">
      <el-form-item label="用户姓名" prop="accountName">
        <el-input
          v-model="SysUserForm.accountName"
          placeholder="请输入用户名"
        />
      </el-form-item>
      <el-form-item label="登录名" prop="username">
        <el-input
          v-model="SysUserForm.username"
          placeholder="登录用名"
        />
      </el-form-item>
      <el-form-item :class="{ 'is-required': !flag }" label="密码" prop="password">
        <el-input
          v-model="SysUserForm.password"
          type="password"
          show-password
          placeholder="长度8位以上，必须包含数字，大写字母，小写字母，特殊字符"
        />
      </el-form-item>
      <el-form-item :class="{ 'is-required': !flag }" label="确认密码" prop="comfirmPassword">
        <el-input v-model="SysUserForm.comfirmPassword" type="password" show-password placeholder="确认密码"/>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input
          v-model="SysUserForm.email"
          placeholder="请输入正确的邮箱"
        />
      </el-form-item>
      <el-form-item label="手机号码" prop="mobile">
        <el-input
          v-model="SysUserForm.mobile"
          placeholder="请输入正确的手机号码"
        />
      </el-form-item>
      <el-row style="margin: 10px">
        <el-col :span="4">
          <el-button size="mini" type="primary" @click="showDept">选择部门</el-button>
        </el-col>
        <el-col :span="4">
          <el-tag v-if="pname" type="success">{{ pname }}</el-tag>
        </el-col>
      </el-row>
      <el-form-item label="角色" size="mini" prop="roleIdList">
        <el-checkbox-group v-model="SysUserForm.roleIdList">
          <el-checkbox v-for="role in roleList" :key="role.roleId" :label="role.roleId">{{ role.roleName }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="状态" size="mini" prop="status">
        <el-radio-group v-model="SysUserForm.status">
          <el-radio :label="0">禁用</el-radio>
          <el-radio :label="1">正常</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button v-if="!formDisabled" type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
    <org-one-select ref="orgOneSelect" :append="true" @getDeptOneSelectData="getDeptData"/>
  </el-dialog>
</template>

<script>
import OrgOneSelect from '@/components/orgone-select'
export default {
  components: {
    OrgOneSelect
  },
  data: function() {
    const validatepassword = (rule, value, callback) => {
      if (!this.flag && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/.test(value)) {
        callback(new Error('密码格式不匹配'))
      } else if (!this.flag && !/\S/.test(value)) {
        callback(new Error('密码不能为空'))
      } else {
        callback()
      }
    }
    const validateComfirmPassword = (rule, value, callback) => {
      if (!this.flag && !/\S/.test(value)) {
        callback(new Error('确认密码不能为空'))
      } else if (this.SysUserForm.password && this.SysUserForm.password !== value) {
        callback(new Error('确认密码与密码输入不一致'))
      } else {
        callback()
      }
    }
    const validUsername = (rule, value, callback) => {
      if (!/\S/.test(value)) {
        callback(new Error('帐号不能为空'))
      } else if (!this.flag && /\S/.test(value)) {
        this.$http.get(this.$http.adornUrl('/systemuser/countName'), { params: { username: value }})
          .then(({ data }) => {
            if (data && data.code === 0 && data.flag) {
              callback(new Error('帐号重复'))
            }
          }
          )
      } else {
        callback()
      }
    }
    const validateemail = (rule, value, callback) => {
      if (value && !/[\w!#$%&'*+/=?^_{|}~-]+(?:\.[\w!#$%&'*+/=?^_{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/.test(value)) {
        callback(new Error('邮箱格式不匹配'))
      } else {
        callback()
      }
    }
    const validatemobile = (rule, value, callback) => {
      if (!/^1[34578]\d{9}$/.test(value)) {
        callback(new Error('手机号码格式不匹配'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      visible2: false,
      roleList: [],
      flag: false,
      pname: '',
      title: '',
      formDisabled: false,
      SysUserForm: {
        userId: 0,
        username: '',
        password: '',
        comfirmPassword: '',
        salt: '',
        email: '',
        mobile: '',
        pname: '',
        status: 1,
        roleIdList: [],
        deptId: '',
        wechatId: '',
        avatarurl: '',
        accountName: ''
        /* userId: 0,
           username: '张三道四',
           password: 'Gmcc@1234',
           comfirmPassword: 'Gmcc@1234',
           email: 'zhang@qq.com',
           mobile: '13512010000',
           status: 1,
           roleIdList: [],
           deptId: '',
           accountName: 'zhangsan' */
      },
      deptList: [],
      deptListTreeProps: {
        label: 'label',
        children: 'children'
      },
      dataRule: {
        username: [
          { validator: validUsername, trigger: 'blur' }
        ],
        comfirmPassword: [
          { validator: validateComfirmPassword, trigger: 'blur' }
        ],
        password: [
          { validator: validatepassword, trigger: 'blur' }],
        email: [
          { validator: validateemail, trigger: 'blur' }],
        mobile: [
          { required: true, message: '电话不能为空', trigger: 'blur' }, { validator: validatemobile, trigger: 'blur' }],
        accountName: [
          { required: true, message: '账户名不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    'pname': function(newVal) {
      this.pname = newVal
    }
  },
  methods: {
    init(id) {
      this.SysUserForm.userId = id || 0
      this.flag = id || 0
      this.formDisabled = false
      this.title = (id ? '修改' : '新增')
      this.pname = ''
      this.visible = true
      this.$http.get(this.$http.adornUrl('/sysdept/depttree'))
        .then(({ data }) => {
          if (data) {
            if (this.deptList.length === 0) {
              this.deptList.push(data)
            }
          }
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sysrole/select'),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            this.roleList = data && data.code === 0 ? data.list : []
          }).then(() => {
            this.visible = true
            /* this.$nextTick(() => {
               this.dataForm = Object.assign({})
             }) */
          }).then(() => {
            if (this.SysUserForm.userId) {
              this.$http.get(this.$http.adornUrl(`/systemuser/info`), { params: this.$http.adornParams({ userId: this.SysUserForm.userId }) }).then(({ data }) => {
                if (data && data.code === 0) {
                  for (const key in data.systemuser) {
                    if (data.systemuser[key]) {
                      this.SysUserForm[key] = data.systemuser[key]
                    } else {
                      this.SysUserForm[key] = ''
                    }
                    this.SysUserForm.roleIdList = []
                    this.SysUserForm.status = parseInt(data.systemuser.status)
                    this.SysUserForm.roleIdList = data.systemuser.roleIdList
                  }
                }
              })
            } else {
              this.SysUserForm = Object.assign({ roleIdList: [], status: 1 })
            }
          })
        })
    },
    show(id) {
      this.SysUserForm.userId = id || 0
      this.flag = id || 0
      this.formDisabled = true
      this.title = '用户详细'
      this.pname = ''
      this.visible = true
      this.$http.get(this.$http.adornUrl('/sysdept/depttree'))
        .then(({ data }) => {
          if (data) {
            if (this.deptList.length === 0) {
              this.deptList.push(data)
            }
          }
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sysrole/select'),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            this.roleList = data && data.code === 0 ? data.list : []
          }).then(() => {
            this.visible = true
          }).then(() => {
            if (this.SysUserForm.userId) {
              this.$http.get(this.$http.adornUrl(`/systemuser/info`), { params: this.$http.adornParams({ userId: this.SysUserForm.userId }) }).then(({ data }) => {
                if (data && data.code === 0) {
                  for (const key in data.systemuser) {
                    if (data.systemuser[key]) {
                      this.SysUserForm[key] = data.systemuser[key]
                    } else {
                      this.SysUserForm[key] = ''
                    }
                    this.SysUserForm.roleIdList = []
                    this.SysUserForm.status = parseInt(data.systemuser.status)
                    this.SysUserForm.roleIdList = data.systemuser.roleIdList
                  }
                }
              })
            } else {
              this.SysUserForm = Object.assign({ roleIdList: [], status: 1 })
            }
          })
        })
    },
    // 菜单树选中
    getDeptData(data) {
      this.SysUserForm.deptId = data.id
      this.pname = data.label
      console.log(this.pname)
      //  pname
      // this.visible2 = false
    },
    showDept() {
      this.$nextTick(() => {
        this.$refs.orgOneSelect.init()
      })
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['SysUserForm'].validate((valid) => {
        if (valid) {
          // this.SysUserForm.avatarurl = ''
          // this.SysUserForm.wechatId = ''
          this.$http.post(this.$http.adornUrl(`/systemuser/${!this.flag ? 'add' : 'update'}`), this.$http.adornData(this.SysUserForm)).then(({ data }) => {
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
