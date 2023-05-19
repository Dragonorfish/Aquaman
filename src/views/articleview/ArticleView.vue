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
  import { useRoute } from "vue-router";
  import { ref, reactive, nextTick, onMounted } from "vue";
  import CommentArea from "../../components/CommentArea.vue";
  import router from "../../router";
  import UserInfoItem from "../../components/UserInfoItem.vue";


  const props = defineProps({
    id: String
  });
  const route = useRoute();
  let isLoading = ref(true);
  let articleInfo = reactive({
    id: route.params.id,
    userId: "",
    artTitle: "",
    artContent: ""
  });
  let author = ref({});

  console.log(articleInfo.userId);

  onMounted(() => {
    initArticle();

  });


  async function initArticle() {
    let queryAriticleData = {
      id: articleInfo.id
    };
    const article = ref(await getArticle(queryAriticleData));
    console.log(article.value, articleInfo);
    articleInfo.artContent = markdownToHtml(article.value.artContent.replace(/^(\s|")+|(\s|")+$/g, "")
      .replace(/\\n/g, "\n").replace(/\\t/g, "\t").replace(/\\"/g, "\""));
    articleInfo.userId = article.value.userId;
    articleInfo.artTitle = article.value.artTitle;
    getAuthor({ userId: articleInfo.userId });
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
      isLoading.value = !isLoading.value;
      nextTick(() => {
        document.getElementById("article_title").scrollIntoView({
          behavior: "smooth"
        });
      });
    });
  }
</script>

