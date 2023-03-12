<template>
  <div>
    <div class="comment_body" v-if="!isLoading">
      <div class="comment_card">
        <h1>评论</h1>
        <div class="comment_area">
          <img :src="userInfo.userAVATAR" class="avatar"/>
          <textarea maxlength="1500" class="comment_input" placeholder="添加评论..." v-model="commentText"></textarea>
        </div>
        <button class="comment_btn" @click="addComment(1,props.familyId,props.familyId)" :disabled="addBtndisable">添加评论</button>
      </div>
      <SplitLine class="split_line"></SplitLine>
      <div class="comment_list">
        <div class="comment_item" v-for="item in commentList">
          <img :src="item.userAVATAR" class="avatar"/>
          <div class="comment_box">


            <div class="comment">
              <span class="comment_text">{{item.commentContent}}</span>
              <div class="comment_info">
                <span>{{item.userName}}</span>
                <span style="color: #a8abb2">发布于</span>
                <span>{{item.addTime.substring(0,10)}}</span>
                <button @click="openReplyBox(item.id)">回复</button>
              </div>
            </div>


            <div :id="item.id" class="reply_box">
              <div class="reply_area">
                <img style="margin-left: 0" :src="userInfo.userAVATAR" class="avatar"/>
                <textarea style="height: 10rem" maxlength="1500" class="comment_input" placeholder="添加回复..." v-model="commentText"></textarea>
              </div>
              <div class="btns">
                <button style="background-color: #e6a23c;" class="comment_btn" @click="openReplyBox(item.id)" :disabled="addBtndisable">取消</button>
                <button class="comment_btn" @click="addComment(2,props.familyId,item.id)" :disabled="addBtndisable">回复</button>
              </div>
            </div>


            <div class="reply_comment" v-for="child in item.children">
              <img :src="child.userAVATAR" class="avatar"/>
              <div class="comment_box">
                <div class="comment">
                  <span class="comment_text">{{child.commentContent}}</span>
                  <div class="comment_info">
                    <span>{{child.userName}}</span>
                    <span style="color: #a8abb2">发布于</span>
                    <span>{{child.addTime.substring(0,10)}}</span>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </div>
      </div>
      <div style="width: 100%;justify-content: center;display: flex;flex-direction: row">
        <button class="load_all" v-if="!loadAlldDisable" @click="getAllComment">加载全部</button>
      </div>

    </div>
    <Loading v-if="isLoading"></Loading>
  </div>
</template>

<script setup>
  import SplitLine from "../components/SplitLine.vue"
  import { useUserStore } from "../stores/modules/userStore";

  import {ref} from "vue"
  import { doActionByAqBack } from "../utils/ajaxService";
  import { getServer } from "../environment/environment";
  import { ElMessage } from "element-plus";
  import 'element-plus/es/components/message/style/css';
  import 'element-plus/es/components/message-box/style/css';

  let isLoading=ref(true)
  const props = defineProps({
    familyId:String
  })

  let addBtndisable=ref(false);
  let userInfo=JSON.parse(localStorage.getItem("userInfo"));
  let commentText=ref("");
  let loadAlldDisable=ref(true);
  let commentList=ref({});


  initCommentList()




  function openReplyBox(id){
      document.getElementById(id).style.display=document.getElementById(id).style.display==='flex'?"none":"flex"
  }
  function initCommentList() {
    const queryData={
      familyId:props.familyId
    }
    doActionByAqBack(
      getServer().aquamanBackDev,
      "AqArticleController",
      "getCommentByFamilyIdByPage",
      queryData
    ).subscribe((response) => {
      console.log(response.data)
      if (response.data.length===11){
        loadAlldDisable=false;
      }
      commentList.value=response.data;
      isLoading.value=!isLoading;
    });
  }
  function getAllComment() {
    const queryData={
      familyId:props.familyId
    }
    return new Promise((resolve, reject) => {
      doActionByAqBack(
        getServer().aquamanBackDev,
        "AqArticleController",
        "getCommentByFamilyId",
        queryData
      ).subscribe((response) => {
        console.log(response.data)
        commentList.value=response.data
      });
    })
  }
  function addComment(level,familyId,upId) {
    addBtndisable.value=true;
    if(commentText.value.trim().length===0){
      addBtndisable.value=false;
      ElMessage.error("评论内容不能为空");
      return;
    }
    const queryData={
      userId:userInfo.id,
      familyId:familyId,
      upId:upId,
      level:level,
      commentContent:commentText.value
    }
      doActionByAqBack(
        getServer().aquamanBackDev,
        "AqArticleController",
        "addComment",
        queryData
      ).subscribe(async (response) => {
        if (Reflect.has(response,"code")){
          ElMessage.error("服务器或网络异常，评论添加失败");
        }else {
          commentText.value="";
          ElMessage.success("评论发表成功");
          commentList.value=await initCommentList();
        }
        console.log(response);
        addBtndisable.value=false;
      });
  }
</script>

<style scoped>
    .comment_body{
      width: 100%;
      height: auto;
      background-color:transparent;
      border-radius: 30px;
      box-shadow:0px 0px 20px 0px #00a4a2;
      border: 1px transparent solid;
    }
    h1{
      position: relative;
      padding-bottom: 0.75rem;
      margin: 3rem;
      margin-bottom: 1rem;
      color: whitesmoke;
    }
  h1:after{
    border-radius: 9999px;
    height: 0.25rem;
    position: absolute;
    bottom: 0;
    width: 6rem;
    content: "";
    background-image: linear-gradient(to right,aquamarine,orange);
    left: 0;
  }
  .comment_card{
    display: flex;
    flex-direction: column;
    width: 80%;
  }
  .comment_area{
    display: flex;
    flex-direction: row;
  }
  .avatar{
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    margin-left: 3rem;
  }
  .comment_input{
    width: 100%;
    height: 15rem;
    background-color: #2b2b2b;
    border-radius: 20px;
    margin: 1rem;
    color: whitesmoke;
    padding: 1rem;
    font-size: 18px;
    resize: none;
    border: 3px #00a4a2 solid;
    outline: none;
    opacity: 0.8;
  }
  .btns{
    align-self: end;
  }
  .comment_btn{
    position: relative;
    background-color: #00a4a2;
    color: whitesmoke;
    width: 7rem;
    height: 3rem;
    margin: 0.6rem;
    font-size: 15px;
    font-weight: 600;
    border-radius: 10px;
    opacity: 0.8;
    border: none;
    align-self: end;
  }
  .comment_btn:hover{
    opacity: 1;
    animation: highlight 0.2s ease-out;
  }
  @keyframes highlight {
    0%{opacity: 0.8;}
    100%{opacity: 1;}
  }
  .split_line{
    margin-top: 3rem;
    margin-bottom: 3rem;
  }
  .comment_list{
    color: whitesmoke;
    display: flex;
    flex-direction: column;
  }
  .comment_item{
    display: flex;
    flex-direction: row;
    margin-bottom: 2rem;
  }
  .comment_box{
    display: flex;
    flex-direction: column;
    max-width: 60%;
    min-width: 200px;
  }
  .comment{
    display: flex;
    flex-direction: column;
    background-color: #2b2b2b;
    border-radius: 15px;
    margin-left: 0.75rem;
    margin-top: 0.5rem;
    padding: 1rem;
    position: relative;
  }
  .comment:before{
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    border-right: 8px solid #2b2b2b;
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
    left: -8px;
    top: 14px;
  }
  .comment_info{
    display: flex;
    flex-direction: row;
    margin-top: 1rem;
    padding-right: 3rem;
    position: relative;
  }
    .comment_info button{
      background-color: transparent;
      border:none;
      color: aquamarine;
      position: absolute;
      right: 0;
    }
  @media (max-width: 646px) {
    .comment_info{
      flex-direction: column;

    }
    .comment_info button{
      bottom: 0;
    }
  }
  .comment_info span{
    margin-right: 0.75rem;
    font-size: 13px;
    opacity: 0.6;
  }
  .load_all{
    font-size: 20px;
    color: aquamarine;
    background-color: transparent;
    border: none;
    margin: 1rem;
    margin-bottom: 2rem;
  }
    .load_all:hover{
      opacity: 0.8;
    }
  .reply_box{
    display: none;
    flex-direction: column;
    margin-top: 1rem;

  }
  .reply_area{
    display: flex;
    flex-direction: row;
    animation: appear 0.3s ease-out;
  }
  @keyframes appear {
    0%{margin-right: 100%;
      opacity: 0;
    }
    100%{margin-right: 0;
      opacity: 1;
    }
  }
  .reply_comment{
    display: flex;
    flex-direction: row;
    margin-top: 1rem;
  }
  .reply_comment .comment_info{
    flex-direction: column;
  }
</style>
