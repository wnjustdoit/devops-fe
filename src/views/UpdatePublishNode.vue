<template>
  <div class="publish">
    <el-form ref="form" :model="publishment" :rules="rules" label-width="200px" v-loading="loading">
      <el-form-item label="发布名称">
        <el-input v-model="publishment.name" placeholder="eg: develop_youxuan_supplier_web"></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="publishment.description" placeholder="eg: 妈妈优选供应商web端（线下环境）"></el-input>
      </el-form-item>
      <el-form-item label="git仓库地址">
        <el-select
          v-model="publishment.git_repo_id"
          filterable
          placeholder="请选择"
          @click="list_git_repos()"
          @change="resetBranch()"
        >
          <el-option
            v-for="item in git_repo_options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>*
      </el-form-item>
      <el-form-item label="git分支">
        <el-select
          v-model="publishment.git_branches"
          multiple
          placeholder="请选择（单选）"
          @focus="get_git_repo_branches()"
        >
          <el-option
            v-for="item in git_branch_options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发布环境">
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
        <el-input v-model="publishment.source_file_dir" placeholder="eg: assets"></el-input>
      </el-form-item>
      <el-form-item label="目标服务器">
        <el-select
          v-model="publishment.to_ip"
          multiple
          filterable
          allow-create
          placeholder="请选择或输入（单选）"
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
      <el-form-item label="目标服务器项目目录">
        <el-input
          v-model="publishment.to_project_home"
          placeholder="eg: /data/project/mama_[project_name]"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import http from "../util/http.js";
import { async } from "q";
export default {
  data() {
    return {
      publishment: {
        name: null,
        description: null,
        git_repo_id: null,
        git_branches: null,
        profile: null,
        source_file_dir: null,
        to_ip: null,
        to_project_home: null
      },
      git_repo_options: [],
      git_branch_options: [],
      profile_options: [
        {
          value: "dev",
          label: "开发环境（dev）"
        },
        {
          value: "test",
          label: "测试环境（test）"
        },
        {
          value: "pre",
          label: "预发环境（pre）"
        },
        {
          value: "online",
          label: "生产环境（online）"
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
    get_publishment() {
      http.get("/publishmentNodejs/" + this.$route.query.id).then(response => {
        this.publishment = response.data;
      });
    },
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
          this.$message.error("请求失败");
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
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    resetBranch() {
      this.publishment.git_branches = null;
    },
    onSubmit() {
      http
        .request({
          url: "/publishmentNodejs",
          method: "POST",
          data: this.publishment
        })
        .then(response => {
          this.$message({
            showClose: true,
            message: "修改成功",
            type: "success"
          });
          this.get_publishment();
        })
        .catch(error => {
          this.$message.error("修改失败");
        });
    }
  },
  mounted() {
    // document.getElementById("nodejs").className =
    //   document.getElementById("nodejs").className + " el-menu-item is-active";
  },
  created() {
    this.list_git_repos();
    this.get_git_repo_branches();
    this.get_publishment();
  }
};
</script>
<style scoped>
.publish {
  width: 800px;
  margin: auto;
}
.publish .el-select {
  width: 500px;
}
</style>
