<template>
  <div>
    <div class="article_view_body" v-if="!isLoading">
      <div class="article_box" >
        <div class="title">{{articleInfo.artTitle}}</div>
        <div class="article_card" ref="articleCard" v-html="articleInfo.artContent">
        </div>
        <CommentArea :familyId="articleInfo.id" style="width: 100%;margin-top: 4rem"></CommentArea>
      </div>
      <div class="article_info">
        <UserInfoItem :author="author"></UserInfoItem>
      </div>
    </div>
    <Loading v-if="isLoading"></Loading>
  </div>
</template>

<script setup>
  import { markdownToHtml, markdownToHtmlWithoutLink } from "../../utils/MarkdownUtils";
  import { doActionByAqBack } from "../../utils/ajaxService";
  import { getServer } from "../../environment/environment";
  import { useRoute } from 'vue-router';
  import {ref,reactive,onMounted} from "vue"
  import CommentArea from "../../components/CommentArea.vue"
  import router from "../../router";
  import UserInfoItem from "../../components/UserInfoItem.vue"


  const props = defineProps({
    id:String
  })
  const route = useRoute()
  let isLoading=ref(true)
  let articleInfo=reactive({
    id:route.params.id,
    userId:"",
    artTitle:"",
    artContent:"",
  })
  let author=ref({})
  initArticle();
  console.log(articleInfo.userId)


  async function initArticle() {
    let queryAriticleData = {
      id: articleInfo.id
    };
    const article = ref(await getArticle(queryAriticleData));
    console.log(article.value, articleInfo);
    articleInfo.artContent = markdownToHtml(article.value.artContent.replace(/^(\s|")+|(\s|")+$/g, '')
      .replace(/\\n/g, '\n'));
    articleInfo.userId = article.value.userId;
    articleInfo.artTitle = article.value.artTitle;
    getAuthor({userId:articleInfo.userId})
  }




  function getArticle(queryData) {
    return new Promise((resolve, reject) => {
      doActionByAqBack(
        getServer().aquamanBackDev,
        "AqArticleController",
        "getArticleById",
        queryData
      ).subscribe((response) => {
        resolve(response.data)
      });
    })
  }

  function getAuthor(queryData) {
    doActionByAqBack(
      getServer().aquamanBackDev,
      "AqUserController",
      "getAuthor",
      queryData
    ).subscribe((response) => {
      author.value=response.data;
      isLoading.value=!isLoading.value
    });
  }
</script>

<style scoped>
  .article_view_body{
    display: flex;
    flex-direction: row;
  }
  .title{
    font-size: 50px;
    margin: 2%;
    color: whitesmoke;
  }
  .article_box{
    height: auto;

  }
  .article_card{
    color: whitesmoke;
    padding: 2rem;
    text-decoration-line: none;
    font-size:16px;
    border: 5px solid #00a4a2;
    border-radius: 20px;
    box-shadow:0px 0px 20px 0px #00a4a2;
  }
  .article_info{
    width: 300px;
    margin-top: 7rem;
    padding-left: 2rem;
  }
  @media (max-width: 1080px){
    .article_info {
      display: none;
    }
  }

</style>
