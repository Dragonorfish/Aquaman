<template>
    <div class="tool-bar">
        <div class="logo">
            <div class="back_logo"></div>
            <p style="font-weight:500">海王汇智</p>
            <p style="font-size:25px">cnaquaman</p>
        </div>
        <div class="route_buttons">
            <div class="back_color"></div>
            <button class="route_button" id="button1" @click="ToHome">首页</button>
            <button class="route_button" id="button2">说说</button>
            <button class="route_button" id="button3" @click="ToAbout">关于</button>
            <button class="route_button" id="button4">搜索</button>
            <button class="route_button" id="button5">消息</button>
            <button class="route_button" id="button6">账户</button>
            <button class="route_button" id="button7" @click="ToMdEditor">发布</button>
            <button class="route_button" id="button8" @click="ToTest">测试</button>
        </div>
    </div>
</template>

<script setup>
  import router from "../router";
  import MdEditor from "../components/MdEditor.vue"

  function ToHome(){
    router.push("/home")
  }
  function ToMdEditor(){
    router.push("/bloggingPage")
  }
  function ToTest(){
      router.push("/test")
  }
  function ToAbout(){
      router.push("/about")
  }
</script>

<style scoped>
    .tool-bar{
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: center;
        width: 100%;
        max-width: 1524px;
        animation: appear 0.5s ease-out;
        margin-left: auto;
        margin-right: auto;
        height: 200px;
    }
    .logo{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-right: 40px;
        position: relative;
    }
    .back_logo{
        background-image: url("../assets/static/weblogo.png");
        background-size: 95%;
        width: 200%;
        height: 290%;
        position: absolute;
        opacity: 0.2;
    }
    .logo p{

        color: darkturquoise;
        font-family:Microsoft Yahei;
        font-size:35px;
        font-weight: 900;
        display: flex;
        flex-direction: row;
        justify-content: center;
        text-shadow: 2px 2px 10px black;
        animation: font_act 1s linear 0s infinite alternate;
    }
    .route_buttons{
        display: flex;
        flex-direction: row;
        align-items: center;
        height:60px ;
        position: relative;
        overflow: auto;
    }
    .back_color{
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: black;
        border-radius: 30px;
        opacity: 0.3;

    }
    .route_button{
        height: 40px;
        width: 4rem;
        background: transparent;
        font-size: 16px;
        color: whitesmoke;
        margin: 5px;
        border: transparent;
        border-radius: 20px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        z-index: 1;
    }
    .route_button:hover{
        background: #2e2e2e;
        animation: color 0.4s ease-out;

    }
    @keyframes color {
        0%{background: transparent;}
        100%{background: #2e2e2e;}
    }
    @keyframes font_act {
        0%{text-shadow: 0px 0px 9px black;}
        100%{text-shadow: 0px 0px 13px black;}
    }
    @media (max-width: 1080px) {
        #button7{
            display: none;
        }
    }
</style>
