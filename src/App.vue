<template>
  <div id="app">
    <Frame></Frame>
    <router-view />
  </div>
</template>
<script>
import Frame from "./Frame.vue";
export default {
  components: {
    Frame
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
  padding: 20px 10px 10px 10px;
}
</style>
