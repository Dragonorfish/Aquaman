<template>
    <div class="page_body">
        <div class="article_view_body" v-if="!isLoading">
            <div class="article_box">
                <div class="article_tag">#{{articleInfo.sign}}</div>
                <div class="title" id="article_title">{{articleInfo.artTitle}}</div>
                <div class="author_info">
                    <div class="author_avatar" :style="{backgroundImage:`url(${author.userAVATAR})`}"></div>
                    <div class="author_name">{{author.userName}}</div>
                    <div class="pub_time">发布于&nbsp;{{articleInfo.addTime}}</div>
                </div>
                <div class="article_card" ref="articleCard" v-html="articleInfo.artContent">
                </div>
                <CommentArea :familyId="articleInfo.id" :type="$type" style="width: 100%;margin-top: 4rem"></CommentArea>
            </div>
            <div class="article_info">
                <UserInfoItem :author="author"></UserInfoItem>
                <LatestComment :authorId="author.id"></LatestComment>
                <ArticleContent @contentItemClick="contentAct"
                                :articleHTML="articleInfo.artContent"
                                :contentHovering="contentHovering"
                ></ArticleContent>
            </div>
        </div>
        <Loading v-if="isLoading"></Loading>
    </div>
</template>


<style scoped>
    @import "article.css";

</style>

<script setup>
  import { markdownToHtml, markdownToHtmlWithoutLink } from "../../utils/MarkdownUtils";
  import { doActionByAqBack } from "../../utils/ajaxService";
  import { getServer } from "../../environment/environment";
  import { ref, watch,reactive, nextTick, onMounted } from "vue";
  import {throttle} from "/src/utils/utilsService";
  const props=defineProps({
    articleId:""
  })
  const $type="article"
  let isLoading = ref(true);
  const titles=[];
  let element={};
  let contentHovering=ref({
      innerText:""
  });
  let articleInfo = ref({
    id: props.articleId,
    userId: "",
    artTitle: "",
    artContent: ""
  });
  let author = ref({});

  onMounted(() => {
    initArticle();
  });

  async function initArticle() {
    isLoading.value=true;
    let queryAriticleData = {
      id: articleInfo.value.id
    };
    articleInfo.value = await getArticle(queryAriticleData);
    articleInfo.value.artContent = markdownToHtml(articleInfo.value.artContent.replace(/^(\s|")+|(\s|")+$/g, "")
      .replace(/\\n/g, "\n").replace(/\\t/g, "\t").replace(/\\"/g, "\""));
    getAuthor({ userId: articleInfo.value.userId });
  }

  function getArticle(queryData) {
    return new Promise((resolve, reject) => {
      doActionByAqBack(
        getServer().aquamanBackDev,
        "AqArticleController",
        "getArticleById",
        queryData
      ).subscribe((response) => {
        resolve(response.data);
      });
    });
  }

  function getAuthor(queryData) {
    doActionByAqBack(
      getServer().aquamanBackDev,
      "AqUserController",
      "getAuthor",
      queryData
    ).subscribe((response) => {
      author.value = response.data;
      console.log(response);
      isLoading.value = false;
      nextTick(() => {
        document.getElementById("article_title").scrollIntoView({
          behavior: "smooth"
        });
        element=document.getElementsByClassName("article_card")[0]
        Array.from(element.children).forEach((el,index)=>{
          window.addEventListener('scroll',titleScrollEvt,true)
          if (el.nodeName==="H2"||el.nodeName==="H3"){
            titles.push(el);
          }
        })
        console.log(titles);
        contentHovering.value=titles[0];
      });
    });
  }

  const titleScrollEvt=throttle(()=>{
    titles.forEach((title,index)=>{
      if (index===titles.length-1){
        if (title.getBoundingClientRect().y<=200){
          contentHovering.value=title;
          console.log(contentHovering.value.innerText);
        }
      }else {
        if (title.getBoundingClientRect().y<=200&&titles[index+1].getBoundingClientRect().y>200){
          contentHovering.value=title;
          console.log(contentHovering.value.innerText);
        }
      }
    })
    // console.log(titles[0].getBoundingClientRect());

  },200)


  function contentAct(text){
    titles.forEach((title)=>{
      if (title.innerHTML===text){
          title.scrollIntoView({
              behavior: "smooth"
          });
      }
    })
  }

  watch(props,()=>{
    articleInfo.value ={
      id: props.articleId,
      userId: "",
      artTitle: "",
      artContent: ""
    };
    initArticle();
  })
</script>

