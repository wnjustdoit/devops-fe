<template>
  <div class="login">
    <el-form ref="user" :model="user" label-width="80px">
      <el-form-item label="用户名" prop="login_code">
        <el-input v-model="user.login_code"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="login_code">
        <el-input type="password" v-model="user.login_pwd"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import http from '../util/http.js'
export default {
  data() {
    return {
      user: {
        login_code: "admin",
        login_pwd: "123456"
      }
    };
  },
  methods: {
    onSubmit() {
        http
          .post("/user/login", this.user)
          .then(response => {
            if(response.data.status == 'OK') {
              this.$message.info({ message: "登录成功，正在跳转到首页..", duration: 1000 });
            var _this = this;
            setTimeout(function() {
              _this.$router.push({
                path: "/"
              });
            }, 1000);
            } else {
              this.$message.error("用户名或密码错误或用户被禁用，请联系管理员");
            }
          })
          .catch(error => {
            this.$message.error("登录异常");
          });
    }
  }
};
</script>
<style scoped>
.login {
  width: 350px;
  margin: auto;
  margin-top: 100px;
}
</style>
