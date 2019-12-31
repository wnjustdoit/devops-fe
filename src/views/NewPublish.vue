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
      <el-divider><span style="color: lightgrey;">项目基本信息</span></el-divider>
      <el-form-item label="发布名称" prop="name">
        <el-input v-model="publishment.name" placeholder="eg: develop_youxuan_supplier_web"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="publishment.description" placeholder="eg: 妈妈优选供应商web端（线下环境）"></el-input>
      </el-form-item>
      <el-divider><span style="color: lightgrey;">git相关信息</span></el-divider>
      <el-form-item label="git仓库地址" prop="git_repo_id">
        <el-select
          v-model="publishment.git_repo_id"
          filterable
          placeholder="请选择"
          @change="resetBranch()"
        >
          <el-option
            v-for="item in git_repo_options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="git分支" prop="git_branches">
        <el-select v-model="publishment.git_branch_type" placeholder="请选择">
          <el-option
            v-for="item in git_branch_types"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-select
          v-model="publishment.git_branches"
          multiple
          placeholder="请选择（支持多选）"
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
      <el-divider><span style="color: lightgrey;">maven打包相关信息</span></el-divider>
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
        <el-input v-model="publishment.source_file_dir" placeholder="eg: target 或者 youxuan-web/target"></el-input>
      </el-form-item>
      <el-divider><span style="color: lightgrey;">目标服务器信息</span></el-divider>
      <el-form-item label="目标服务器" prop="to_ip">
        <el-select
          v-model="publishment.to_ip"
          multiple
          filterable
          allow-create
          placeholder="请选择或输入（支持多项）"
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
      <el-form-item label="目标服务器进程名关键词" prop="to_process_name">
        <el-input
          v-model="publishment.to_process_name"
          placeholder="eg: xiaodian-usercenter(-1.0.0-SNAPSHOT.jar) 杀死进程和发布时版本通常省略"
        ></el-input>
      </el-form-item>
      <el-form-item label="java变量" prop="to_java_opts">
        <el-input
          v-model="publishment.to_java_opts"
          placeholder="eg: -Xms768m -Xmx768m 线下可配置区间值如：-Xms256m -Xmx1024m"
        ></el-input>
      </el-form-item>
      <el-divider><span style="color: lightgrey;">发布完毕后git相关操作</span></el-divider>
      <el-form-item label="发布完毕合并到git分支" prop="git_merged_branch">
        <el-select
          v-model="publishment.git_merged_branch"
          clearable
          placeholder="请选择"
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
      <el-form-item label="发布完毕后打标签名" prop="git_tag_version">
        <el-input v-model="publishment.git_tag_version" placeholder="eg: v1.0.0"></el-input>
      </el-form-item>
      <el-form-item label="发布完毕后打标签注释" prop="git_tag_comment">
        <el-input v-model="publishment.git_tag_comment" placeholder="eg: 项目的第一个版本"></el-input>
      </el-form-item>
      <el-form-item label="发布完毕后是否删除临时分支" prop="git_delete_temp_branch" style="text-align: left;">
        <el-switch v-model="publishment.git_delete_temp_branch"></el-switch>
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
        git_branch_type: "branches",
        git_branches: [],
        profile: null,
        source_file_dir: null,
        to_ip: [],
        to_project_home: null,
        to_process_name: null,
        to_java_opts: null,
        git_merged_branch: null,
        git_tag_version: null,
        git_tag_comment: null,
        git_delete_temp_branch: null
      },
      git_repo_options: [],
      git_branch_types: [
        {
          value: "branches",
          label: "分支"
        },
        {
          value: "tags",
          label: "标签"
        },
        {
          value: "commits",
          label: "提交记录"
        }
      ],
      git_branch_options: [
        // {
        //   value: "master",
        //   label: "master"
        // }
      ],
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
        ],
        to_process_name: [
          {
            required: true,
            message: "请输入目标服务器项目进程名",
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
          console.log("error: " + error);
        })
        .then(() => {
          this.loading = false;
        });
    },
    get_git_repo_branches() {
      if (!this.publishment.git_repo_id) {
        this.$message({
          message: "请先选择一个git仓库",
          type: "warning"
        });
        return;
      }
      this.loading = true;
      http
        .get(
          "/git/repo/" +
            this.publishment.git_repo_id +
            "/" +
            this.publishment.git_branch_type
        )
        .then(response => {
          // reset
          this.git_branch_options.length = 0;
          response.data.forEach(branch => {
            var branch_value =
              // this.publishment.git_branch_type == "tags" ||
              this.publishment.git_branch_type == "commits"
                ? branch + "@" + this.publishment.git_branch_type
                : branch;
            this.git_branch_options.push({
              value: branch_value,
              label: branch
            });
          });
        })
        .catch(error => {
          console.log("error: " + error);
        })
        .then(() => {
          this.loading = false;
        });
    },
    change_ip_group() {
      // console.log("========" + this.publishment.profile);
      // console.log(this._to_ip_options);
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
        if (valid) {
          console.log("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
      http
        .request({ url: "/publishment", method: "PUT", data: this.publishment })
        .then(response => {
          this.$message({
            showClose: true,
            message: "保存成功",
            type: "success"
          });
          this.$router.push({ path: "/publishList" });
        })
        .catch(error => {
          this.$message.error("保存失败");
        });
    },
    resetBranch() {
      this.publishment.git_branches = null;
      this.publishment.git_merged_branch = null;
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
