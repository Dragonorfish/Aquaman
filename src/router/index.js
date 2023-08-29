import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "homePage",
      component: () => import("../views/homeview/HomePage.vue"),
      children:[
        {
          path: "/bloggingPage",
          name: "bloggingPage",
          component: () => import("../views/bloggingview/BloggingPage.vue")
        },
        {
          path: "/home",
          name: "home",
          component: () => import("../views/homeview/Home.vue")
        },
        {
          path: "/article/:id",
          name: "article",
          component: () => import("../views/articleview/ArticleView.vue"),
          props: (route) => ({articleId: route.params.id})
        },
        {
          path: "/about",
          name: "about",
          component: () => import("../views/aboutview/AboutView.vue")
        },
        {
          path: "/pubTalk",
          name: "pubTalk",
          component: () => import("../views/talkview/TalkPubView.vue")
        },
        {
          path: "/test",
          name: "test",
          component: () => import("../views/testview/test.vue"),
        },
        {
          path: "/talk",
          name: "talk",
          component: () => import("../views/talkview/TalkView.vue"),
        },
        {
          path: "/talkdetail/:id",
          name: "talkdetail",
          component: () => import("../views/talkview/TalkDetailView.vue"),
        },
        {
          path: "/usercenter/:userId",
          name: "usercenter",
          component: () => import("../views/userview/UserView.vue"),
          props: (route) => ({userId: route.params.userId})
        },
        {
          path: "/tags",
          name: "tags",
          component: () => import("../views/tagview/TagView.vue"),
        },
        {
          path: "/blogpage/:tag",
          name: "blogpage",
          component: () => import("../views/bloggingview/BlogPage.vue"),
          props: (route) => ({tag: route.params.tag})
        },

      ]
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/loginview/login.vue")
    },
    {
      path: "/register",
      name: "register",
      component: () => import("../views/loginview/Register.vue")
    },
    {
      path: "/pubSuccess",
      name: "pubSuccess",
      component: ()=>import("../views/tipsview/PubSuccessPage.vue")
    },
    {
      path: "/404",
      name: "404",
      component: ()=>import("../views/tipsview/404.vue")
    }
  ],
});

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next();
  } else if (to.path === '/register'){
    next();
  } else {
    let token = localStorage.getItem('token');
    console.log(token)
    if (token === null || token === '') {
      next('/login');
    }else if(to.path==="/"){
      next('/home')
    } else {
      if (to.matched.length === 0) {
        next('/404')
      } else {
        next();
      }
    }
  }
});

export default router;
