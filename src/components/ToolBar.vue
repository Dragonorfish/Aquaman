<template>
    <div class="tool_bar">
        <div class="logo">
            <div class="back_logo"></div>
            <p style="font-weight:500">海王汇智</p>
            <p style="font-size:25px">cnaquaman</p>
        </div>
        <div class="route_buttons">
            <div class="back_color"></div>
            <button class="route_button" id="button1" @click="ToHome">首页</button>
            <button class="route_button" id="button2" @click="ToTalk">说说</button>
            <button class="route_button" id="button3" @click="ToAbout">关于</button>

            <SearchBox></SearchBox>

            <button class="route_button" id="button9" @click="ToTag">标签</button>

            <span class="route_button" id="button7">
                发布
                <div class="button_tab" id="child_tab" v-if="pubBoxIsShow">
                    <button class="route_button" id="button7-1" @click="ToMdEditor">文章</button>
                    <button class="route_button" id="button7-2" @click="ToPubTalk">说说</button>
                </div>
            </span>
        </div>
        <div class="self_box">
            <div class="button_tab" id="user_tab" v-if="userBoxIsShow">
                <div class="color_box" id="self_info_box">
                    <div class="self_card">
                        <span class="user_name">{{userInfo.userName}}</span>
                        <span class="self_sign">{{userInfo.personSign}}</span>
                        <div class="user_info">
                            <div class="user_info_item">
                                <span class="info_text_title">文章</span>
                                <span class="info_text">{{userInfo.articleCount}}</span>
                            </div>
                            <div class="user_info_item">
                                <span class="info_text_title">说说</span>
                                <span class="info_text">{{userInfo.talkCount}}</span>
                            </div>
                            <div class="user_info_item">
                                <span class="info_text_title">评论</span>
                                <span class="info_text">{{userInfo.commentCount}}</span>
                            </div>
                        </div>
                        <SplitLine></SplitLine>
                        <div class="user_buttons">
                            <div v-if="useUserStore().userData.loginStatus" class="user_button" @click="ToUserCenter">个人主页</div>
                            <div v-if="useUserStore().userData.loginStatus" class="user_button">设置</div>
                            <div v-if="useUserStore().userData.loginStatus" class="user_button" @click="logOut">登出</div>
                            <div v-if="!useUserStore().userData.loginStatus" class="user_button" @click="logIn">登陆</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="user_avatar" id="button6"/>
        </div>
    </div>
    <ConfirmAlert v-if="loginAlertIsShow" @callBack="loginClick">
        <login :islogin="isLogin" @loginCallBack="loginCallBack"></login>
    </ConfirmAlert>
    <ConfirmAlert v-if="alertIsShow" confirmMessage="确认登出?" @callBack="resetFn"></ConfirmAlert>
</template>


<style scoped>
    @import "/src/components/toolBar.css";

    .self_card {
        width: 97%;
        height: 97%;
        margin: 1.5%;
        border-radius: 20px;
        background-color: #2b2b2b;
        color: powderblue;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .user_name {
        text-align: center;
        font-weight: 900;
        overflow: hidden;
        width: 200px;
        margin-top: 2rem;
        font-size: 20px;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow-wrap: break-word;

    }

    .self_sign{
        color: whitesmoke;
        opacity: 0.8;
        font-size: 18px;
        margin-top: 1rem;
    }

    .user_buttons{
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: 1rem;
        color: whitesmoke;
    }
    .user_button{
        height: 50px;
        width: 80%;
        text-align: center;
        line-height: 50px;
        font-size: 18px;
        font-weight: 600;
        opacity: 0.8;
        position: relative;
        transition: all 0.3s;
    }
    .user_button::after{
        content: "";
        width: 0;
        left: 50%;
        transform: translateX(-50%);
        box-sizing: border-box;
        height: 2px;
        position: absolute;
        background-image: linear-gradient(to left,transparent,gray,transparent);
        transition: all 0.3s;
    }
    .user_button::before{
        content: "";
        width: 0;
        left: 50%;
        transform: translateX(-50%);
        /*transform: translateY(80px);*/
        box-sizing: border-box;
        top: 100%;
        height: 2px;
        position: absolute;
        background-image: linear-gradient(to left,transparent,gray,transparent);
        transition: all 0.3s;
    }

    .user_button:hover{
        cursor: url("../assets/pointer1.cur"),auto;
    }
    .user_button:hover::after{
        width: 100%;
    }
    .user_button:hover::before{
        width: 100%;
    }
</style>


<script setup>
  import router from "../router";
  import { nextTick, onMounted, ref } from "vue";
  import { doActionByAqBack } from "../utils/ajaxService";
  import { getServer } from "../environment/environment";
  import {resetUser} from "../utils/utilsService";
  import login from "../views/loginview/login.vue";
  import { useUserStore } from "../stores/modules/userStore.ts"
  import { ElMessage } from "element-plus";
  let alertIsShow=ref(false);
  let loginAlertIsShow=ref(false);
  let isLogin=ref(false);
  const userInfo = ref({
    userAVATAR: "/src/assets/svgs/defaultAvt.svg",
    userName: "未登陆"
  });
  const userBoxIsShow = ref(false);
  const pubBoxIsShow = ref(false);

  if (localStorage.getItem("userInfo")){
    initUser({ userId: JSON.parse(localStorage.getItem("userInfo")).userId });
  }
  onMounted(() => {
    document.getElementById("button7").addEventListener("mouseover", function(e) {
      pubBoxIsShow.value = true;
    });
    document.getElementById("button7").addEventListener("mouseleave", function(e) {
      pubBoxIsShow.value = false;
    });
    document.querySelector(".self_box").addEventListener("mouseover", function(e) {
      document.querySelector(".user_avatar").className = "user_avatar_hover";
      userBoxIsShow.value = true;
    });
    document.querySelector(".self_box").addEventListener("mouseleave", function(e) {
      document.querySelector(".user_avatar_hover").className = "user_avatar";
      userBoxIsShow.value = false;
    });

  });

  function initUser(queryData) {
    doActionByAqBack(
      getServer().aquamanBackDev,
      "AqUserController",
      "getAuthor",
      queryData
    ).subscribe((response) => {
      userInfo.value = response.data;
      useUserStore().userData.loginStatus=true;
      document.getElementById("button6").style.backgroundImage='url('+userInfo.value.userAVATAR+')'
    });
  }
  function resetFn(bool) {
    if (bool){
      resetUser();
      userInfo.value={
        userAVATAR: "/src/assets/svgs/defaultAvt.svg",
          userName: "未登陆"
      }
      useUserStore().userData.loginStatus=false;
    }
    alertIsShow.value=false;
  }

  function logOut() {
    alertIsShow.value=true;
  }
  function logIn() {
    loginAlertIsShow.value=true;
  }
  function loginClick(bool) {
    if (bool){
      isLogin.value=true;
    }else {
      isLogin.value=false;
      loginAlertIsShow.value=false;
    }
  }
  function loginCallBack(status) {
    if (status){
      ElMessage.success('登陆成功')
      initUser({userId: JSON.parse(localStorage.getItem("userInfo")).userId })
      loginAlertIsShow.value=false;
    }
  }

  function ToHome() {
    router.push("/home");
  }

  function ToMdEditor() {
    router.push("/bloggingPage");
  }
  function ToTag() {
    router.push("/tags");
  }

  function ToPubTalk() {
    router.push("/pubTalk");
  }

  function ToTest() {
    router.push("/test");
  }

  function ToAbout() {
    router.push("/about");
  }

  function ToTalk() {
    router.push("/talk");
  }
  function ToUserCenter() {
    router.push("/usercenter/"+JSON.parse(localStorage.getItem("userInfo")).userId);
  }
</script>
