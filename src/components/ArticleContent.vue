<template>
    <div class="article_content">
        <h3 class="content_title">目录</h3>
        <div v-for="item in parts" class="content_first">
            <div :class="item.name===props.contentHovering.innerText?'hover_item':'no_hover_item'" @click="contentItemClick">{{item.name}}</div>
            <div class="content_second" v-for="child in item.children">
                <div :class="child===props.contentHovering.innerText?'hover_item':'no_hover_item'" @click="contentItemClick">{{child}}</div>
            </div>
        </div>
    </div>
    <div class="article_copy" v-html="props.articleHTML" style="display: none"></div>
</template>

<script setup>
    import {ref,nextTick} from "vue";
    const props=defineProps({
        articleHTML:{},
        contentHovering:{
          innerText:"default"
        }
    })
    const emit=defineEmits(["contentItemClick"])
    const parts=ref([]);
    let element={};
    nextTick(()=>{
      initContent()
    })

    function initContent() {
      element=document.getElementsByClassName("article_copy")[0];
      let part={
        name:"",
        children:[]
      }
      Array.from(element.children).forEach((el,index)=>{
        if (el.nodeName==="H2"){
          if (part.name.length>0){
            parts.value.push(part);
            part={
              name:"",
              children:[]
            }
          }
          part.name=el.innerText;
        }
        if (el.nodeName==="H3"){
          part.children.push(el.innerText)
        }
        if (index===Array.from(element.children).length-1){
          if (part.name.length>0){
            parts.value.push(part);
            part={
              name:"",
              children:[]
            }
          }
        }
      })
      console.log(parts.value);
    }

    function contentItemClick(e) {
      emit("contentItemClick",e.target.innerText)
    }
</script>

<style scoped>
    .article_content{
        background-color: #2b2b2b;
        box-shadow: #00a4a2 0px 0px 10px 5px;
        margin-top: 2rem;
        border-radius: 15px;
        display: flex;
        flex-direction: column;
        padding: 2rem;
        color: whitesmoke;
        opacity: 0.8;
        position: sticky;
        top:0;

    }
    .content_title{
        font-size: 24px;
    }
    .content_second{
        margin: 1rem;
    }
    .no_hover_item{
        font-size: 18px;
        transition:opacity, 0.2s;
    }
    .no_hover_item:hover{
        opacity: 0.6;
        cursor: url("/src/assets/pointer1.cur"),auto;
    }
    .hover_item{
        color: #00a4a2;
        font-size: 18px;
        transition:opacity, 0.2s;
    }
</style>