<template>
    <div class="mdeditor_body">
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
import { getServer } from "../../environment/environment";
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
    .mdeditor_body{
        display: flex;
        flex-direction: row;
        border: 5px solid #00a4a2;
        border-radius: 20px;
        box-shadow:0px 0px 20px 0px #00a4a2;
        height: 45rem;
        padding: 0px;
    }
    .article_options{
        width: 25%;
        height: 100%;
        background-color: black;
        margin-left: 1px;
        border-radius: 0px 15px 15px 0px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .title_input{
        width: 85%;
        height: 40px;
        background-color: transparent;
        border-radius: 10px;
        outline: none;
        color: aqua;
        border: 2px solid lightseagreen;
        margin: 1rem;
    }
    .title_input:focus{
        border: 2px solid aquamarine;
        box-shadow:0px 0px 20px 0px #00a4a2;
    }
    .act_btns{
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
    }
    .act_btns button{
        width: 7rem;
        height: 3rem;
        margin: 0.6rem;
        font-size: 15px;
        font-weight: 600;
        border-radius: 10px;
        opacity: 0.8;
    }
    #save_article{
        background-color: #e6a23c;

    }
    #save_article:hover{
        opacity: 1;
    }
    #pub_article{
        background-color: #00a4a2;
        color: whitesmoke;
    }
    #pub_article:hover{
        opacity: 1;
    }
    .img_uploader{
        width: 150px;
        height: 150px;
        border: 2px solid #00a4a2;
    }
    .img_uploader:hover{
        border: 2px solid aquamarine;
    }

</style>
