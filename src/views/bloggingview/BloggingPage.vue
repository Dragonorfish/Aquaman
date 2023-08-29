<template>
    <div id="mdeditor_body" class="page_body">
        <MdEditor class="md_editor" @getText="getText"></MdEditor>
        <div class="article_options">
            <div class="article_img">
                <div class="img_uploader">
                    <AvaUpload @getImgUrl="getImgUrl"></AvaUpload>
                </div>
                <p style="color: #a8abb2;display: flex;justify-content: center;margin: 1rem">请上传文章封面</p>
            </div>
            <input class="title_input" v-model="articleTitle" placeholder="请输入文章标题">
            <div style="width: 90%">
                <TagBox :itemList="tagList" @tagClick="tagClick"></TagBox>
            </div>
            <div class="act_btns">
                <button id="tag_add" @click="tagAddBtnClick">添加标签</button>
                <button id="pub_article" @click="pubArticle">发布文章</button>
            </div>
        </div>
        <div id="warn"></div>
    </div>
    <ConfirmAlert @callBack="tagAddCallBack" v-if="tagAddBoxIsShow">
        <div class="tag_add_box">
            <input v-model="tagName" class="title_input" placeholder="标签名">
        </div>
    </ConfirmAlert>
</template>

<script setup>
import MdEditor from "../../components/MdEditor.vue"
import AvaUpload from "../../components/UploadImg.vue"
import { Observable } from "rxjs";
import {ref} from 'vue';
import { doActionByAqBack } from "../../utils/ajaxService";
import { ElMessage } from 'element-plus';
import 'element-plus/es/components/message/style/css';
import 'element-plus/es/components/message-box/style/css';
import * as _sh from "lodash";
import router from "../../router";
import { getServer } from "../../environment/environment";


let articleTitle=ref("")
let $text=''
let titleImgUrl=''
let buttonAccess=true
let articleTag=ref("")
let tagAddBoxIsShow=ref(false)
let tagName=ref("")
let tagList=ref([]);

initTag()

function getText(text) {
  $text=text;
}
function getImgUrl(url) {
    titleImgUrl=url;
}
function pubArticle() {
    if (buttonAccess===false){
        return;
    }else if (articleTitle.value.replace(/^\s*$/, "").length===0){
        articleTitle.value=articleTitle.value.replace(/^\s*$/, "")
        ElMessage.error("文章标题不能为空");
        return;
    }else if (articleTitle.value.replace(/^\s*$/, "").length<1){
        articleTitle.value=articleTitle.value.replace(/^\s*$/, "")
        ElMessage.error("文章标题不可少于1个字");
        return;
    }else if(articleTitle.value.replace(/^\s*$/, "").length>100){
        articleTitle.value=articleTitle.value.replace(/^\s*$/, "")
        ElMessage.error("文章标题不可大于100字");
        return;
    }else if(titleImgUrl.length===0){
        ElMessage.error("请上传文章封面");
        return;
    }else if($text.trim().length===0){
        ElMessage.error("文章内容不能为空");
        return;
    }else if(articleTag.value.trim().length===0){
      ElMessage.error("请选择文章标签");
      return;
    }
    buttonAccess=false;
    let i=0;
    const timer=setInterval(()=>{
        if (i===5){
            buttonAccess=true;
            clearInterval(timer)
        }else {
            i+=1;
        }
    },1000)
    const queryData={
        userId:JSON.parse(localStorage.getItem("userInfo")).userId,
        title:articleTitle.value,
        titleImg:titleImgUrl,
        tag:articleTag.value
    }
    doActionByAqBack(
        getServer().aquamanBackDev,
        "AqArticleController",
        "addArticle",
        queryData,
        $text
    ).subscribe((response) => {
        if (["ERR_NETWORK", "ERR_BAD_RESPONSE"].indexOf(_sh.get(response,"code", null))!==-1){
            ElMessage.error("网络或服务器波动，文章发布失败");
        }else if (["500"].indexOf(_sh.get(response.data,"code", null))!==-1){
            ElMessage.error(response.data.msg);
        } else {
            articleTitle.value="";
            $text='';
            titleImgUrl='';
            router.push("/pubSuccess");
        }
    });
}

function tagAddBtnClick() {
    tagAddBoxIsShow.value=true;
}

function initTag() {
  tagList.value=[];
  new Promise((resolve,reject)=> {
    doActionByAqBack(
      getServer().aquamanBackDev,
      "AqArticleController",
      "getAllTags"
    ).subscribe((response) => {
      response.data.forEach((item) => {
        tagList.value.push([item.tagName])
      })
      resolve();
    });
  })
}

function tagClick(tag) {
    articleTag.value=tag;
}

function tagAddCallBack(bool) {
    if (!bool){
      tagAddBoxIsShow.value=false;
    }else if(tagName.value.trim().length<=0){
      ElMessage.error("不能为空");
    } else {
      new Promise((resolve,reject)=>{
        doActionByAqBack(
          getServer().aquamanBackDev,
          "AqArticleController",
          "addTag",
          {
              tag:tagName.value.trim()
            }
        ).subscribe((response) => {
          console.log(response);
          if (response.data.code==="200"){
            ElMessage.success(response.data.data);
            tagAddBoxIsShow.value=false
          }else {
            ElMessage.error(response.data.data);
          }
          resolve();
        }).then(()=>{
          tagName.value="";
        });
      });
      initTag();
    }
}
</script>

<style scoped>
    @import "style.css";
</style>
