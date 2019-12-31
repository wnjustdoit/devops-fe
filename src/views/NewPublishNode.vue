<template>
  <div class="publish">
    <el-form
      ref="publishment"
      :model="publishment"
      :rules="rules"
      label-position="right"
      label-width="200px"
      v-loading="loading"
    >
      <el-form-item label="发布名称" prop="name">
        <el-input v-model="publishment.name" placeholder="eg: develop_xiaodian_fe_nodejs"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="publishment.description" placeholder="eg: 进货商城门店前端nodejs（线下环境）"></el-input>
      </el-form-item>
      <el-form-item label="git仓库地址" prop="git_repo_id">
        <el-select v-model="publishment.git_repo_id" filterable placeholder="请选择">
          <el-option
            v-for="item in git_repo_options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="git分支" prop="git_branches">
        <el-select
          v-model="publishment.git_branches"
          multiple
          placeholder="请选择（单选）"
          @click.native="get_git_repo_branches()"
        >
          <el-option
            v-for="item in git_branch_options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发布环境" prop="profile">
        <el-select v-model="publishment.profile" placeholder="请选择">
          <el-option
            v-for="item in profile_options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发布文件位置（相对）" prop="source_file_dir">
        <el-input
          v-model="publishment.source_file_dir"
          placeholder="eg: childfolder1/grandchildfolder1"
        ></el-input>
      </el-form-item>
      <el-form-item label="目标服务器" prop="to_ip">
        <el-select
          v-model="publishment.to_ip"
          multiple
          filterable
          allow-create
          placeholder="请选择或输入（单选）"
          @click.native="change_ip_group()"
          @focus="change_ip_group()"
        >
          <el-option-group v-for="group in to_ip_options" :key="group.label" :label="group.label">
            <el-option
              v-for="item in group.options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-option-group>
        </el-select>
      </el-form-item>
      <el-form-item label="目标服务器项目目录" prop="to_project_home">
        <el-input
          v-model="publishment.to_project_home"
          placeholder="eg: /data/project/mama_[project_name]"
        ></el-input>
      </el-form-item>
      <el-form-item style="text-align: left;">
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import http from "../util/http.js";
export default {
  data() {
    return {
      publishment: {
        name: null,
        description: null,
        git_repo_id: null,
        git_branches: [],
        profile: null,
        to_ip: [],
        to_project_home: null
      },
      git_repo_options: [],
      git_branch_options: [
        {
          value: "master",
          label: "master"
        }
      ],
      profile_options: [
        {
          value: "test",
          label: "开发环境（test）"
        },
        {
          value: "pre",
          label: "预发环境（pre）"
        },
        {
          value: "build",
          label: "生产环境（build）"
        }
      ],
      to_ip_options: [
        {
          label: "线下",
          options: [
            {
              value: "192.168.1.248",
              label: "192.168.1.248"
            },
            {
              value: "192.168.1.249",
              label: "192.168.1.249"
            },
            {
              value: "192.168.1.251",
              label: "192.168.1.251"
            }
          ]
        },
        {
          label: "预发",
          options: [
            {
              value: "47.96.18.198",
              label: "47.96.18.198"
            }
          ]
        },
        {
          label: "线上",
          options: [
            {
              value: "114.55.232.195",
              label: "114.55.232.195"
            },
            {
              value: "118.178.128.57",
              label: "118.178.128.57"
            },
            {
              value: "47.110.153.206",
              label: "47.110.153.206"
            },
            {
              value: "47.110.154.253",
              label: "47.110.154.253"
            }
          ]
        }
      ],
      rules: {
        name: [
          { required: true, message: "请输入发布名称", trigger: "blur" },
          { min: 3, max: 50, message: "长度在3到50个字符", trigger: "blur" }
        ],
        description: [
          { required: true, message: "请输入发布名称", trigger: "blur" },
          { min: 5, max: 100, message: "长度在5到100个字符", trigger: "blur" }
        ],
        git_repo_id: [
          { required: true, message: "请选择git仓库地址", trigger: "change" }
        ],
        git_branches: [
          { required: true, message: "请选择git分支名称", trigger: "change" }
        ],
        profile: [
          { required: true, message: "请选择发布环境", trigger: "change" }
        ],
        to_ip: [
          { required: true, message: "请选择目标服务器ip", trigger: "change" }
        ],
        to_project_home: [
          {
            required: true,
            message: "请输入目标服务器项目主目录",
            trigger: "blur"
          }
        ]
      },
      loading: false
    };
  },
  methods: {
    list_git_repos() {
      this.loading = true;
      http
        .get("/git/repos")
        .then(response => {
          this.git_repo_options.length = 0;
          response.data.forEach(repo => {
            this.git_repo_options.push({
              value: repo.id,
              label: repo.ssh_url_to_repo + " (" + repo.description + ")"
            });
          });
        })
        .catch(error => {
          this.$message.error("查询失败");
        })
        .then(() => {
          this.loading = false;
        });
    },
    get_git_repo_branches() {
      if (!this.publishment.git_repo_id) {
        return;
      }
      this.loading = true;
      http
        .get("/git/repo/" + this.publishment.git_repo_id + "/branches")
        .then(response => {
          this.git_branch_options.length = 0;
          response.data.forEach(branch => {
            this.git_branch_options.push({ value: branch, label: branch });
          });
        })
        .catch(error => {
          this.$message.error("查询失败");
        })
        .then(() => {
          this.loading = false;
        });
    },
    change_ip_group() {
      if (!this.publishment.profile) {
        return;
      }
      // if (this.publishment.profile == 'dev') {
      //   this.to_ip_options.length = 0;
      //   this.to_ip_options.push(this._to_ip_options[0]);
      // } else if (this.publishment.profile == 'pre') {
      //   this.to_ip_options.length = 0;
      //   this.to_ip_options.push(this._to_ip_options[1]);
      // } else if (this.publishment.profile == 'online') {
      //   this.to_ip_options.length = 0;
      //   this.to_ip_options.push(this._to_ip_options[2]);
      // }
    },
    onSubmit() {
      this.$refs["publishment"].validate(valid => {
        if (!valid) {
          return false;
        }
      });
      http
        .request({
          url: "/publishmentNodejs",
          method: "PUT",
          data: this.publishment
        })
        .then(response => {
          this.$message({
            showClose: true,
            message: "保存成功",
            type: "success"
          });
          this.$router.push({ path: "/publishListNode" });
        })
        .catch(error => {
          this.$message.error("保存失败");
        });
    },
    resetForm() {
      this.$refs["publishment"].resetFields();
    }
  },
  created() {
    this.list_git_repos();
  }
};
</script>
<style scoped>
@import "../assets/common.css";
</style>
