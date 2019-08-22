<template>
    <div class="login">
     <div class="container">
       <img src="../assets/avatar.jpg" class="avatar">
        <el-form :model="loginForm" :rules="rules" ref="loginForm"  class="demo-loginForm">
  <el-form-item prop="username">
    <el-input v-model="loginForm.username" placeholder="请输入用户名" prefix-icon="myicon-user"></el-input>
  </el-form-item>
  <el-form-item prop="password">
    <el-input v-model="loginForm.password" placeholder="请输入密码" prefix-icon="myicon-key"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" class="login-btn" @click="login">登录</el-button>
  </el-form-item>
</el-form>
     </div>
    </div>

</template>
<script>
import { login } from '@/api/login_index.js'
export default {
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        // required:是必填项,不能为空
        // trigger:什么时候触发这个验证规则
        // message:如果不符合验证规则是的提示信息
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 进行二次判断
    login () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          login(this.loginForm)
            .then((res) => {
              console.log(res)
              // 实现路由跳转
              if (res.data.meta.status === 200) {
                localStorage.setItem('itcast_manager_35_token', res.data.data.token)
                // 如果成功实现跳转
                this.$router.push({ name: 'home' })
              } else {
                // 如果失败返回错误信息
                this.$message({
                  message: res.data.meta.msg,
                  type: 'warning'
                })
              }
            })
            // 什么都没写也要有提示信息
            .catch(() => {
              this.$message({
                message: '服务器异常请稍后再试',
                type: 'error'
              })
            })
        } else {
          this.$message({
            message: '请输入必填内容',
            type: 'warning'
          })
          return false
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.login {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: #2f4050;
  .container {
    position: absolute;
    left: 0;
    right: 0;
    width: 400px;
    padding: 0px 40px 15px 40px;
    margin: 200px auto;
    background: white;
    .avatar {
      position: relative;
      left: 50%;
      width: 120px;
      height: 120px;
      margin-left: -60px;
      margin-top: -60px;
      box-sizing: border-box;
      border-radius: 50%;
      border: 10px solid #fff;
      box-shadow: 0 1px 5px #ccc;
      overflow: hidden;
    }
    .login-btn {
      width: 100%;
    }
  }
}
</style>
