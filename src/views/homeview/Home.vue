<template>
  <div class="home_body">
    <div class="blog_list_body">
      <h1>文章列表</h1>
      <div class="blog_list">
        <div v-for="item in articleList" :key="item.id" class="blog_item">
          <ArticleItem :articleInfo="item"></ArticleItem>
        </div>
      </div>
      <Pagination class="pagination" :total="pageNum" @pageChange="pageChange"></Pagination>
    </div>
  </div>
</template>

<script setup>
  import {ref} from "vue"
  import ArticleItem from '../../components/ArticleItem.vue'
  import Pagination from '../../components/Pagination.vue'
  import { doActionByAqBack } from "../../utils/ajaxService";
  import { getServer } from "../../environment/environment";
  import router from "../../router";
  let pageNum=ref(0)
  let currentBlogCount=ref(0)
  let queryData={
    page:0,
    size:10
  };
  let articleList=ref(await initList(queryData));
  console.log(articleList)
  // pageChange(queryData);

  function pageChange(page){
    queryData.page=page-1;
    return new Promise((resolve,reject)=>{
      doActionByAqBack(
        getServer().aquamanBackDev,
        "AqArticleController",
        "getArticleByPage",
        queryData
      ).subscribe((response) =>{
        console.log(response)
        pageNum=response.data.totalPages;
        currentBlogCount.value=response.data.numberOfElements;
        articleList.value=response.data.content;
      });
    })
  }
  function initList(queryData){
    return new Promise((resolve,reject)=>{
      doActionByAqBack(
        getServer().aquamanBackDev,
        "AqArticleController",
        "getArticleByPage",
        queryData
      ).subscribe((response) =>{
          pageNum=response.data.totalPages;
          currentBlogCount.value=response.data.numberOfElements;
          resolve(response.data.content);
      });
    })
  }


</script>

<style scoped>
  .blog_list{
    position: relative;
    display: grid;
    grid-template-columns:repeat(2,49%);
    gap: 2rem;

  }
  .blog_list_body{
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  @media (max-width: 1024px) {
    .blog_list{
      position: relative;
      display: grid;
      grid-template-columns:repeat(1,100%);
      gap: 2rem;
    }
  }
  .home_body{
    display: flex;
    flex-direction: column;
  }
  .blog_item{
    height: 17rem;
  }
  .pagination{
    margin: 4rem;
  }
  h1{
    font-weight: 400;
    color: whitesmoke;
    margin: 2rem;
    margin-left: 0;
    position: relative;
    padding-bottom: 0.75rem;
  }
  h1::after{
    border-radius: 9999px;
    height: 0.25rem;
    position: absolute;
    bottom: 0;
    width: 6rem;
    content: "";
    background-image: linear-gradient(to right,aquamarine,orange);
    left: 0;
  }
</style>
