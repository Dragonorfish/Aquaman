<template>
    <div class="search_box">
        <input v-model="searchWord" placeholder="请输入关键词..." type="text" @focus="changeFocus" @blur="changeFocus" class="search_input"/>
        <button class="route_button" id="button4" @click="">搜索</button>

        <div v-if="searchResult.length>0&&isFocus"  class="search_result">
            <div class="search_result_item" v-for="resultItem in searchResult" :key="resultItem.id" @click="toArticle(resultItem.id)">
                <div class="result_item_box">
                    <div class="result_item_title" v-html="resultItem.artTitle"></div>
                    <div class="result_item_content" v-html="resultItem.artContent"></div>
                    <div class="result_item_info">
                        <img class="result_item_avatar" :src="resultItem.authorAvatar"/>
                        <div class="result_item_name">{{resultItem.authorName}}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .result_item_info{
        width: 100%;
        height: 25px;
        display: flex;
        flex-direction: row;
        margin-top: 5px;
    }
    .result_item_avatar{
        width: 25px;
        height: 25px;
        border-radius: 50%;
    }
    .result_item_name{
        color: #a8abb2;
        font-size: 14px;
        line-height: 25px;
        padding-left: 5px;
    }
    .search_box {
        position: relative;
        display: flex;
        flex-direction: row;
        justify-content: center;
        flex: 1;
    }
    .search_input {
        box-sizing: border-box;
        padding: 10px;
        height: 40px;
        flex: 0.6;
        align-self: center;
        background-color: transparent;
        color: whitesmoke;
        font-weight: 600;
        outline: none;
        border-left: #2b2b2b 2px solid;
        border-bottom: #2b2b2b 2px solid;
        border-top: #2b2b2b 2px solid;
        border-radius: 20px 0 0 20px;
        border-right: none;
        transition: border, flex 0.3s;
    }
    .search_result{
        background-image: linear-gradient(to right bottom, cadetblue,#2b2b2b);
        width: 80%;
        max-height: 500px;
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 110%;
        z-index: 100;
        overflow: auto;
        backdrop-filter: blur(10px);
        padding: 2%;
        box-sizing: border-box;
        animation:searchBoxPull 0.3s ;
        border-radius: 20px ;
        box-shadow:0px 5px 10px 0px #00a4a2;

    }

    .search_input::placeholder {
        color: whitesmoke;
        font-weight: 600;
        opacity: 0.8;
    }

    .search_input:focus {
        border-left: none;
        border-bottom: transparent 2px solid;
        border-top: transparent 2px solid;
        background-image: linear-gradient(to left, #2b2b2b, cadetblue);
        flex: 0.8;
    }


    #button4 {
        height: 40px;
        width: 80px;
        margin-right: 10px;
        margin-left: 0;
        border-radius: 0 20px 20px 0;
        background-image: linear-gradient(to right, #2b2b2b, cadetblue);
        animation: none;
    }
    .search_result_item{
        box-sizing: border-box;
        width: 100%;
        height: 120px;
        min-height: 120px;
        background-color: #2b2b2b;
        margin-top: 5px;
        cursor:url("../assets/pointer1.cur") 2 2, auto;
        transition: border 0.2s;
        position: relative;
    }
    .search_result_item:hover{
        box-shadow:inset 0px 0px 5px 0px #00a4a2;
    }
    .search_result_item::after{
        content: "";
        width: 0px;
        box-sizing: border-box;
        height: 2px;
        position: absolute;
        background-color: #00a4a2;
        transition: all 0.3s;
    }
    .search_result_item:hover::after{
        width: 100%;
        box-shadow: 0 5px 5px 0 #00a4a2;
    }

    .search_result_item::before{
        content: "";
        width: 0px;
        right: 0;
        /*transform: translateY(80px);*/
        box-sizing: border-box;
        top: 100%;
        height: 2px;
        position: absolute;
        background-color: #00a4a2;
        transition: all 0.3s;
    }

    .search_result_item:hover::before{
        width: 100%;
        box-shadow: 0 -5px 5px 0 #00a4a2;
    }
    .result_item_box{
        width: 100%;
        height: 100%;
        position: absolute;
        display: flex;
        flex-direction: column;
        padding: 10px;
        box-sizing: border-box;
    }
    .result_item_title{
        color: #cccccc;
        font-weight: 600;
        font-size: 16px;
        line-height: 20px;
    }
    .result_item_content{
        width: 100%;
        line-height: 40px;
        height: 40px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp:1;
        overflow-wrap: break-word;
        color: #818384;
        font-weight: 600;
        font-size: 14px;
    }

    @keyframes searchBoxPull {
        0%{
            height: 0px;
            opacity: 0;
            overflow: hidden;
        }
        100%{
            opacity: 1;
            height: 500px;
            overflow: auto;
        }
    }

    @media (max-width: 780px) {

        .search_box {
            display: none;
        }

    }
</style>

<script setup>
  import { nextTick, ref, watch } from "vue";
  import { debounce } from "../utils/utilsService";
  import { doActionByAqBack } from "../utils/ajaxService";
  import { getServer } from "../environment/environment";
  import router from "../router";

  const searchWord=ref("");
  const doSearch=debounce(Search,300);
  const searchResult=ref([]);
  const isFocus=ref(false);

  function changeFocus() {
    if (isFocus.value===true){
      searchWord.value=""
      setTimeout(()=>{
        isFocus.value=false;
      },200)
    }else {
      isFocus.value=true;
    }

  }

  function Search() {
    searchResult.value=[]
    if (searchWord.value.trim().length!==0){
      getSearchResult()
    }
  }

  function getSearchResult() {
    const queryData={
      word:searchWord.value.trim()
    }
    doActionByAqBack(
      getServer().aquamanBackDev,
      "AqArticleController",
      "getArticleByWord",
      queryData
    ).subscribe((response) => {
      const reg=new RegExp(searchWord.value,"gi")
      searchResult.value=response.data.map((resultItem)=>{
        let index=resultItem.artContent.search(reg)
        resultItem.artTitle=resultItem.artTitle.replace(reg,"<marker class='title_marker'>"+searchWord.value+"</marker>")
        console.log(index,resultItem.artContent.length)
        if (index<20&&resultItem.artContent.length-searchWord.value.length-index<30){
          resultItem.artContent=resultItem.artContent.replace(reg,"<marker class='content_marker'>"+searchWord.value+"</marker>")
        }else if(index<20){
          resultItem.artContent=resultItem.artContent.slice(0,searchWord.value.length+index+30+20-index).replace(reg,"<marker class='content_marker'>"+searchWord.value+"</marker>")
        }else if(resultItem.artContent.length-index-searchWord.value.length<30){
          resultItem.artContent=resultItem.artContent.slice(index-20-(30-resultItem.artContent.length+index+searchWord.value.length),resultItem.artContent.length).replace(reg,"<marker class='content_marker'>"+searchWord.value+"</marker>")
        }else {
          resultItem.artContent=resultItem.artContent.slice(index-20,index+30).replace(reg,"<marker class='content_marker'>"+searchWord.value+"</marker>")
        }

        return resultItem
      })

      console.log(response.data)
    });
  }

  function toArticle(id){
    router.push("/article/"+id);
    searchWord.value="";
  }
  watch(searchWord,doSearch)
</script>
