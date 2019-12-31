<template>
  <div class="user">
    <el-form
      ref="user"
      :model="user"
      :rules="rules"
      label-position="right"
      label-width="200px"
      v-loading="loading"
    >
      <el-form-item label="用户昵称" prop="nick_name">
        <el-input v-model="user.nick_name" placeholder="eg: 流川枫"></el-input>
      </el-form-item>
      <el-form-item label="登录名" prop="login_code">
        <el-input v-model="user.login_code" placeholder="eg: liuchuanfeng"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="login_pwd">
        <el-input v-model="user.login_pwd" placeholder="eg: 123456"></el-input>
      </el-form-item>
      <el-form-item label="用户邮箱" prop="email">
        <el-input v-model="user.email" placeholder="eg: wn@company.com"></el-input>
      </el-form-item>
      <el-form-item label="gitlab邮箱" prop="gitlab_email">
        <el-input v-model="user.gitlab_email" placeholder="eg: wn@company.com"></el-input>
      </el-form-item>
      <el-form-item label="角色" prop="role" style="text-align: left;">
        <el-select v-model="user.role" filterable placeholder="请选择">
          <el-option
            v-for="item in roles"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="text-align: left;">
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import http from "../util/http.js";
export default {
  data() {
    return {
      user: {
        nick_name: null,
        login_code: null,
        login_pwd: null,
        email: null,
        gitlab_email: null,
        role: null
      },
      roles: [
        {
          value: "backend",
          label: "后端开发"
        },
        {
          value: "frontend",
          label: "前端开发"
        },
        {
          value: "devops",
          label: "运维人员"
        }
      ],
      rules: {
        nick_name: [
          { required: true, message: "请输入用户昵称", trigger: "blur" },
          { min: 2, max: 12, message: "长度在2到12个字符", trigger: "blur" }
        ],
        login_code: [
          { required: true, message: "请输入登录名", trigger: "blur" },
          { min: 5, max: 30, message: "长度在5到30个英文字符", trigger: "blur" }
        ],
        login_pwd: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
          { min: 5, max: 30, message: "长度在5到30个英文字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入用户邮箱", trigger: "blur" },
          { min: 5, max: 30, message: "长度在5到30个英文字符", trigger: "blur" }
        ],
        gitlab_email: [
          { required: true, message: "请输入gitlab邮箱", trigger: "blur" },
          { min: 5, max: 30, message: "长度在5到30个英文字符", trigger: "blur" }
        ],
        role: [{ required: true, message: "请选择角色", trigger: "change" }]
      },
      loading: false
    };
  },
  methods: {
    onSubmit() {
      this.$refs["user"].validate(valid => {
        if (valid) {
          // console.log("submit!");
        } else {
          // console.log("error submit!!");
          return false;
        }
      });
      http
        .request({ url: "/admin/user", method: "PUT", data: this.user })
        .then(response => {
          this.$message({
            showClose: true,
            message: "保存成功",
            type: "success"
          });
          this.$router.push({ path: "/userList" });
        })
        .catch(error => {
          this.$message.error("保存失败");
        });
    },
    resetForm() {
      this.$refs["user"].resetFields();
    }
  }
};
</script>
<style scoped>
@import "../assets/common.css";
</style>
