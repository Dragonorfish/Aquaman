<template>
    <div class="color_box">
        <div class="comment_item_body">
            <div class="article_title_box" @click="toArticle" >{{comment.commentTitle}}</div>
            <div style="display: flex;flex-direction: row;align-items: center">
                <div :style="{width:'30px',height:'30px',marginTop:'1rem',backgroundSize:'contain',backgroundImage:`url(${comment.userAVATAR})`}"></div>
                <div style="line-height:30px;margin-left:5px;margin-top: 1rem;font-size: 20px">{{comment.userName}}：</div>
                <div style="line-height:30px;margin-top: 1rem;font-size: 20px;text-wrap: normal;word-break: break-all">{{comment.commentContent}}</div>
            </div>
            <div style="margin-top: 10px;color: #a8abb2;opacity: 0.8">评论于{{comment.addTime}}</div>
        </div>
    </div>
</template>

<script setup>
    import router from "../router";

    const props=defineProps({
      comment:{}
    })
    function toArticle(){
      router.push("/article/"+props.comment.familyId);
      searchWord.value="";
    }
</script>

<style scoped>
    .color_box{
        padding: 2px;
        box-sizing: border-box;
    }
    .comment_item_body{
        color: #c0c0c0;
        display: flex;
        flex-direction: column;
        padding: 1rem;
        padding-right: 2rem;
        padding-left: 2rem;
        box-sizing: border-box;
        background-color: #2b2b2b;
        border-radius: 10px;
    }
    .article_title_box{
        width: 100%;padding: 1rem;
        box-sizing: border-box;
        background-color: #1a1a1a;
        border-radius: 10px;
        transition: color 0.2s;
    }
    .article_title_box:hover{
        cursor: url('/src/assets/pointer1.cur'),auto;
        color: #818384;
    }
</style>