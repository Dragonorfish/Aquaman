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
  console.log(from,to)
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
        next();
    }
  }
});

export default router;
