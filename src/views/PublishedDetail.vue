<template>
  <div>
    <el-divider style="margin:10px 0;" content-position="left">
      <span style="font-size: 12px;">发布日志详情：</span>
    </el-divider>
    <div class="publish_detail">
      <el-scrollbar style="height: 100%;" ref="el_scrollbar">
        <div class="publish" ref="log_output" v-html="log_output" :style="publish_style"></div>
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
      publish_style: {
        overflowY: "auto",
        width: "1300px",
        height: "550px"
      }
    };
  },
  methods: {
    publish_init() {
      if (!this.$route.query.id) {
        this.$message({
          message: "发布ID不可为空",
          type: "warning"
        });
        return;
      }

      http
        .get("/publishmentLog/" + this.$route.query.id)
        .then(response => {
          this.$refs.log_output.innerText = response.data.content;
        })
        .catch(error => {
          this.$message.error("查询失败");
        });
    },
    resize_div() {
      // console.log('================' + document.documentElement.clientHeight + ', ' + document.documentElement.clientWidth);
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
