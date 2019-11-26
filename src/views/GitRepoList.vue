<template>
  <div class="gitRepoList" v-loading="loading">
    <el-button type="primary" @click="updateGitRepo2Db()">更新git仓库信息</el-button>
    <el-table :data="gitRepoList" border style="width: 100%">
      <el-table-column prop="id" label="id"></el-table-column>
      <el-table-column prop="name" label="name"></el-table-column>
      <el-table-column prop="description" label="description"></el-table-column>
      <el-table-column prop="name_with_namespace" label="name_with_namespace"></el-table-column>
      <el-table-column prop="path" label="path"></el-table-column>
      <el-table-column prop="path_with_namespace" label="path_with_namespace"></el-table-column>
      <el-table-column prop="ssh_url_to_repo" label="ssh_url_to_repo"></el-table-column>
      <el-table-column prop="http_url_to_repo" label="http_url_to_repo"></el-table-column>
      <el-table-column prop="web_url" label="web_url"></el-table-column>
      <el-table-column prop="created_at" label="创建时间"></el-table-column>
      <el-table-column prop="created_by" label="创建人"></el-table-column>
      <el-table-column prop="last_updated_at" label="最后更新时间"></el-table-column>
      <el-table-column prop="last_updated_by" label="最后更新人"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="danger" @click="deleteItem(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import http from "../util/http.js";
export default {
  data() {
    return {
      gitRepoList: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      keyword: null,
      loading: false
    };
  },
  methods: {
    list_git_repos() {
      http
        .get("/git/repos", {})
        .then(response => {
          this.gitRepoList = response.data;
        })
        .catch(error => {
          console.log(error);
          this.$message.error("查询失败");
        });
      // http
      //   .post("/xxx/login", this.userLoginInfo)
      //   .then(function(response) {
      //     console.log(response);
      //     if (response.id) {
      //       this.router.push({
      //         path: "/"
      //       });
      //     }
      //   })
      //   .catch(function(error) {
      //     console.log(error);
      //   });
    },
    deleteItem(id) {
      this.$confirm("确认删除？")
        .then(_ => {
          http
            .delete("/git/repos/" + id)
            .then(response => {
              this.$message({
                showClose: true,
                message: "删除成功",
                type: "success"
              });
              this.list_git_repos();
            })
            .catch(error => {
              console.log(error);
              this.$message.error("删除失败");
            });
        })
        .catch(_ => {
          this.$message("已取消");
        });
    },
    updateGitRepo2Db() {
      this.loading = true;
      http
        .post("/git/repos/database")
        .then(response => {
          console.log(response);
          this.$message({
            showClose: true,
            message: "同步git信息成功",
            type: "success"
          });
          this.list_git_repos();
        })
        .catch(error => {
          console.error(error);
          this.$message.error("更新失败");
        })
        .then(() => {
          this.loading = false;
        });
    }
  },
  created() {
    this.list_git_repos();
  }
};
</script>
<style scoped>
.gitRepoList {
  margin: auto;
  margin-top: 10px;
  width: 100%;
}
.gitRepoList td {
  width: 100px;
}
</style>
