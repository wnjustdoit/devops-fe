<template>
  <div class="gitRepoList" v-loading="loading">
    <div style="text-align: right;">
      <el-alert
        ref="tips"
        style="width: 100%; height: 40px;"
        type="info"
        description="双击表格行展开/收缩列。"
        show-icon
      ></el-alert>
      <el-button type="text" plain size="mini" @click="updateGitRepo2Db()">更新 Git 仓库信息</el-button>
      <el-button
        style="margin-left: 20px; margin-right: 10px; "
        type="text"
        plain
        size="mini"
        @click="list_projects_web_hooks()"
      >Web Hook 管理</el-button>
    </div>
    <el-table
      ref="dataTable"
      :data="gitRepoList"
      border
      max-height="580"
      style="width: 100%; margin-top: 7px;"
      @row-dblclick="doubleClickRow"
      :cell-style="cellStyle"
      :header-cell-style="headerCellStyle"
    >
      <el-table-column type="expand">
        <template slot="header">
          <el-button type="text" icon="el-icon-more"></el-button>
        </template>
        <template slot-scope="props">
          <el-form label-position="left" inline class="table-expand">
            <el-form-item label="id">
              <span>{{ props.row.id }}</span>
            </el-form-item>
            <el-form-item label="name">
              <span>{{ props.row.name }}</span>
            </el-form-item>
            <el-form-item label="description">
              <span>{{ props.row.description }}</span>
            </el-form-item>
            <el-form-item label="name_with_namespace">
              <span>{{ props.row.name_with_namespace }}</span>
            </el-form-item>
            <el-form-item label="path">
              <span>{{ props.row.path }}</span>
            </el-form-item>
            <el-form-item label="path_with_namespace">
              <span>{{ props.row.path_with_namespace }}</span>
            </el-form-item>
            <el-form-item label="ssh_url_to_repo">
              <span>{{ props.row.ssh_url_to_repo }}</span>
            </el-form-item>
            <el-form-item label="http_url_to_repo">
              <span>{{ props.row.http_url_to_repo }}</span>
            </el-form-item>
            <el-form-item label="web_url">
              <span>{{ props.row.web_url }}</span>
            </el-form-item>
            <el-form-item label="created_at">
              <span>{{ props.row.created_at }}</span>
            </el-form-item>
            <el-form-item label="created_by">
              <span>{{ props.row.created_by }}</span>
            </el-form-item>
            <el-form-item label="last_updated_at">
              <span>{{ props.row.last_updated_at }}</span>
            </el-form-item>
            <el-form-item label="last_updated_by">
              <span>{{ props.row.last_updated_by }}</span>
            </el-form-item>
            <el-form-item label="web_hooks">
              <span>{{ props.row.web_hooks }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column width="45" prop="id" label="id"></el-table-column>
      <el-table-column sortable prop="path_with_namespace" label="path_with_namespace"></el-table-column>
      <el-table-column sortable prop="description" label="description"></el-table-column>
      <el-table-column prop="web_url" label="web_url"></el-table-column>
      <el-table-column width="155" prop="created_at" label="创建时间"></el-table-column>
      <el-table-column width="155" prop="last_updated_at" label="最后更新时间"></el-table-column>
      <el-table-column width="95" label="操作">
        <template slot-scope="scope">
          <el-button
            type="danger"
            round
            size="mini"
            icon="el-icon-delete"
            @click="deleteItem(scope.row.id)"
          >删除</el-button>
        </template>
      </el-table-column>
      <el-table-column sortable prop="web_hooks" label="Web Hooks" v-if="showWebHook == true"></el-table-column>
      <el-table-column width="120" label="Web Hook操作" v-if="showWebHook == true">
        <template slot-scope="scope">
          <el-button
            type="text"
            plain
            round
            size="mini"
            @click="add_gitlab_web_hook(scope.row, scope.$index)"
            v-if="scope.row.web_hooks == '[]'"
          >添加Web Hook</el-button>
          <el-button
            type="text"
            style="color: red;"
            round
            size="mini"
            @click="delete_gitlab_web_hook(scope.row, scope.$index)"
            v-if="scope.row.web_hooks != '[]'"
          >删除Web Hook</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import http from "../util/http.js";
import { cellStyle as cs, headerCellStyle as hcs } from "../assets/common.js";
export default {
  data() {
    return {
      gitRepoList: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      keyword: null,
      loading: false,
      showWebHook: false
    };
  },
  methods: {
    cellStyle() {
      return cs();
    },
    headerCellStyle() {
      return hcs();
    },
    doubleClickRow(row, column, event) {
      this.$refs.dataTable.toggleRowExpansion(row);
    },
    list_git_repos() {
      http
        .get("/git/repos", {})
        .then(response => {
          this.gitRepoList = response.data;
        })
        .catch(error => {
          this.$message.error("查询失败");
        });
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
          this.$message({
            showClose: true,
            message: "同步git信息成功",
            type: "success"
          });
          this.list_git_repos();
        })
        .catch(error => {
          this.$message.error("更新失败");
        })
        .then(() => {
          this.loading = false;
        });
    },
    list_projects_web_hooks() {
      this.showWebHook = true;
      this.gitRepoList.forEach(gitRepo => {
        http
          .get("/git/repo/" + gitRepo.id + "/web_hooks")
          .then(response => {
            gitRepo.id = gitRepo.id + ""; // 引用赋值
            gitRepo.web_hooks = JSON.stringify(response.data);
          })
          .catch(error => {
            this.$message.error("查询失败");
          });
      });
    },
    list_project_web_hooks(row, index) {
      http
        .get("/git/repo/" + row.id + "/web_hooks")
        .then(response => {
          row.web_hooks = JSON.stringify(response.data);
          this.$set(this.gitRepoList, index, row);
        })
        .catch(error => {
          this.$message.error("查询失败");
        });
    },
    add_gitlab_web_hook(row, index) {
      this.$confirm("确认添加？")
        .then(_ => {
          http
            .request({
              url: "/git/repo/" + row.id + "/web_hook",
              method: "PUT",
              data: null
            })
            .then(response => {
              this.$message({
                showClose: true,
                message: "保存成功",
                type: "success"
              });
              this.list_project_web_hooks(row, index);
            })
            .catch(error => {
              this.$message.error("保存失败");
            });
        })
        .catch(_ => {
          this.$message("已取消");
        });
    },
    delete_gitlab_web_hook(row, index) {
      this.$confirm("确认删除？")
        .then(_ => {
          http
            .delete("/git/repo/" + row.id + "/web_hook")
            .then(response => {
              this.$message({
                showClose: true,
                message: "删除成功",
                type: "success"
              });
              this.list_project_web_hooks(row, index);
            })
            .catch(error => {
              this.$message.error("删除失败");
            });
        })
        .catch(_ => {
          this.$message("已取消");
        });
    }
  },
  created() {
    this.list_git_repos();
  },
  mounted() {
    if (this.$refs.tips) {
      setTimeout(() => {
        this.$refs.tips.close();
      }, 3000);
    }
  }
};
</script>
<style scoped>
@import "../assets/common.css";
</style>
