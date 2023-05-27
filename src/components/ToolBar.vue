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

            <span class="route_button" id="button7">
                发布
                <div class="button_tab" id="child_tab" v-if="pubBoxIsShow">
                    <button class="route_button" id="button7-1" @click="ToMdEditor">文章</button>
                    <button class="route_button" id="button7-2" @click="ToPubTalk">说说</button>
                </div>
            </span>
            <button class="route_button" id="button8" @click="ToTest">测试</button>
        </div>
        <div class="self_box">
            <div class="button_tab" id="user_tab" v-if="userBoxIsShow">
                <div class="color_box" id="self_info_box">
                    <div class="self_card">
                        <span class="user_name">{{userInfo.userName}}</span>
                        <div class="user_info">
                            <div class="user_info_item">
                                <span class="info_text_title">文章</span>
                                <span class="info_text">25</span>
                            </div>
                            <div class="user_info_item">
                                <span class="info_text_title">说说</span>
                                <span class="info_text">11</span>
                            </div>
                            <div class="user_info_item">
                                <span class="info_text_title">评论</span>
                                <span class="info_text">64</span>
                            </div>
                        </div>
                        <SplitLine></SplitLine>
                    </div>
                </div>
            </div>
            <div class="user_avatar" :style="{backgroundImage:'url('+userInfo.userAVATAR+')'}" id="button6"/>
        </div>
    </div>
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
        font-weight: 900;
        overflow: hidden;
        width: 150px;
        margin-top: 2rem;
        font-size: 20px;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow-wrap: break-word;

    }
</style>


<script setup>
  import router from "../router";
  import { nextTick, onMounted, ref } from "vue";
  import { doActionByAqBack } from "../utils/ajaxService";
  import { getServer } from "../environment/environment";
  import {debounce} from "../utils/utilsService.ts"

  const userInfo = ref({
    userAVATAR: "src/assets/static/weblogo.png",
    userName: "admin"
  });
  const userBoxIsShow = ref(false);
  const pubBoxIsShow = ref(false);

  initUser({ userId: JSON.parse(localStorage.getItem("userInfo")).userId });


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
      console.log(userInfo.value);
    });
  }

  function ToHome() {
    router.push("/home");
  }

  function ToMdEditor() {
    router.push("/bloggingPage");
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
</script>
