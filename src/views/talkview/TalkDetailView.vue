<template>
    <div class="talk_detail_body">
        <Loading v-if="isLoading" style="width:100%;height:100vh"></Loading>
        <div v-if="!isLoading" class="talk_item">
            <div class="talk_info">
                <img :src="talkInfo.userAvatar" class="avatar"/>
                <span id="user_name" class="info_text">{{talkInfo.userName}}</span>
                <span id="pub_time" class="info_text">发布于 {{talkInfo.addTime}}</span>
            </div>
            <div class="talk_content">
                <div class="talk_text" @click="toTalkDetail">
                    <div class="talk_text_detail">
                        {{content}}
                    </div>
                </div>
                <div class="talk_imgs">
                    <div :class="talkInfo.talkPicList.length===1?
                                 'one_img':talkInfo.talkPicList.length===2?
                                 'two_img':'more_img'"
                    >
                        <div class="img_box" v-for="img in talkInfo.talkPicList">
                            <AqImage :url="img"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <CommentArea v-if="!isLoading" :familyId="talkInfo.id" :type="$type" style="width: 100%;margin-top: 4rem"></CommentArea>
    </div>

</template>

<style scoped>
    .talk_detail_body{
        width: 100%;
    }
    .talk_item {
        width: 100%;
        min-height: 80px;
        background-color: #2e2e2e;
        display: flex;
        flex-direction: column;
        padding: 1rem;
        padding-bottom: 2rem;
        box-sizing: border-box;
        border-radius: 25px;
        margin-bottom: 1rem;
    }

    .avatar {
        width: 4rem;
        height: 4rem;
        border-radius: 50%;
        grid-column-start: 1;
        grid-column-end: 2;
        grid-row-start: 1;
        grid-row-end: 3;
    }

    .talk_info{
        display: grid;
        grid-template-columns: 4rem auto;
        grid-template-rows: 2rem 2rem;
        width: calc(100% - 2.5rem);
        margin-left: 2.5rem;
        margin-bottom: 2rem;
    }
    .info_text {
        margin-left: 1rem;
    }

    #user_name {
        font-size: 20px;
        font-weight: 600;
        color: whitesmoke;
        font-style: normal;
        opacity: 0.8;
    }

    #pub_time {
        font-size: 18px;
        color: grey;
        font-style: italic;

    }

    .talk_content {
        width: 100%;
        min-height: 50px;
        margin-top: 10px;
        position: relative;
        opacity: 0.8;
    }

    .talk_text {
        width: 100%;
        font-size: 20px;
        line-height: 30px;
        color: whitesmoke;
        padding-left: 2.5rem;
        box-sizing: border-box;
        white-space: pre-wrap;
    }

    .talk_imgs {
        margin-top: 3rem;
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
        min-height: 10rem;
        background-color: #2b2b2b;
        transition: transform 0.3s;
    }

    .img_box:hover {
        transform: scale(1.02);
        cursor: url("../../assets/pointer1.cur"), auto;
    }

</style>

<script setup>
  import { useRoute } from "vue-router";
  import { nextTick, onMounted, reactive, ref } from "vue";
  import { doActionByAqBack } from "../../utils/ajaxService";
  import { getServer } from "../../environment/environment";

  const route = useRoute();
  let isLoading = ref(true);
  const talkInfo = ref({
  });
  let queryData = {
    id:route.params.id
  };
  initList(queryData)
  const content=ref("")
  const $type="talk"
  const urlreg = /((?:(http|https|Http|Https|rtsp|Rtsp):\/\/(?:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,64}(?:\:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,25})?\@)?)?((?:(?:[a-zA-Z0-9][a-zA-Z0-9\-]{0,64}\.)+(?:(?:aero|arpa|asia|a[cdefgilmnoqrstuwxz])|(?:biz|b[abdefghijmnorstvwyz])|(?:cat|com|coop|c[acdfghiklmnoruvxyz])|d[ejkmoz]|(?:edu|e[cegrstu])|f[ijkmor]|(?:gov|g[abdefghilmnpqrstuwy])|h[kmnrtu]|(?:info|int|i[delmnoqrst])|(?:jobs|j[emop])|k[eghimnrwyz]|l[abcikrstuvy]|(?:mil|mobi|museum|m[acdghklmnopqrstuvwxyz])|(?:name|net|n[acefgilopruz])|(?:org|om)|(?:pro|p[aefghklmnrstwy])|qa|r[eouw]|s[abcdeghijklmnortuvyz]|(?:tel|travel|t[cdfghjklmnoprtvwz])|u[agkmsyz]|v[aceginu]|w[fs]|y[etu]|z[amw]))|(?:(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9])\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[0-9])))(?:\:\d{1,5})?)(\/(?:(?:[a-zA-Z0-9\;\/\?\:\@\&\=\#\~\-\.\+\!\*\'\(\)\,\_])|(?:\%[a-fA-F0-9]{2}))*)?(?:\b|$)/gi;

  function initList(queryData) {
    doActionByAqBack(
      getServer().aquamanBackDev,
      "AqTalkController",
      "getTalkById",
      queryData
    ).subscribe((response) => {
      console.log(response);
      talkInfo.value=response.data
      content.value =talkInfo.value.talkContent.replace(urlreg, (url) => {
        return '<a class="text_link" href="' + url + '">' + url + '</a>';
      });
      changeLoadingState();
      nextTick(() => {
        document.getElementsByClassName("talk_text_detail")[0].innerHTML = content.value;
        document.getElementsByClassName("talk_detail_body")[0].scrollIntoView({
          behavior: "smooth"
        });
      });
    });
  }

  function changeLoadingState() {
    console.log(isLoading.value);
    isLoading.value = !isLoading.value;
  }
</script>
