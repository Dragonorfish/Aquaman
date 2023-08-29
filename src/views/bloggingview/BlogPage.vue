<template>
    <div class="page_body" id="blog_page">
        <h1 class="page_title">#{{props.tag}}</h1>
        <div v-if="!isLoading" class="blogs_box">
            <div v-for="item in articleList" :key="item.id" class="blog_item">
                <ArticleItem :articleInfo="item"></ArticleItem>
            </div>
        </div>
        <Loading v-if="isLoading"></Loading>
        <Pagination class="pagination" :total="pageNum" @pageChange="pageChange"></Pagination>
    </div>
</template>

<script setup>
    import { doActionByAqBack } from "../../utils/ajaxService";
    import { getServer } from "../../environment/environment";
    import { onMounted, ref } from "vue";

    let isLoading = ref(true);
    let pageNum = ref(0);
    let currentBlogCount = ref(0);
    const props=defineProps({
      tag:String
    })
    let queryData = {
      page: 0,
      size: 10
    };
    let articleList = ref([]);

    onMounted(() => {
      changeList(props.tag)
    });



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
          changeLoadingState();
          resolve();
        });
      })
    }

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

    function changeLoadingState() {
      isLoading.value = !isLoading.value;
    }
</script>

<style scoped>
    #blog_page{
        min-height: 500px;
    }
    .blogs_box{
        position: relative;
        display: grid;
        grid-template-columns:repeat(2, 48%);
        grid-row-gap: 2rem;
        grid-column-gap: 4%;
        margin-bottom: 1rem;
    }
    .blog_item{
        height: 16rem;
    }
</style>