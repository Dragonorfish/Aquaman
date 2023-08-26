<template>
    <div class="hot_blogs">
        <h3 class="comment_title">热门文章</h3>
        <div class="hot_blog_item" v-for="item in hotBlogList">
            <div class="blog_title">{{item.artTitle}}</div>
            <div class="read_count">
                <div class="hot_author_info">
                    <img :src="item.authorAvatar" class="author_avatar">
                    <p class="author_name">{{item.authorName}}</p>
                </div>
                <img style="width: 20px;height: 20px" src="/src/assets/svgs/eye.svg">
                {{item.readCount}}
            </div>
        </div>
    </div>
</template>

<script setup>
    import {ref} from "vue"
    import { doActionByAqBack } from "../utils/ajaxService";
    import { getServer } from "../environment/environment";
    const hotBlogList=ref([]);
    new Promise((resolve,reject)=>{
      doActionByAqBack(
        getServer().aquamanBackDev,
        "AqArticleController",
        "getHotArticle",
      ).subscribe((response) => {
        console.log(response);
        hotBlogList.value=response.data.content
      })
    })
</script>

<style scoped>
    .hot_blogs{
        width: 100%;
        background-color: #2b2b2b;
        border-radius: 20px;
        box-shadow: #00a4a2 0px 0px 10px 5px;
        display: flex;
        flex-direction: column;
        opacity: 0.8;
        padding: 2rem;
        padding-top: 1rem;
        box-sizing: border-box;
        margin-left: 2rem;
        color: whitesmoke;
    }

    .hot_blog_item{
        margin-top: 10px;
        background-color: #1a1a1a;
        padding: 1rem;
        padding-bottom: 0.5rem;
        box-sizing: border-box;
        border-radius: 10px;
        transition: 0.2s;
        cursor: url("/src/assets/pointer1.cur"),auto;
    }
    .hot_blog_item:hover{
        box-shadow: inset #0d8b89 0px 0px 10px 1px;
    }
    .comment_title{
        font-size: 24px;
        color: whitesmoke;
    }
    .read_count{
        line-height: 20px;
        display: flex;
        align-items: center;
    }
    .blog_title{
        text-overflow: ellipsis;
        overflow: hidden;
        font-size: 18px;
    }
    .hot_author_info{
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .author_name{
        font-weight: 300;
        color: #a8abb2;
    }
    .author_avatar{
        width: 20px;
        height: 20px;
    }
</style>