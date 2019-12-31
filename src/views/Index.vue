<template>
  <div class="home">
    Welcome,
    <span style="color: blue; font-weight: bold;">{{nick_name}}!</span>
    <a href="#" class="logout" @click="user_logout" v-if="this.nick_name != '游客'">退出</a>
  </div>
</template>

<script>
import http from "../util/http.js";
export default {
  data() {
    return {
      nick_name: "游客"
    };
  },
  methods: {
    user_info() {
      http
        .get("/user/info")
        .then(response => {
          this.$store.commit("setUser", response.data);
          if (response.data && response.data.role) {
            this.nick_name = response.data.nick_name;
          } else {
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
    },
    user_logout() {
      http
        .post("/user/logout")
        .then(response => {
          this.$store.commit("setUser", null);
          this.$message.info({
            message: "退出成功，页面正在跳转..",
            duration: 1000
          });
          var _this = this;
          setTimeout(function() {
            _this.$router.push({
              path: "/userLogin"
            });
          }, 1000);
        })
        .catch(error => {
          this.$message.error("退出失败");
        })
        .then(() => {
          // always executed
        });
    }
  },
  created() {
    this.user_info();
  }
};
</script>
<style scoped>
.home {
  padding-top: 10%;
}
.logout {
  margin-left: 15px;
}
</style>
