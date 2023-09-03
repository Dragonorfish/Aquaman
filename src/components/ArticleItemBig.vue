<template>
    <div class="item_box">
      <div class="bg_img" :style="{backgroundImage:'url('+titleImg+')'}"></div>
      <div class="bg_color"></div>
      <div class="art_info">
        <div @click="toArtContent" class="title">
          <p style="
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp:1;
            overflow-wrap: break-word;">
            {{articleInfo.artTitle}}
          </p>
        </div>
        <div class="article_tag">
          <div style="color: #00a4a2;font-weight: 600">
            {{articleInfo.sign}}
          </div>
          <div style="font-style: italic;">
            &nbsp;#{{articleInfo.sign}}
          </div>
          <div class="comment_icon">
          </div>
          <div style="margin-left:3px">{{articleInfo.commentCount}}</div>
        </div>
        <div class="artIntroduction">{{articleInfo.artContent.replace(/^(\s|")+|(\s|")+$/g, '').replace(/\\n/g, '\n').slice(0,200)}}</div>
        <div class="pub_info">
          <img :src="articleInfo.authorAvatar" class="author_avatar">
          <p class="author_name">{{articleInfo.authorName}}</p>
        </div>
        <p class="pub_time">发布于 {{articleInfo.addTime}}</p>
      </div>
    </div>
</template>

<script setup>
  import {toRefs,reactive,ref} from "vue";
  import { markdownToHtmlWithoutLink } from "../utils/MarkdownUtils";
  import router from "../router";
  const props = defineProps({
      articleInfo: {
        type:Object,
        default:{
          titleImg:"",
          artContent:"",
          artTitle:""
        }
      }
  })
  // const articleContent=props.articleInfo.artContent.replace(/^(\s|")+|(\s|")+$/g, '').replace(/\\n/g, '\n').slice(0,200);
  let titleImg=ref("https://aquaman-1314140460.cos.ap-beijing.myqcloud.com/aquamanIcon/defaultBgPic.png")
  props.articleInfo.addTime=props.articleInfo.addTime.substring(0,10);
  preLoadImg()
  function preLoadImg() {
    let img = new Image()
    img.src=props.articleInfo.titleImg
    img.onload=()=>{
      titleImg.value=props.articleInfo.titleImg;
    }
  }
  function toArtContent() {
    router.push("/article/"+props.articleInfo.id);
  }
</script>

<style scoped>
  .item_box{
    width: 100%;
    height: 100%;
    border-radius: 15px;
    position: relative;
    animation: contract linear 0.1s;
    cursor: url("../assets/pointer1.cur"),auto;
  }
  @keyframes expand {
    0%{transform: scale(1);}
    100%{transform: scale(1.01);}
  }
  @keyframes contract {
    0%{transform: scale(1.01);}
    100%{transform: scale(1.00);}
  }
  .bg_color{
    width: 100%;
    height: 100%;
    background-image: linear-gradient(to right,transparent,transparent,#0B4252,#0B4252,#0B4252,#2b2b2b);
    position: absolute;
    border-radius: 15px;
  }
  .comment_icon{
    transform: rotateY(180deg);
    height: 16px;
    background-size: contain;
    margin-left: 5px;
    background-repeat: no-repeat;
    width: 20px;
    background-image: url('/src/assets/svgs/commentIcon.svg');
  }
  .bg_img{
    height: 100%;
    width: 50%;
    background-repeat: no-repeat;
    background-size: cover;
    position: absolute;
    border-radius: 15px;
  }
  .title{
    color: whitesmoke;
    text-decoration: none;
    font-size:2.5rem;
    font-weight: 900;
    text-align: start;
    width: 90%;
    padding-top: 2rem;
    cursor: url("../assets/pointer1.cur"),auto;
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp:1;
    overflow-wrap: break-word;
  }
  .title:hover{
    color: darkgray;
    animation: discoloration 0.2s ease-out;

  }
  .article_tag{
    color: #a8abb2;
    margin-left: 1rem;
    font-size: 20px;
    display: flex;
    flex-direction: row;

  }
  @keyframes discoloration {
    0%{color: whitesmoke;}
    100%{color: darkgray;}
  }
  .artIntroduction{
    margin: 1rem;
    margin-top: 10px;
    color: #c0c0c0;
    font-size: 20px;
    line-height: 1.5rem;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp:5;
    overflow-wrap: break-word;
  }
  .art_info{
    position: relative;
    left: 45%;
    width: 52%;
    height: 100%;
  }
  .pub_info{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    margin-top: 1.5rem;
    margin-bottom: 0.2rem;
    position: absolute;
    bottom: 3rem;
  }
  p{
    margin-left: 5px;
  }
  .author_avatar{
    width: 25px;
    height: 25px;
    border-radius: 50%;
    margin-left: 1rem;
  }
  .author_name{
    font-size: 20px;
    color: whitesmoke;
  }
  .author_avatar:hover{
    opacity: 0.7;
  }
  .author_name:hover{
    opacity: 0.7;
  }
  .pub_time{
    display: flex;
    margin-left: 3rem;
    color: gray;
    font-size: 18px;
    position: absolute;
    bottom: 25px;
  }
  @media (max-width: 500px) {
    .artIntroduction{
      -webkit-line-clamp:3;
    }

  }

</style>
