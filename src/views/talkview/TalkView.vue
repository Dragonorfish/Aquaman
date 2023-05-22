<template>
    <div id="talk_body" class="page_body">
        <h1 class="page_title">说说</h1>
        <Loading v-if="isLoading" style="width:100%;height:100vh"></Loading>
        <div v-if="!isLoading" class="talk_main">
            <div class="talk_list">
                <TalkItem v-for="(item,index) in talkList" :talkInfo="item" :id="item.id">
                </TalkItem>
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

