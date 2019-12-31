<template>
  <div class="userList" v-loading="loading">
    <el-table
      :data="userList"
      border
      style="width: 100%"
      :cell-style="cellStyle"
      :header-cell-style="headerCellStyle"
    >
      <el-table-column prop="id" label="用户id"></el-table-column>
      <el-table-column prop="nick_name" label="用户昵称"></el-table-column>
      <el-table-column prop="login_code" label="登录名"></el-table-column>
      <el-table-column prop="email" label="用户邮箱"></el-table-column>
      <el-table-column prop="gitlab_email" label="gitlab邮箱"></el-table-column>
      <el-table-column prop="role" label="角色"></el-table-column>
      <el-table-column prop="created_at" label="创建时间"></el-table-column>
      <el-table-column prop="created_by" label="创建人"></el-table-column>
      <el-table-column prop="last_updated_at" label="最近更新时间"></el-table-column>
      <el-table-column prop="last_updated_by" label="最近更新人"></el-table-column>
      <el-table-column prop="is_deleted" label="是否禁用">
        <template slot-scope="scope">
          <p v-if="scope.row.is_deleted == 0" style="color: green;">正常</p>
          <p v-else-if="scope.row.is_deleted == 1" style="color: red;">已禁用</p>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <div style="padding-top: 2px; padding-bottom: 2px;">
            <el-button
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
              @click="deleteItem(scope.row)"
              v-if="scope.row.login_code != 'admin'"
            >
              <span v-if="scope.row.is_deleted == '0'">禁用</span>
              <span v-else-if="scope.row.is_deleted == '1'">启用</span>
            </el-button>
          </div>
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
      userList: [],
      loading: false
    };
  },
  methods: {
    cellStyle() {
      return "text-align: center;";
    },
    headerCellStyle() {
      return "text-align: center; background-color: lightgrey; height: 40px;";
    },
    list_users() {
      http
        .get("/admin/user/list")
        .then(response => {
          this.userList = response.data;
        })
        .catch(error => {
          this.$message.error("查询失败");
        });
    },
    toUpdate(id) {
      this.$router.push({
        path: "/updateUser",
        query: {
          id: id
        }
      });
    },
    deleteItem(row) {
      var id = row.id;
      var keyword = row.is_deleted == 0 ? "禁用" : "启用";
      this.$confirm("确认" + keyword + "？")
        .then(_ => {
          http
            .delete("/admin/user/" + id, {
              data: { is_deleted: 1 - row.is_deleted }
            })
            .then(response => {
              if (response.data.status == "OK") {
                this.$message({
                  showClose: true,
                  message: keyword + "成功",
                  type: "success"
                });
                this.list_users();
              } else {
                this.$message.error("禁用失败");
              }
            })
            .catch(error => {
              this.$message.error("禁用失败");
            });
        })
        .catch(_ => {
          this.$message("已取消");
        });
    }
  },
  created() {
    this.list_users();
  }
};
</script>
<style scoped>
.userList {
  margin: auto;
  margin-top: 10px;
  width: 100%;
}
.userList td {
  width: 100px;
}
</style>
