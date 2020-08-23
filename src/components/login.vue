<template>
    <div id="login_container">
        <div class="login_box">
            <!-- 头像区域 -->
            <div class="aventer_box">
                <img src="../assets/logo.png" alt="">
            </div>
            <!-- 登录表单区域 -->
            <el-form ref="loginFormRef" label-width="0" class="login_form" :model="loginForm" :rules="rules">
                <!-- 用户名 -->
                <el-form-item prop="username"> <!-- 注意验证规则的名字要与绑定的属性一致 -->
                    <el-input v-model="loginForm.username" prefix-icon="el-icon-user"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input prefix-icon="iconfont icon-3702mima" v-model="loginForm.password" type="password"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="loginFormRst">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表单验证规则
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '密码长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    loginFormRst () {
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        // 验证通过才能发送请求
        if (valid) {
          // 发送axios请求
          const { data: res } = await this.$axios.post('login', this.loginForm)
          // console.log(res.meta.status)
          // console.log(res)
          if (res.meta.status !== 200) {
            return this.$message.error('登陆失败')
          }
          // 保存token
          window.sessionStorage.setItem('token', res.data.token)
          // 编程式路由跳转
          this.$router.push('/home')
          return this.$message.success('登陆成功')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
#login_container{
    background-color: #2b5b6b;
    height: 100%;
}
.login_box{
    position: absolute;
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .aventer_box{
        position: absolute;
        width: 130px;
        height: 130px;
        left: 50%;
        transform: translate(-50%, -50%);
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 0 10px #ddd;
        background-color: #fff;
        img{
            width: 100%;
            border-radius: 50%;
            background-color: #eee;
        }
    }
}
.btns{
    display: flex;
    justify-content: flex-end;
}
.login_form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
}

</style>
