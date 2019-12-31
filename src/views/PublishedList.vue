<template>
  <div class="publishList" v-loading="loading">
    <el-form :inline="true" :model="publishLog" style="text-align: left; margin-bottom: -0px;">
      <el-form-item label="发布名称">
        <el-input v-model="publishLog.name" placeholder="发布名称"></el-input>
      </el-form-item>
      <el-form-item label="发布类型">
        <el-select v-model="publishLog.publish_type" placeholder="发布类型">
          <el-option label="后端Java" value="backend"></el-option>
          <el-option label="前端Vue" value="fe_vue"></el-option>
          <el-option label="静态资源CDN" value="staticfile"></el-option>
          <el-option label="Nodejs" value="nodejs"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发布方式">
        <el-select v-model="publishLog.publish_way" placeholder="发布方式">
          <el-option label="浏览器" value="browser"></el-option>
          <el-option label="Web Hook（gitlab）" value="webhook"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发布id">
        <el-input v-model="publishLog.publish_id" placeholder="发布id"></el-input>
      </el-form-item>
      <el-form-item label="发布用户id">
        <el-input v-model="publishLog.user_id" placeholder="发布用户id"></el-input>
      </el-form-item>
      <el-form-item label="发布内容">
        <el-input
          type="textarea"
          size="medium"
          rows="2"
          show-word-limit
          v-model="publishLog.content"
          placeholder="发布内容"
        ></el-input>
      </el-form-item>
      <el-form-item style="margin-left: 30px;">
        <el-button type="primary" style="margin-left: 5px;" @click="search_projects_publishment">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="publishList"
      border
      style="width: 100%"
      :cell-style="cellStyle"
      :header-cell-style="headerCellStyle"
    >
      <el-table-column width="90" prop="id" label="发布日志id"></el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="publish_type" label="发布类型"></el-table-column>
      <el-table-column width="65" prop="publish_id" label="发布id"></el-table-column>
      <el-table-column prop="publish_way" label="发布方式"></el-table-column>
      <el-table-column width="65" prop="user_id" label="用户id"></el-table-column>
      <el-table-column width="65" prop="gitlab_user_id" label="gitlab用户id"></el-table-column>
      <el-table-column prop="gitlab_user_name" label="gitlab用户名"></el-table-column>
      <el-table-column prop="gitlab_user_email" label="gitlab用户邮箱"></el-table-column>
      <el-table-column prop="notify_email" label="通知邮箱"></el-table-column>
      <el-table-column prop="created_at" label="创建时间"></el-table-column>
      <el-table-column prop="created_by" label="创建人"></el-table-column>
      <el-table-column width="140" label="操作">
        <template slot-scope="scope">
          <el-button
            type="info"
            round
            size="medium"
            icon="el-icon-view"
            @click="toDetail(scope.row.id)"
          >查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        background
        @size-change="change_page_size"
        @current-change="change_page"
        :current-page="this.currentPage"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="this.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.total"
        :hide-on-single-page="true"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import http from "../util/http.js";
import { cellStyle as cs, headerCellStyle as hcs } from "../assets/common.js";
export default {
  data() {
    return {
      publishLog: {},
      publishList: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      keyword: null,
      loading: false
    };
  },
  methods: {
    cellStyle() {
      return cs();
    },
    headerCellStyle() {
      return hcs();
    },
    change_page(pageNo) {
      if (pageNo) {
        this.currentPage = pageNo;
        this.search_projects_publishment();
      }
    },
    change_page_size(pageSize) {
      if (pageSize) {
        this.pageSize = pageSize;
        this.search_projects_publishment();
      }
    },
    search_projects_publishment() {
      http
        .get("/publishmentLog/list", {
          params: {
            publishLog: this.publishLog,
            current_page: this.currentPage,
            page_size: this.pageSize
          }
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
@import "../assets/common.css";
</style>
