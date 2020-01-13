<template>
  <div>
    <div>
      <span>{{ $socket.connected ? 'Socket connected' : 'Socket disconnected' }}</span>
      <span>
        <span class="notification" v-if="$socket.disconnected" style="color: red;">
          <el-divider direction="vertical"></el-divider>You are disconnected
        </span>
      </span>
      <el-divider direction="vertical"></el-divider>
      <el-switch
        v-model="scroll_switch"
        active-text="自动滚动"
        inactive-text="取消"
        @change="scroll_publish"
      ></el-switch>
    </div>
    <el-divider style="margin:10px 0;" content-position="left">发布日志如下：</el-divider>
    <div class="publish_detail">
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
export default {
  data() {
    return {
      log_output: "",
      scroll_switch: true,
      scroll_top: 0,
      publish_style: {
        overflowY: "auto",
        width: "1300px",
        height: "550px"
      }
    };
  },
  sockets: {
    connect() {
      console.log("socket connected");
    }
  },
  methods: {
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
      // 当首次cookie为空时，写完cookie后重连websocket（其他改进策略：换原生websocket，更好的掌控整个websocket生命周期）
      // 终极改进：TODO 用户登录后，直接用会话的cookie标识
      var reconnect = true;//this.getCookie("publish_client_id") == "";
      await http
        .post("/publishFe", { id: this.$route.query.id })
        .then(response => {
          this.$message({
            showClose: true,
            message: "正在发布...",
            type: "success"
          });
          if (reconnect) {
            // this.$socket.client.disconnect();
            this.$socket.client.connect();
          }
        })
        .catch(error => {
          console.error(error);
        })
        .then(() => {});

      this.$socket.client.emit("publish_event", {
        id: this.$route.query.id,
        type: "fe"
      });
      this.$socket.$subscribe(
        "publish_response_fe_" +
          this.getCookie("publish_client_id") +
          "_" +
          this.$route.query.id,
        data => {
          if (data.message) {
            this.$message({
              message: data.message,
              type: "warning"
            });
          }
          if (data.data && this.$refs.log_output) {
            this.$refs.log_output.innerText += data.data;
            this.scroll_publish(null);
          }
          if (data.status && data.status == "OK") {
            const h = this.$createElement;
            this.$notify({
              title: "发布状态",
              message: h(
                "i",
                { style: "color: green" },
                data.project + "发布结束，详情请查看发布日志"
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
      // console.log("=====" + this.scroll_switch + ", " + manual_switch + ", " + div.scrollTop + ", " + div.scrollHeight);
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
      // console.log('================' + document.documentElement.clientHeight + ', ' + document.documentElement.clientWidth);
      var height_used = this.$refs.log_output.getBoundingClientRect().top;
      this.publish_style.height = `${document.documentElement.clientHeight -
        height_used -
        1}px`;
      this.publish_style.width = `${document.documentElement.clientWidth *
        0.95}px`;
    }
  },
  mounted() {
    // document.getElementById("fe_vue").className =
    //   document.getElementById("fe_vue").className + " el-menu-item is-active";

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
</style>
