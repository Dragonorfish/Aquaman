<template>
    <div class="page_body">
        <div class="article_view_body" v-if="!isLoading">
            <div class="article_box">
                <div class="title" id="article_title">{{articleInfo.artTitle}}</div>
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


<style scoped>
    @import "article.css";

</style>

<script setup>
  import { markdownToHtml, markdownToHtmlWithoutLink } from "../../utils/MarkdownUtils";
  import { doActionByAqBack } from "../../utils/ajaxService";
  import { getServer } from "../../environment/environment";
  import { ref, watch,reactive, nextTick, onMounted } from "vue";
  const props=defineProps({
    articleId:""
  })
  let isLoading = ref(true);
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
    const article = ref(await getArticle(queryAriticleData));
    articleInfo.value.artContent = markdownToHtml(article.value.artContent.replace(/^(\s|")+|(\s|")+$/g, "")
      .replace(/\\n/g, "\n").replace(/\\t/g, "\t").replace(/\\"/g, "\""));
    articleInfo.value.userId = article.value.userId;
    articleInfo.value.artTitle = article.value.artTitle;
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
      isLoading.value = false;
      console.log(articleInfo);
      nextTick(() => {
        document.getElementById("article_title").scrollIntoView({
          behavior: "smooth"
        });
      });
    });
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

