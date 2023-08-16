<template>
    <div id="home_body" class="page_body">
        <div class="blog_main_box" >
            <div class="blog_list_body">
                <h1 id="blog_list_title">文章列表</h1>

                <Loading v-if="isLoading"></Loading>
                <div v-if="!isLoading" style="display: flex;flex-direction: column">
                    <TagBox :itemList="tagList"></TagBox>
                    <div class="blog_list">
                        <div v-for="item in articleList" :key="item.id" class="blog_item">
                            <ArticleItem :articleInfo="item"></ArticleItem>
                        </div>
                    </div>
                </div>

                <Pagination class="pagination" :total="pageNum" @pageChange="pageChange"></Pagination>
            </div>
            <div class="side_box">
            </div>
        </div>

    </div>
</template>

<style scoped>
@import "blogstyle.css";
</style>


<script setup>
  import { ref, onMounted ,nextTick} from "vue";
  import ArticleItem from "../../components/ArticleItem.vue";
  import Pagination from "../../components/Pagination.vue";
  import { doActionByAqBack } from "../../utils/ajaxService";
  import { getServer } from "../../environment/environment";
  import router from "../../router";

  let pageNum = ref(0);
  let currentBlogCount = ref(0);
  let isLoading = ref(true);
  let tagList=ref([]);
  let queryData = {
    page: 0,
    size: 10
  };
  let articleList = ref([]);

  onMounted(() => {
    initList(queryData);
  });

  function pageChange(page) {
    articleList.value=[]
    queryData.page = page - 1;
    changeLoadingState();
    doActionByAqBack(
      getServer().aquamanBackDev,
      "AqArticleController",
      "getArticleByPage",
      queryData
    ).subscribe((response) => {
      changeLoadingState();
      pageNum.value = response.data.totalPages;
      currentBlogCount.value = response.data.numberOfElements;
      articleList.value = response.data.content;
      const target = document.getElementById("blog_list_title");
      target.scrollIntoView({
        behavior: "smooth"
      });
    });
  }

  function initList(queryData) {
    Promise.all([
      new Promise((resolve,reject)=>{
        doActionByAqBack(
          getServer().aquamanBackDev,
          "AqArticleController",
          "getArticleByPage",
          queryData
        ).subscribe((response) => {
          pageNum.value = response.data.totalPages;
          currentBlogCount.value = response.data.numberOfElements;
          articleList.value = response.data.content;
          resolve();
        });
      }),
      new Promise((resolve,reject)=>{
        doActionByAqBack(
          getServer().aquamanBackDev,
          "AqArticleController",
          "getAllTags"
        ).subscribe((response) => {
          response.data.forEach((item)=>{
            tagList.value.push(item.tagName)
          })
          resolve();
        });
      })
    ]).then(()=>{
      changeLoadingState();
    })

  }

  function changeLoadingState() {
    console.log(isLoading.value);
    isLoading.value = !isLoading.value;
  }


</script>

