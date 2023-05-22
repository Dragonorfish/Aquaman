<template>
    <div id="talk_body" class="page_body">
        <h1 class="page_title">说说</h1>
        <Loading v-if="isLoading" style="width:100%;height:100vh"></Loading>
        <div v-if="!isLoading" class="talk_main">
            <div class="talk_list">
                <div class="talk_item" v-for="(item,index) in talkList" :id="item.id">
                    <div class="talk_info">
                        <img :src="item.userAvatar" class="avatar"/>
                        <span id="user_name" class="info_text">{{item.userName}}</span>
                        <span id="pub_time" class="info_text">发布于 {{item.addTime}}</span>
                    </div>
                    <div class="talk_content">
                        <div class="talk_text">
                            {{item.talkContent}}
                            <div class="talk_text_cover"></div>
                        </div>
                        <div class="talk_imgs">
                            <div :class="item.talkPicList.length===1?
                                 'one_img':item.talkPicList.length===2?
                                 'two_img':'more_img'"
                            >
                                <div class="img_box" v-for="img in item.talkPicList">
                                    <AqImage :url="img"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="side_part" class="color_box">

            </div>
        </div>

        <Pagination class="pagination" :total="pageNum" @pageChange="pageChange"></Pagination>
    </div>
</template>

<style scoped>
    #talk_body {
        width: 100%;
        min-height: 500px;
        display: flex;
        flex-direction: column;
        border-radius: 15px;
        padding: 10px;
        box-sizing: border-box;
    }

    .talk_main {
        display: flex;
        flex-direction: row;
        flex: auto;
        backdrop-filter: blur(15px);
    }

    .talk_list {
        display: flex;
        flex-direction: column;
        flex: 4;
        margin-right: 4rem;
        margin-top: 1rem;
    }

    #side_part {
        width: 300px;
        height: 400px;
        background-image: linear-gradient(to right bottom, orange, #00a4a2);
    }

    .talk_item {
        width: 100%;
        min-height: 80px;
        background-color: #2e2e2e;
        display: flex;
        flex-direction: column;
        padding: 1rem;
        box-sizing: border-box;
        border-radius: 25px;
        margin-bottom: 1rem;
        transition: transform 0.3s;
    }

    .talk_item:hover {
        transform: scale(1.005);
    }

    .avatar {
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 50%;
        grid-column-start: 1;
        grid-column-end: 2;
        grid-row-start: 1;
        grid-row-end: 3;
    }

    .talk_info {
        display: grid;
        grid-template-columns: 2.5rem auto;
        grid-template-rows: 1.25rem 1.25rem;
        width: 100%;
    }

    .info_text {
        margin-left: 1rem;
    }

    #user_name {
        font-size: 16px;
        font-weight: 600;
        color: whitesmoke;
        font-style: normal;
        opacity: 0.8;
    }

    #pub_time {
        font-size: 14px;
        color: grey;
        font-style: italic;

    }

    .talk_content {
        width: 100%;
        min-height: 50px;
        margin-top: 10px;
        position: relative;
    }

    .talk_text {
        width: 100%;
        color: whitesmoke;
        padding-left: 2.5rem;
        box-sizing: border-box;
        white-space: pre-wrap;
        max-height: 250px;
        overflow: hidden;
    }

    .talk_text_cover {
        width: calc(100% - 2.5rem);
        height: 150px;
        background-image: linear-gradient(to bottom, transparent, #2e2e2e);
        position: absolute;
        top: 250px;
        transform: translateY(-100%);
    }

    .talk_imgs {
        margin-top: 1rem;
        width: 80%;
        margin-left: 2.5rem;
    }

    .one_img {
        width: 100%;
    }

    .two_img {
        display: grid;
        grid-template-columns: repeat(2, 49%);
        grid-gap: 1%;
    }

    .more_img {
        display: grid;
        grid-template-columns: repeat(3, 33%);
        grid-gap: 0.5%;
    }

    .img_box {
        width: 100%;
        height: 100%;
        max-height: 40rem;
        min-height: 10rem;
        background-color: #2b2b2b;
        transition: transform 0.3s;
    }

    .img_box:hover {
        transform: scale(1.02);
        cursor: url("../../assets/pointer1.cur"), auto;
    }

    @media (max-width: 1024px) {
        #side_part {
            display: none;
        }
    }

</style>

<script setup>
  import { getServer } from "../../environment/environment";
  import { doActionByAqBack } from "../../utils/ajaxService";
  import { ref, nextTick, onMounted } from "vue";

  let queryData = {
    page: 0,
    size: 10
  };
  const pageNum = ref(0);
  const talkList = ref([]);
  let isLoading = ref(true);

  initList(queryData);

  function initList(queryData) {
    doActionByAqBack(
      getServer().aquamanBackDev,
      "AqTalkController",
      "getTalkByPage",
      queryData
    ).subscribe((response) => {
      pageNum.value = response.data.totalPage;
      talkList.value = response.data.content;
      changeLoadingState();
    });
  }

  function pageChange(page) {
    console.log(page);
    queryData.page = page - 1;
    doActionByAqBack(
      getServer().aquamanBackDev,
      "AqTalkController",
      "getTalkByPage",
      queryData
    ).subscribe((response) => {
      pageNum.value = response.data.totalPage;
      talkList.value = response.data.content;

      const target = document.getElementsByClassName("page_title")[0];
      target.scrollIntoView({
        behavior: "smooth"
      });
    });
  }

  function changeLoadingState() {
    console.log(isLoading.value);
    isLoading.value = !isLoading.value;
  }
</script>

