import Vue from "vue";
import Router from "vue-router";
import Index from "./views/Index.vue";

Vue.use(Router);
export default new Router({
  // mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "index",
      component: Index
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import("./views/About.vue")
    },
    {
      path: "/userLogin",
      name: "userLogin",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import("./views/UserLogin.vue")
    },
    {
      path: "/gitRepoList",
      name: "gitRepoList",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import("./views/GitRepoList.vue")
    },
    {
      path: "/newPublish",
      name: "newPublish",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import("./views/NewPublish.vue")
    },
    {
      path: "/updatePublish",
      name: "updatePublish",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import("./views/UpdatePublish.vue")
    },
    {
      path: "/publishList",
      name: "publishList",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import("./views/PublishList.vue")
    },
    {
      path: "/publishDetail",
      name: "publishDetail",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import("./views/PublishDetail.vue")
    },
    {
      path: "/newPublishStatic",
      name: "newPublishStatic",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import("./views/NewPublishStatic.vue")
    },
    {
      path: "/updatePublishStatic",
      name: "updatePublishStatic",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import("./views/UpdatePublishStatic.vue")
    }
    ,
    {
      path: "/publishListStatic",
      name: "publishListStatic",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import("./views/PublishListStatic.vue")
    },
    {
      path: "/publishDetailStatic",
      name: "publishDetailStatic",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import("./views/PublishDetailStatic.vue")
    },
    {
      path: "/newPublishFe",
      name: "newPublishFe",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import("./views/NewPublishFe.vue")
    },
    {
      path: "/updatePublishFe",
      name: "updatePublishFe",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import("./views/UpdatePublishFe.vue")
    }
    ,
    {
      path: "/publishListFe",
      name: "publishListFe",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import("./views/PublishListFe.vue")
    },
    {
      path: "/publishDetailFe",
      name: "publishDetailFe",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import("./views/PublishDetailFe.vue")
    },
    {
      path: "/newPublishNode",
      name: "newPublishNode",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import("./views/NewPublishNode.vue")
    },
    {
      path: "/updatePublishNode",
      name: "updatePublishNode",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import("./views/UpdatePublishNode.vue")
    }
    ,
    {
      path: "/publishListNode",
      name: "publishListNode",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import("./views/PublishListNode.vue")
    },
    {
      path: "/publishDetailNode",
      name: "publishDetailNode",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import("./views/PublishDetailNode.vue")
    },
    {
      path: "/publishedList",
      name: "publishedList",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import("./views/PublishedList.vue")
    },
    {
      path: "/publishedDetail",
      name: "publishedDetail",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import("./views/PublishedDetail.vue")
    },
    {
      path: "/newUser",
      name: "newUser",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import("./views/NewUser.vue")
    },
    {
      path: "/userList",
      name: "userList",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import("./views/UserList.vue")
    }
  ]
});
