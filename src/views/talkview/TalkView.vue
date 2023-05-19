<template>
    <div class="talk_body">
        <Pagination class="pagination" :total="pageNum" @pageChange="pageChange"></Pagination>
    </div>
</template>

<style scoped>
    .talk_body {
        width: 100%;
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
    });
  }

  function pageChange(page) {
    console.log(page)
    queryData.page = page - 1;
    doActionByAqBack(
      getServer().aquamanBackDev,
      "AqTalkController",
      "getTalkByPage",
      queryData
    ).subscribe((response) => {
      pageNum.value = response.data.totalPage;
      talkList.value = response.data.content;

      // const target = document.getElementById("blog_list_title");
      // target.scrollIntoView({
      //   behavior: "smooth"
      // });
    });
  }
</script>

