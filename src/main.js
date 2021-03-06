import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import VueSocketIOExt from "vue-socket.io-extended";
import io from "socket.io-client";

Vue.use(ElementUI);

const socket = io(process.env.VUE_APP_DOMAIN_BASE_URL);
Vue.use(VueSocketIOExt, socket, { store });

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

import './assets/project.css'