<template>
  <div class="publishList" v-loading="loading">
    <div style="margin: auto; margin-top: 15px; margin-bottom: 15px; width: 300px;">
      <el-input placeholder="请输入关键词" v-model="keyword" clearable class="search_txt">
        <el-button slot="append" icon="el-icon-search" @click="search_projects_publishment()"></el-button>
      </el-input>
    </div>
    <el-table :data="publishList" border style="width: 100%">
      <el-table-column prop="id" label="发布系统id"></el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="description" label="描述"></el-table-column>
      <el-table-column prop="git_repo_id" label="git仓库id"></el-table-column>
      <el-table-column prop="git_branches" label="git发布分支"></el-table-column>
      <el-table-column prop="profile" label="npm打包环境"></el-table-column>
      <el-table-column prop="source_file_dir" label="发布文件位置"></el-table-column>
      <el-table-column prop="to_ip" label="目标服务器ip"></el-table-column>
      <el-table-column prop="to_project_home" label="目标服务器项目主目录"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="danger" @click="toPublish(scope.row.id)">发布</el-button>|
          <el-button type="danger" @click="toUpdate(scope.row.id)">修改</el-button>
          <el-button type="danger" @click="deleteItem(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        background
        @current-change="search_projects_publishment"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import http from "../util/http.js";
export default {
  data() {
    return {
      publishList: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      keyword: null,
      loading: false
    };
  },
  methods: {
    search_projects_publishment() {
      http
        .get("/publishmentFe/list", {
          params: { keyword: this.keyword, current_page: this.currentPage }
        })
        .then(response => {
          this.publishList = response.data.data;
          this.total = response.data.total;
        })
        .catch(error => {
          this.$message.error("查询失败");
        });
    },
    toUpdate(id) {
      this.$router.push({
        path: "/updatePublishFe",
        query: {
          id: id
        }
      });
    },
    deleteItem(id) {
      this.$confirm("确认删除？")
        .then(_ => {
          http
            .delete("/publishmentFe/" + id)
            .then(response => {
              this.$message({
                showClose: true,
                message: "删除成功",
                type: "success"
              });
              this.search_projects_publishment();
            })
            .catch(error => {
              this.$message.error("删除失败");
            });
        })
        .catch(_ => {
          this.$message("已取消");
        });
    },
    toPublish(id) {
      this.$router.push({
        path: "/publishDetailFe/",
        query: {
          id: id
        }
      });
    }
  },
  created() {
    this.search_projects_publishment();
  }
};
</script>
<style scoped>
.publishList {
  margin: auto;
  margin-top: 10px;
  width: 100%;
}
.publishList td {
  width: 100px;
}
</style>
