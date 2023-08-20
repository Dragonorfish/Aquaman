<template>
    <div id="home_body" class="page_body">
        <div class="blog_main_box" >
            <div class="blog_list_body">
                <h1 id="blog_list_title">文章列表</h1>
                    <TagBox @tagClick="tagClick" initHover="全部" :itemList="tagList"></TagBox>
                    <Loading v-if="isLoading"></Loading>
                    <div v-if="!isLoading" class="blog_list">
                         <div v-for="item in articleList" :key="item.id" class="blog_item">
                            <ArticleItem :articleInfo="item"></ArticleItem>
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

  function tagClick(tag) {
    changeLoadingState();
    changeList(tag).then(()=>{
      changeLoadingState();
    })

  }

  function initList(queryData) {
    Promise.all([
      initTag(),
      changeList("全部")
    ]).then(()=>{
      changeLoadingState();
    })

  }

  function changeList(prop) {
    queryData={
      tag:prop,
      page: 0,
      size: 10
    }
    return new Promise((resolve,reject)=>{
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
    })
  }

  function initTag(){
    tagList.value=[]
    return new Promise((resolve,reject)=>{
      doActionByAqBack(
        getServer().aquamanBackDev,
        "AqArticleController",
        "getAllTags"
      ).subscribe((response) => {
        tagList.value.push("全部")
        response.data.forEach((item)=>{
          tagList.value.push(item.tagName)
        })
        resolve();
      });
    })
  }

  function changeLoadingState() {
    isLoading.value = !isLoading.value;
  }


</script>

