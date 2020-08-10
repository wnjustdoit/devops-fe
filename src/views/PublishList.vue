<template>
  <div class="publishList" v-loading="loading">
    <div style="margin-bottom: 10px; width: 100%;">
      <el-select
          v-model="keyword"
          filterable
          placeholder="请选择或输入关键词"
          clearable
          allow-create
          default-first-option
          @change="search_projects_publishment()"
        >
          <el-option
            v-for="item in keyword_options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>&nbsp;&nbsp;
      <el-button type="primary" @click="search_projects_publishment()">搜索</el-button>
      <el-button
        type="text"
        size="mini"
        icon="el-icon-circle-plus-outline"
        style="margin-left: 120px;"
        @click="$router.push({path: '/newPublish'});"
      >新建发布</el-button>
      <el-button
        style="margin-left: 30px; "
        type="text"
        plain
        size="mini"
        @click="list_projects_health_status()"
      >查看健康状态</el-button>
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
              <span>{{ props.row.git_delete_temp_branch == 1 ? '删除' : '' }}</span>
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
              <span>{{ props.row.is_deleted == 0 ? '正常' : '删除' }}</span>
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
      <el-table-column width="95" label="操作">
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
      <el-table-column width="80" label="健康状态" v-if="showHealthStatus == true">
        <template slot-scope="scope">
          <span
            v-if="scope.row.health_status && scope.row.health_status != ''"
            class="el-icon-sunny"
          ></span>
          <span
            v-else-if="scope.row.health_status !== undefined && scope.row.health_status == ''"
            class="el-icon-moon-night"
          ></span>
        </template>
      </el-table-column>
      <el-table-column label="发布操作">
        <template slot-scope="scope">
          <el-dropdown split-button type="primary" size="small" @click="toPublish(scope.row.id, scope.row.name)">
            <span class="el-icon-s-promotion">&nbsp;发布</span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item style="padding: 0 1px 2px 1px; text-align: center">
                <el-button
                  type="danger"
                  plain
                  size="mini"
                  icon="el-icon-close"
                  @click="shutdown(scope.row, scope.$index)"
                >停机</el-button>
              </el-dropdown-item>
              <el-dropdown-item style="padding: 2px 1px 0 1px; text-align: center">
                <el-button
                  type="primary"
                  plain
                  size="mini"
                  icon="el-icon-refresh"
                  @click="reboot(scope.row, scope.$index)"
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
      loading: false,
      showHealthStatus: false,
      keyword_options: [
        {
          value: "youxuan",
          label: "妈妈纷享"
        },
        {
          value: "pallymore",
          label: "帕力亚多学习圈"
        },
        {
          value: "进货商城",
          label: "进货商城"
        },
        {
          value: "pos",
          label: "店保"
        },
        {
          value: "官网",
          label: "官网类"
        },
        {
          value: "membergrowth",
          label: "会员增长小程序"
        },
        {
          value: "hroffer",
          label: "HR公众号"
        }
      ],
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
    toPublish(id, name) {
      this.$router.push({
        path: "/publishDetail",
        query: {
          id: id,
          name: name
        }
      });
    },
    shutdown(row, index) {
      this.$confirm("确认停机？")
        .then(_ => {
          this.$message({
            showClose: true,
            message: "正在停机，请稍等..."
          });
          http
            .post("/publish/shutdown/" + row.id)
            .then(response => {
              if (response.data.status == "OK") {
                const h = this.$createElement;
                this.$notify({
                  title: "停机状态",
                  message: h(
                    "i",
                    { style: "color: green" },
                    row.name + "停机成功"
                  ),
                  type: "success",
                  duration: 0
                });
              } else {
                this.$notify.error({
                  title: "停机状态",
                  message: h(
                    "i",
                    { style: "color: red" },
                    row.name + "停机失败，请检查异常"
                  ),
                  duration: 0
                });
              }
              this.list_project_health_status(row, index);
            })
            .catch(error => {
              const h = this.$createElement;
              this.$notify({
                title: "停机状态",
                message: h(
                  "i",
                  { style: "color: red" },
                  row.name + "停机发生异常，详情请查看相关日志"
                ),
                type: "warning",
                duration: 0
              });
            });
        })
        .catch(_ => {
          this.$message("已取消");
        });
    },
    reboot(row, index) {
      this.$confirm("确认重启？")
        .then(_ => {
          this.$message({
            showClose: true,
            message: "正在重启，请稍等..."
          });
          http
            .post("/publish/reboot/" + row.id)
            .then(response => {
              if (response.data.status == "OK") {
                const h = this.$createElement;
                this.$notify({
                  title: "重启状态",
                  message: h(
                    "i",
                    { style: "color: green" },
                    row.name + "重启成功，详情请查看相关日志"
                  ),
                  type: "success",
                  duration: 0
                });
              } else {
                const h = this.$createElement;
                this.$notify.error({
                  title: "重启状态",
                  message: h(
                    "i",
                    { style: "color: red" },
                    row.name + "重启失败，详情请查看重启日志"
                  ),
                  duration: 0
                });
              }
              this.list_project_health_status(row, index);
            })
            .catch(error => {
              const h = this.$createElement;
              this.$notify({
                title: "重启状态",
                message: h(
                  "i",
                  { style: "color: red" },
                  row.name + " 重启发生异常，详情请查看相关日志"
                ),
                type: "warning",
                duration: 0
              });
            });
        })
        .catch(_ => {
          this.$message("已取消");
        });
    },
    list_projects_health_status() {
      this.showHealthStatus = true;
      this.publishList.forEach(publish => {
        http
          .get("/publish/status/" + publish.id)
          .then(response => {
            publish.id = publish.id + "";
            publish.health_status = response.data.process_id;
          })
          .catch(error => {
            this.$message.error("查询失败");
          });
      });
    },
    list_project_health_status(row, index) {
      http
        .get("/publish/status/" + row.id)
        .then(response => {
          row.health_status = response.data.process_id;
          this.$set(this.publishList, index, row);
        })
        .catch(error => {
          this.$message.error("查询失败");
        });
    },
    keyupSubmit() {
      document.onkeydown = e => {
        let _key = window.event.keyCode;
        if (_key === 13) {
          this.search_projects_publishment();
        }
      };
    }
  },
  created() {
    this.search_projects_publishment();
    this.keyupSubmit();
  }
};
</script>
<style scoped>
@import "../assets/common.css";
</style>
