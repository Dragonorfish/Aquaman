<template>
  <div id="talk_pub_body" class="page_body">
    <h2>发布说说</h2>
    <textarea placeholder="请说些什么吧..." class="talk_pub_card" v-model="talkText"></textarea>
    <uploadImgs class="imgs_upload" :imgList="imgList" @getImgList="getImgList"></uploadImgs>
    <button class="talk_pub_button" @click="pubTalk">发布</button>
  </div>
</template>

<style scoped>
  h2{
    color: whitesmoke;
  }
  #talk_pub_body{
    display: flex;
    flex-direction: column;
    width:90% ;
  }
  .talk_pub_card{
    height: 250px;
    outline: none;
    background-color: #2e2e2e;
    color: whitesmoke;
    border-radius: 15px;
    box-sizing: border-box;
    padding: 20px;
    font-size: 20px;
    resize: none;
    border: 2px solid lightseagreen;
    transition: box-shadow 0.3s;
  }
  .talk_pub_card:focus{
    border: 2px solid aquamarine;
    box-shadow:0px 0px 20px 0px #00a4a2;
  }
  .imgs_upload{
    margin-top: 2rem;
  }
  .talk_pub_button{
    align-self: end;
    margin: 2rem;
  }
</style>


<script setup>
  import {ref} from 'vue'
  import { doActionByAqBack } from "../../utils/ajaxService";
  import * as _sh from "lodash";
  import { ElMessage } from "element-plus";
  import router from "../../router";
  import { getServer } from "../../environment/environment";
  const talkText=ref("");
  const imgList=ref([]);
  let userInfo=JSON.parse(localStorage.getItem("userInfo"))

  function getImgList(imgs) {
      imgList.value=imgs.map(img=>img.url)
  }

  function pubTalk() {
    if(talkText.value.trim().length===0){
      ElMessage.error("文章内容不能为空");
      return;
    }else if (imgList.value.length>9){
      ElMessage.error("图片不能超过9张");
      return;
    }
    const queryData={
      userId:userInfo.userId
    }
    doActionByAqBack(
      getServer().aquamanBackDev,
      "AqTalkController",
      "addTalk",
      queryData,
      {talkContent:talkText.value,picList:imgList.value}
    ).subscribe((response) => {
      if (["ERR_NETWORK", "ERR_BAD_RESPONSE"].indexOf(_sh.get(response,"code", null))!==-1){
        ElMessage.error("网络或服务器波动，说说发布失败");
      }else {
        talkText.value="";
        imgList.value=[];
        router.push("/pubSuccess");
      }
    });
  }

</script>
