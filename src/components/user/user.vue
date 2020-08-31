<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!--主体卡片区域-->
    <el-card class="box-card">
      <el-row :gutter="20">
        <!--搜索与添加区域-->
        <el-col :span="12">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUsersData">
            <el-button slot="append" icon="el-icon-search" @click="getUsersData"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple"></div>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="addDialogVisible = true">添加</el-button>
        </el-col>
      </el-row>
      <el-table :data="usersList" style="width: 100%" stripe border>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <!--操作按钮区域-->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUser(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUser(scope.row.id)"></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRoleDialog(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        >
      </el-pagination>
    </el-card>
    <el-dialog
      title="提示"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
      >
      <el-form :model="addUserForm" :rules="addUserRules" ref="addUserFormRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addFormValidate">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改用户信息"
      :visible.sync="editUserdialogVisible"
      width="50%" @close="resetEditUserForm">
      <el-form :model="editUserForm" :rules="editFormRules" ref="editUserFormRef" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="editUserForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop='mobile'>
          <el-input v-model="editUserForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop='email'>
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editUserdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!--分配角色对话框-->
    <el-dialog
      title="分配用户角色"
      :visible.sync="setRoledialogVisible"
      width="50%"
      @close="resetUserInfo">
      <div>
        <p>当前用户： {{userInfo.username}}</p>
        <p>当前角色： {{userInfo.role_name}}</p>
        <p>
          分配新角色：
          <el-select v-model="selectRoleId" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoledialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/
      if (regEmail.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法邮箱'))
    }
    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^1[34578]\d{9}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法手机号'))
    }
    return {
      queryInfo: {
        // 查询信息
        query: '',
        // 当前页数
        pagenum: 1,
        // 全部页数
        pagesize: 2
      },
      // 用户列表
      usersList: [],
      total: 0,
      // 控制添加用户对话框显示与隐藏
      addDialogVisible: false,
      // 控制修改用户信息对话框修改与隐藏
      editUserdialogVisible: false,
      // 添加用户表单
      addUserForm: {
        username: '',
        password: '',
        mobile: '',
        email: ''
      },
      editUserForm: {},
      // 添加用户表单验证规则
      addUserRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名长度为3 ~ 10个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 10, message: '密码长度最低6位', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ]
      },
      // 修改用户信息的验证规则
      editFormRules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ]
      },
      // 控制分配角色对话框的显示与隐藏
      setRoledialogVisible: false,
      // 即将分配角色的用户信息
      userInfo: '',
      // 角色列表
      roleList: '',
      // 已选择的角色ID
      selectRoleId: ''
    }
  },
  created() {
    this.getUsersData()
  },
  methods: {
    // 获取用户列表
    async getUsersData() {
      const { data: res } = await this.$axios.get('users', {
        params: this.queryInfo
      })
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('请求发生错误')
      }
      this.usersList = res.data.users
      this.total = res.data.total
    },
    // 更改页面容纳数据数
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize
      this.getUsersData()
    },
    // 更改当前页面
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage
      this.getUsersData()
    },
    // 更改用户状态
    async userStateChanged(changeInfo) {
      // 向服务器发送Ajax请求
      const { data: res } = await this.$axios.put(`users/${changeInfo.id}/state/${changeInfo.mg_state}`)
      if (res.meta.status !== 200) {
        changeInfo.mg_state = !changeInfo.mg_state
        this.$message.error('更改用户状态失败')
      }
      this.$message.success('更改用户状态成功')
    },
    // 关闭表单清空表单
    addDialogClosed() {
      this.$refs.addUserFormRef.resetFields()
    },
    // 点击确定进行表单预校验
    addFormValidate() {
      this.$refs.addUserFormRef.validate(async valid => {
        if (valid !== true) {
          return
        }
        // 若校验通过，则发起axios请求
        const { data: res } = await this.$axios.post('users', this.addUserForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加用户失败')
        }
        this.$message.success('添加用户成功')
        this.addDialogVisible = false
        this.getUsersData()
      })
    },
    // 修改用户信息
    async editUser(id) {
      this.editUserdialogVisible = true
      const { data: res } = await this.$axios.get('users/' + id)
      this.editUserForm = res.data
      console.log(this.editUserForm)
    },
    // 关闭修改用户表单重置表单验证信息
    resetEditUserForm() {
      this.$refs.editUserFormRef.resetFields()
    },
    // 修改用户信息并提交
    editUserInfo() {
      this.$refs.editUserFormRef.validate(async valid => {
        if (valid !== true) {
          return
        }
        // 关闭对话框
        this.editUserdialogVisible = false
        // 发送请求信息
        const { data: res } = await this.$axios.put('users/' + this.editUserForm.id, { email: this.editUserForm.email, mobile: this.editUserForm.mobile })
        if (res.meta.status !== 200) {
          return this.$message.error('修改用户信息失败')
        }
        this.$message.success('修改用户信息成功')
        // 重新获取信息列表
        this.getUsersData()
      })
    },
    // 删除用户
    async removeUser(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$axios.delete('users/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除用户信息失败')
      this.$message.success('删除用户信息成功')
      this.getUsersData()
    },
    // 展示用户角色信息
    async showSetRoleDialog(role) {
      this.userInfo = role
      // 获取所有角色列表
      const { data: res } = await this.$axios.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.roleList = res.data
      this.setRoledialogVisible = true
    },
    async setRole() {
      const { data: res } = await this.$axios.put(`users/${this.userInfo.id}/role`, { rid: this.selectRoleId })
      if (res.meta.status !== 200) {
        return this.$message.error('分配角色失败')
      }
      this.getUsersData()
      this.setRoledialogVisible = false
    },
    resetUserInfo() {
      this.userInfo = ''
      this.selectRoleId = ''
    }
  }
}
</script>

<style lang="less" scoped>
</style>
