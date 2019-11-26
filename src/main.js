import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import VueSocketIOExt from "vue-socket.io-extended";
import io from "socket.io-client";

Vue.use(ElementUI);

const socket_url = process.env.NODE_ENV == 'development' ? 'http://192.168.1.132:5000' : 'http://192.168.1.248:5000';
const socket = io(socket_url);
Vue.use(VueSocketIOExt, socket, { store });

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
