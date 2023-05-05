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
            <div class="act_btns">
                <button id="save_article">保存草稿</button>
                <button id="pub_article" @click="pubArticle">发布文章</button>
            </div>
        </div>
        <div id="warn"></div>
    </div>
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


let articleTitle=ref("")
let $text=''
let titleImgUrl=''
let buttonAccess=true
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
    }else if (articleTitle.value.replace(/^\s*$/, "").length<5){
        articleTitle.value=articleTitle.value.replace(/^\s*$/, "")
        ElMessage.error("文章标题不可少于5个字");
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
        userId:"9e8a3cca02aa419e81a3ee2fe7f146a9",
        title:articleTitle.value,
        titleImg:titleImgUrl
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
        }else {
            articleTitle.value=""
            $text=''
            titleImgUrl=''
            router.push("/pubSuccess");
        }
    });
}

</script>

<style scoped>
    @import "style.css";
</style>
