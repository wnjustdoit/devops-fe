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
      <el-button
        type="text"
        size="mini"
        icon="el-icon-circle-plus-outline"
        style="margin-left: 120px;"
        @click="$router.push({path: '/newPublish'});"
      >新建发布</el-button>
    </div>
    <el-table
      :data="publishList"
      border
      style="width: 100%"
      :cell-style="cellStyle"
      :header-cell-style="headerCellStyle"
    >
      <el-table-column type="expand">
        <template slot="header">
          <el-button type="text" icon="el-icon-more"></el-button>
        </template>
        <template slot-scope="props">
          <el-form label-position="left" inline class="table-expand">
            <el-form-item label="发布系统id">
              <span>{{ props.row.id }}</span>
            </el-form-item>
            <el-form-item label="名称">
              <span>{{ props.row.name }}</span>
            </el-form-item>
            <el-form-item label="描述">
              <span>{{ props.row.description }}</span>
            </el-form-item>
            <el-form-item label="git仓库id">
              <span>{{ props.row.git_repo_id }}</span>
            </el-form-item>
            <el-form-item label="git发布分支">
              <span>{{ props.row.git_branches }}</span>
            </el-form-item>
            <el-form-item label="maven打包环境">
              <span>{{ props.row.profile }}</span>
            </el-form-item>
            <el-form-item label="发布文件位置">
              <span>{{ props.row.source_file_dir }}</span>
            </el-form-item>
            <el-form-item label="目标服务器ip">
              <span>{{ props.row.to_ip }}</span>
            </el-form-item>
            <el-form-item label="目标服务器项目主目录">
              <span>{{ props.row.to_project_home }}</span>
            </el-form-item>
            <el-form-item label="目标服务器项目进程关键词">
              <span>{{ props.row.to_process_name }}</span>
            </el-form-item>
            <el-form-item label="目标服务器上java应用运行变量">
              <span>{{ props.row.to_java_opts }}</span>
            </el-form-item>
            <el-form-item label="git合并到的分支名">
              <span>{{ props.row.git_merged_branch }}</span>
            </el-form-item>
            <el-form-item label="git打标签名">
              <span>{{ props.row.git_tag_version }}</span>
            </el-form-item>
            <el-form-item label="git打标签备注">
              <span>{{ props.row.git_tag_comment }}</span>
            </el-form-item>
            <el-form-item label="是否删除临时分支">
              <span>{{ props.row.git_delete_temp_branch }}</span>
            </el-form-item>
            <el-form-item label="创建时间">
              <span>{{ props.row.created_at }}</span>
            </el-form-item>
            <el-form-item label="创建人">
              <span>{{ props.row.created_by }}</span>
            </el-form-item>
            <el-form-item label="最后修改时间">
              <span>{{ props.row.last_updated_at }}</span>
            </el-form-item>
            <el-form-item label="最后修改人">
              <span>{{ props.row.last_updated_by }}</span>
            </el-form-item>
            <el-form-item label="是否删除">
              <span>{{ props.row.is_deleted }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column width="65" prop="id" label="发布id"></el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="description" label="描述"></el-table-column>
      <el-table-column prop="git_repo.path_with_namespace" label="git仓库"></el-table-column>
      <el-table-column prop="git_branches" label="git发布分支"></el-table-column>
      <el-table-column prop="profile" label="maven打包环境"></el-table-column>
      <el-table-column prop="to_ip" label="目标服务器ip"></el-table-column>
      <el-table-column width="90" label="操作">
        <template slot-scope="scope">
          <div style="padding-top: 2px; padding-bottom: 2px;">
            <el-button
              type="primary"
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
      <el-table-column label="发布操作">
        <template slot-scope="scope">
          <el-dropdown split-button type="primary" size="small" @click="toPublish(scope.row.id)">
            <span class="el-icon-s-promotion">发布</span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item style="padding: 0 1px 2px 1px; text-align: center">
                <el-button
                  type="danger"
                  plain
                  size="mini"
                  icon="el-icon-close"
                  @click="shutdown(scope.row.id)"
                >停机</el-button>
              </el-dropdown-item>
              <el-dropdown-item style="padding: 2px 1px 0 1px; text-align: center">
                <el-button
                  type="primary"
                  plain
                  size="mini"
                  icon="el-icon-refresh"
                  @click="reboot(scope.row.id)"
                >重启</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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
        .get("/publishment/list", {
          params: {
            keyword: this.keyword,
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
    toUpdate(id) {
      this.$router.push({
        path: "/updatePublish",
        query: {
          id: id
        }
      });
    },
    deleteItem(id) {
      this.$confirm("确认删除？")
        .then(_ => {
          http
            .delete("/publishment/" + id)
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
        path: "/publishDetail",
        query: {
          id: id
        }
      });
    },
    shutdown(id) {
      this.$confirm("确认停机？")
        .then(_ => {
          http
            .post("/publish/shutdown/" + id)
            .then(response => {
              if (response.data.status == "OK") {
                this.$message({
                  showClose: true,
                  message: "停机成功",
                  type: "success"
                });
                this.search_projects_publishment();
              } else {
                this.$message.error("停机失败");
              }
            })
            .catch(error => {
              this.$message.error("停机失败");
            });
        })
        .catch(_ => {
          this.$message("已取消");
        });
    },
    reboot(id) {
      this.$confirm("确认重启？")
        .then(_ => {
          http
            .post("/publish/reboot/" + id)
            .then(response => {
              if (response.data.status == "OK") {
                this.$message({
                  showClose: true,
                  message: "重启成功",
                  type: "success"
                });
                this.search_projects_publishment();
              } else {
                this.$message.error("重启失败");
              }
            })
            .catch(error => {
              this.$message.error("重启失败");
            });
        })
        .catch(_ => {
          this.$message("已取消");
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
