<template>
  <div>
    <div style="margin-top: 10px;">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>后端发布</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/publishList' }">发布列表</el-breadcrumb-item>
        <el-breadcrumb-item>发布详情</el-breadcrumb-item>
        <el-breadcrumb-item>{{ this.$route.query.name }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div style="margin-top: 5px; text-align: right; font-size: 12px; margin-right: 15px;">
      <span v-if="socket.connected" style="color: blue;">Socket connected</span>
      <span v-if="socket.disconnected" style="color: red;">Socket disconnected</span>
      <el-divider direction="vertical"></el-divider>自动滚动日志：
      <el-switch v-if="socket.connected" v-model="scroll_switch" @change="scroll_publish"></el-switch>
    </div>
    <el-divider content-position="left">
      <span style="font-size: 12px;">发布进度</span>
    </el-divider>
    <el-steps :active="active" finish-status="success" align-center style="font-size: 12px;">
      <el-step title="准备环境"></el-step>
      <el-step title="从git克隆工程"></el-step>
      <el-step title="maven打包"></el-step>
      <el-step title="检查上传环境"></el-step>
      <el-step title="上传远程服务器"></el-step>
      <el-step title="执行远程发布脚本"></el-step>
      <el-step title="发布收尾工作"></el-step>
    </el-steps>
    <el-divider content-position="left">
      <span style="font-size: 12px;">发布日志</span>
    </el-divider>
    <div class="publish_detail" id="terminal">
      <el-scrollbar style="height: 100%;" ref="el_scrollbar">
        <div
          class="publish"
          ref="log_output"
          v-html="log_output"
          @scroll="scroll_publish(false)"
          :style="publish_style"
        ></div>
      </el-scrollbar>
      <el-backtop target=".publish" :bottom="100">
        <div
          id="publish_div"
          style="{
        height: 100%;
        width: 100%;
        background-color: #f2f5f6;
        box-shadow: 0 0 6px rgba(0,0,0, .12);
        text-align: center;
        line-height: 25px;
        color: #1989fa;
      }"
        >UP</div>
      </el-backtop>
    </div>
  </div>
</template>
<script>
import http from "../util/http.js";
import { stringify } from "querystring";
import io from "socket.io-client";
export default {
  data() {
    return {
      log_output: "",
      scroll_switch: true,
      scroll_top: 0,
      publish_style: {
        overflowY: "auto",
        width: "99%",
        height: "550px"
      },
      active: -1,
      steps: {
        $step0: 0,
        $step1: 1,
        $step2: 2,
        $step3: 3,
        $step4: 4,
        $step5: 5,
        $step6: 6,
        $step7: 7
      },
      socket: {
        connected: false,
        disconnected: true
      }
    };
  },
  methods: {
    getStepIndex(lineContent) {
      if (lineContent != null && lineContent.indexOf("$step") != -1) {
        for (var key in this.steps) {
          if (lineContent.indexOf(key) != -1) {
            return this.steps[key];
          }
        }
      }
      return null;
    },
    getCookie(cookieName) {
      var strCookie = document.cookie;
      var arrCookie = strCookie.split("; ");
      for (var i = 0; i < arrCookie.length; i++) {
        var arr = arrCookie[i].split("=");
        if (cookieName == arr[0]) {
          return arr[1];
        }
      }
      return "";
    },
    async publish_init() {
      if (!this.$route.query.id) {
        this.$message({
          message: "发布ID不可为空",
          type: "warning"
        });
        return;
      }

      await http
        .post("/publish", { id: this.$route.query.id })
        .then(response => {
          if (response.data.status == "FAILED") {
            this.$message({
              message: "请先登录",
              type: "warning"
            });
            let _this = this;
            setTimeout(function() {
              _this.$router.push({
                path: "/userLogin"
              });
            }, 1000);
            return;
          }
          this.$message({
            showClose: true,
            message: "开始发布...",
            type: "success"
          });
        })
        .catch(error => {
          console.error(error);
        })
        .then(() => {});

      const socket = io(process.env.VUE_APP_DOMAIN_BASE_URL);
      this.socket = socket;
      
      socket.on("connect", () => {
        socket.emit("publish_event", { id: this.$route.query.id });
      });

      socket.on("publish_response_" +
          this.getCookie("session_id") +
          "_" +
          this.$route.query.id,
        data => {
          if (data.message) {
            this.$message({
              message: data.message,
              type: "warning"
            });
          }
          if (data.data) {
            this.log_output += data.data + "<br/>";
            var stepIndex = this.getStepIndex(data.data);
            if (stepIndex != null) {
              this.active = stepIndex;
            }
            this.scroll_publish(null);
          }
          if (data.status && data.status == "OK") {
            const h = this.$createElement;
            this.$notify({
              title: "发布状态",
              message: h(
                "i",
                { style: "color: green" },
                this.$route.query.name + "发布成功，详情请查看发布日志"
              ),
              duration: 0
            });
          }
          if (data.status && data.status == "FAILED") {
            const h = this.$createElement;
            this.$notify({
              title: "发布状态",
              message: h(
                "i",
                { style: "color: grey" },
                this.$route.query.name + "发布失败，详情请查看发布日志"
              ),
              duration: 0
            });
          }
        }
      );
    },
    scroll_publish(manual_switch) {
      if (!this.scroll_switch) {
        return;
      }
      var div = this.$refs.log_output;
      // socket调用时，加载时机的问题处理
      if (!div) {
        return;
      }
      // 如果人为打开开关，则自动滚动
      if (
        (manual_switch != null && manual_switch) ||
        div.scrollTop >= this.scroll_top
      ) {
        this.$nextTick(() => {
          div.scrollTop = div.scrollHeight;
          this.scroll_top = div.scrollTop; // 标记当前滚动的位置，为下次识别是否人为滚动做准备
        });
      } else {
        // 如果人为向上滚动，则停止自动滚动
        this.scroll_switch = false;
      }
    },
    resize_div() {
      var height_used = this.$refs.log_output.getBoundingClientRect().top;
      this.publish_style.height = `${document.documentElement.clientHeight -
        height_used -
        1}px`;
      this.publish_style.width = `${document.documentElement.clientWidth * 1 -
        38}px`;
    }
  },
  mounted() {
    // 自适应窗口
    this.resize_div();
    window.onresize = this.resize_div;
    // js修改样式
    document.getElementsByClassName("el-scrollbar__view")[0].style +=
      ";overflow-x: hidden;";
    document.getElementsByClassName("el-divider--horizontal")[0].style.margin =
      "8px 0";
  },
  created() {
    this.publish_init();
  }
};
</script>
<style scoped>
.publish_detail {
  overflow-x: hidden;
}
.publish {
  text-align: left;
  border: 1px solid lightgray;
}
.el-step__title {
  font-size: 12px;
  line-height: 18px;
}
</style>
