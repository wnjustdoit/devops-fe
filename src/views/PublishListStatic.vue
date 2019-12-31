<template>
  <div class="publishList" v-loading="loading">
    <div style="justify-content: center; margin-bottom: 10px; width: 100%; display: flex;">
      <el-input placeholder="请输入关键词" v-model="keyword" clearable size="small" style="width: 300px;">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <el-button
        type="primary"
        size="small"
        @click="search_projects_publishment()"
      >搜索</el-button>
    </div>
    <el-table
      :data="publishList"
      border
      style="width: 100%"
      :cell-style="cellStyle"
      :header-cell-style="headerCellStyle"
    >
      <el-table-column prop="id" label="发布系统id"></el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="description" label="描述"></el-table-column>
      <el-table-column prop="git_repo_id" label="git仓库id"></el-table-column>
      <el-table-column prop="git_branches" label="git发布分支"></el-table-column>
      <el-table-column prop="source_file_dir" label="发布文件位置"></el-table-column>
      <el-table-column prop="to_ip" label="目标服务器ip"></el-table-column>
      <el-table-column prop="to_project_home" label="目标服务器项目主目录"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <div style="padding-top: 2px; padding-bottom: 2px;">
            <el-button
              type="primary"
              round
              size="mini"
              icon="el-icon-s-promotion"
              @click="toPublish(scope.row.id)"
            >发布</el-button>
            <br />
            <el-button
              style="margin-top: 3px;"
              type="info"
              plain
              round
              size="mini"
              icon="el-icon-edit"
              @click="toUpdate(scope.row.id)"
            >修改</el-button>
            <br />
            <el-button
              style="margin-top: 3px;"
              type="danger"
              round
              size="mini"
              icon="el-icon-delete"
              @click="deleteItem(scope.row.id)"
            >删除</el-button>
          </div>
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
        .get("/publishmentStatic/list", {
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
        path: "/updatePublishStatic",
        query: {
          id: id
        }
      });
    },
    deleteItem(id) {
      this.$confirm("确认删除？")
        .then(_ => {
          http
            .delete("/publishmentStatic/" + id)
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
        path: "/publishDetailStatic/",
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
