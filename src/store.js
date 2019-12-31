import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user_role: ""
  },
  mutations: {
    setUser (state, user) {
      if (user && user.role) {
        state.user_role = user.role;
      } else {
        state.user_role = "";
      }
    }
  },
  actions: {}
});
