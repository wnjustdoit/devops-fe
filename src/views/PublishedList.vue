<template>
  <div class="publishList" v-loading="loading">
    <div style="margin: auto; margin-top: 15px; margin-bottom: 15px; width: 300px;">
      <el-input placeholder="请输入关键词" v-model="keyword" clearable class="search_txt">
        <el-button slot="append" icon="el-icon-search" @click="search_projects_publishment()"></el-button>
      </el-input>
    </div>
    <el-table :data="publishList" border style="width: 100%">
      <el-table-column prop="id" label="发布日志id"></el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="publish_type" label="发布类型"></el-table-column>
      <el-table-column prop="publish_id" label="发布id"></el-table-column>
      <el-table-column prop="publish_way" label="发布方式"></el-table-column>
      <el-table-column prop="user_id" label="用户id"></el-table-column>
      <el-table-column prop="gitlab_user_id" label="gitlab用户id"></el-table-column>
      <el-table-column prop="gitlab_user_name" label="gitlab用户名"></el-table-column>
      <el-table-column prop="gitlab_user_email" label="gitlab用户邮箱"></el-table-column>
      <el-table-column prop="notify_email" label="通知邮箱"></el-table-column>
      <el-table-column prop="created_at" label="创建时间"></el-table-column>
      <el-table-column prop="created_by" label="创建人"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="info" plain circle icon="el-icon-view" @click="toDetail(scope.row.id)">查看详情</el-button>
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
    search_projects_publishment(pageNo) {
      if (pageNo) {
        this.currentPage = pageNo;
      }
      http
        .get("/publishmentLog/list", {
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
    toDetail(id) {
      this.$router.push({
        path: "/publishedDetail?id=" + id,
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
