<template>
  <div>
    <!-- <div>
      <span>{{ $socket.connected ? 'Socket connected' : 'Socket disconnected' }}</span>
    </div>
    <span class="notification" v-if="$socket.disconnected" style="color:yellow">You are disconnected</span>
    <el-divider></el-divider>-->
    <div class="publish_detail">
      <el-scrollbar style="height: 100%;" ref="el_scrollbar">
        <div
          class="publish"
          ref="log_output"
          v-html="log_output"
          style="overflow-y: auto; width: 1300px; height: 550px;"
        ></div>
      </el-scrollbar>
      <el-backtop target=".publish" :bottom="100">
        <div
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
      log_output: null
    };
  },
  sockets: {
    connect() {
      console.log("socket connected");
    }
    // ,
    // publish_response: function(data) {
    //   console.log("server-side response: " + JSON.stringify(data));
    // }
  },
  methods: {
    async publish_init() {
      await http
        .post("/publish", { id: this.$route.query.id })
        .then(response => {
          this.$message({
            showClose: true,
            message: "正在发布...",
            type: "success"
          });
        })
        .catch(error => {
          console.error(error);
        })
        .then(() => {});

      this.$socket.client.emit("publish_event", { id: this.$route.query.id });
      this.$socket.$subscribe("publish_response", data => {
        if (data.message) {
          this.$message({
            message: data.message,
            type: "warning"
          });
        }
        if (data.data) {
          this.log_output += data.data + "<br/>";
        }
        if (data.status && data.status == "OK") {
          const h = this.$createElement;
          this.$notify({
            title: "发布状态",
            message: h(
              "i",
              { style: "color: green" },
              "发布结束，详情请查看发布日志"
            )
          });
        }
      });

      // console.log(this.$refs.el_scrollbar)
      // var div = this.$refs.el_scrollbar.wrap;
      // this.$nextTick(() => {
      //   div.scrollTop = div.scrollHeight;
      // });
    }
  },
  created() {
    this.publish_init();
  }
};
</script>
<style scoped>
.publish {
  text-align: left;
}
.el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>
