<template>
    <div class="latest_comment">
        <h3 class="comment_title">最新评论</h3>
        <div v-if="commentList.length>0" class="comment_item" v-for="item in commentList">
            <div class="article_title">{{item.commentTitle}}</div>
            <div class="comment_info">{{item.userName}}:{{item.commentContent}}</div>
        </div>
        <div v-if="commentList.length===0" style="color: #a8abb2;font-size: 24px;text-align: center;font-weight: 600;opacity: 0.8">空空如也~</div>
    </div>
</template>

<style scoped>
    .latest_comment{
        width: 100%;
        background-color: #2b2b2b;
        margin-top: 2rem;
        border-radius: 20px;
        box-shadow: #00a4a2 0px 0px 10px 5px;
        display: flex;
        flex-direction: column;
        opacity: 0.8;
        padding: 2rem;
        box-sizing: border-box;
    }
    .comment_title{
        font-size: 24px;
        color: whitesmoke;
    }
    .comment_item{
        color: whitesmoke;
        background-color: #1a1a1a;
        padding: 16px;
        box-sizing: border-box;
        border-radius: 10px;
    }
    .article_title{
        overflow: hidden;
        text-wrap: normal;
        word-break: break-all;
        font-size: 18px;
        line-height: 24px;
        color: #a8abb2;
        cursor: url("/src/assets/pointer1.cur"),auto;
        transition: 0.2s;

    }
    .article_title:hover{
        color: #00a4a2;
    }
    .comment_info{
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp:2;
        overflow-wrap: break-word;
        font-size: 18px;
        line-height: 24px;
    }
</style>

<script setup>
    import {ref} from "vue"
  import { doActionByAqBack } from "../utils/ajaxService";
  import { getServer } from "../environment/environment";

  const props=defineProps({
    authorId:String
  })

  const commentList=ref([])

  new Promise((resolve,reject)=>{
    doActionByAqBack(
      getServer().aquamanBackDev,
      "AqArticleController",
      "getLatestCommentByAuthorId",
      {authorId:props.authorId}
    ).subscribe((response) => {
      console.log(response.data)
      commentList.value=response.data
    });
  })


</script>

