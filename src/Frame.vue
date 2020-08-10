<template>
  <div id="frame">
    <!-- <el-avatar>admin</el-avatar> -->
    <el-menu
      :default-active="activeIndex"
      router
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
    >
      <el-menu-item index="/">
        <router-link to="/">首页</router-link>
      </el-menu-item>
      <el-menu-item index="/gitRepoList">
        <router-link to="/gitRepoList">GitLab项目列表</router-link>
      </el-menu-item>
      <el-submenu index="backend" id="backend">
        <template slot="title">后端发布</template>
        <el-menu-item index="/newPublish">
          <router-link to="/newPublish">新建发布</router-link>
        </el-menu-item>
        <el-menu-item index="/publishList">
          <router-link to="/publishList">发布列表</router-link>
        </el-menu-item>
      </el-submenu>
      <el-submenu index="static" id="static" v-if="$store.state.user_role == 'fontend' || $store.state.user_role == 'devops'">
        <template slot="title">静态资源发布（cdn等）</template>
        <el-menu-item index="/newPublishStatic">
          <router-link to="/newPublishStatic">新建发布</router-link>
        </el-menu-item>
        <el-menu-item index="/publishListStatic">
          <router-link to="/publishListStatic">发布列表</router-link>
        </el-menu-item>
      </el-submenu>
      <el-submenu index="fe_vue" id="fe_vue" v-if="$store.state.user_role == 'frontend' || $store.state.user_role == 'devops'">
        <template slot="title">前端发布（vue）</template>
        <el-menu-item index="/newPublishFe">
          <router-link to="/newPublishFe">新建发布</router-link>
        </el-menu-item>
        <el-menu-item index="/publishListFe">
          <router-link to="/publishListFe">发布列表</router-link>
        </el-menu-item>
      </el-submenu>
      <el-submenu index="nodejs" id="nodejs" v-if="$store.state.user_role == 'frontend' || $store.state.user_role == 'devops'">
        <template slot="title">nodejs发布</template>
        <el-menu-item index="/newPublishNode">
          <router-link to="/newPublishNode">新建发布</router-link>
        </el-menu-item>
        <el-menu-item index="/publishListNode">
          <router-link to="/publishListNode">发布列表</router-link>
        </el-menu-item>
      </el-submenu>
      <el-menu-item index="/publishedList">
        <router-link to="/publishedList">最近发布</router-link>
      </el-menu-item>
      <el-submenu index="user" id="user" v-if="$store.state.user_role == 'devops'">
        <template slot="title">用户管理</template>
        <el-menu-item index="/newUser">
          <router-link to="/newUser">添加用户</router-link>
        </el-menu-item>
        <el-menu-item index="/userList">
          <router-link to="/userList">用户列表</router-link>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>
<script>
import http from "./util/http.js";
export default {
  data() {
    return {
      activeIndex: "/"
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      // console.log(key, keyPath);
    },
    init_active() {
      this.activeIndex = this.$route.path;
    },
    init_menu() {
      // 临时重定向到后端发布列表
      this.$router.push({
                path: "/publishList"
              });
      return;
      http
        .get("/user/info")
        .then(response => {
          if (response.data && response.data.role) {
            this.$store.commit('setUser', response.data);
          } else {
            if (this.$route.path == '/userLogin') {
              return;
            }

            this.$message.info({
              message: "您尚未登录，正在跳转到登录页..",
              duration: 1000
            });
            var _this = this;
            setTimeout(function() {
              _this.$router.push({
                path: "/userLogin"
              });
            }, 1000);
          }
        })
        .catch(error => {
          this.$message.error("查询用户信息失败");
        })
        .then(() => {
          // always executed
        });
    }
  },
  watch: {
    $route() {
      this.init_active();
    }
  },
  created() {
    this.init_menu();
    this.init_active();
  }
};
</script>
