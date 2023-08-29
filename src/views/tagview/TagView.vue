<template>
    <div class="page_body" id="tag_body">
        <h1 class="page_title">标签目录</h1>
        <div class="tag_box">
            <TagShow :type="'page'" :tagList="tagList.slice(1,tagList.length)"></TagShow>
        </div>
    </div>
</template>

<script setup>
    import {ref} from "vue";
    import { doActionByAqBack } from "../../utils/ajaxService";
    import { getServer } from "../../environment/environment";
    const tagList=ref([]);
    initTag();
    function initTag(){
        tagList.value=[];
        return new Promise((resolve,reject)=>{
          doActionByAqBack(
            getServer().aquamanBackDev,
            "AqArticleController",
            "getAllTags"
          ).subscribe((response) => {
            tagList.value.push(["全部",0]);
            response.data.forEach((item)=>{
              tagList.value.push([item.tagName,item.articleNum]);
            })
            resolve();
          });
        })
    }
</script>

<style scoped>
    #tag_body{
        height: 600px;
    }
    .tag_box{
        width: 100%;
        height: 100%;
        background-color: #2b2b2b;
        border-radius: 20px;
        box-sizing: border-box;
        padding: 2rem;
    }
</style>