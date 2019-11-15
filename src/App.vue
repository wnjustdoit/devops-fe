<template>
  <div id="app">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
    >
      <el-menu-item index="1">
        <router-link to="/">首页</router-link>
      </el-menu-item>
      <el-submenu index="2">
        <template slot="title">后端发布</template>
        <el-menu-item index="2-1">
          <router-link to="/newPublish">新建发布</router-link>
        </el-menu-item>
        <el-menu-item index="2-2">
          <router-link to="/publishList">发布列表</router-link>
        </el-menu-item>
        <el-menu-item index="2-2">
          <router-link to="/gitRepoList">GitLab信息列表</router-link>
        </el-menu-item>
      </el-submenu>
      <el-submenu index="3">
        <template slot="title">静态资源发布（cdn）</template>
        <el-menu-item index="3-1">
          <router-link to="/newPublishStatic">新建发布</router-link>
        </el-menu-item>
        <el-menu-item index="3-2">
          <router-link to="/publishStaticList">发布列表</router-link>
        </el-menu-item>
      </el-submenu>
      <el-submenu index="4">
        <template slot="title">前端发布（vue）</template>
        <el-menu-item index="4-1">
          <router-link to="/newPublishFe">新建发布</router-link>
        </el-menu-item>
        <el-menu-item index="4-2">
          <router-link to="/publishFeList">发布列表</router-link>
        </el-menu-item>
      </el-submenu>
      <el-submenu index="5">
        <template slot="title">nodejs发布</template>
        <el-menu-item index="5-1">
          <router-link to="/newPublishNode">新建发布</router-link>
        </el-menu-item>
        <el-menu-item index="5-2">
          <router-link to="/publishNodeList">发布列表</router-link>
        </el-menu-item>
      </el-submenu>
      <el-menu-item index="6">
        <router-link to="/">最近发布</router-link>
      </el-menu-item>
      <el-menu-item index="7">
        <a href="#" target="_blank">
          <router-link to="/about">用户管理</router-link>
        </a>
      </el-menu-item>
    </el-menu>
    <router-view />
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeIndex: "1"
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>
<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding: 60px;
}
</style>
