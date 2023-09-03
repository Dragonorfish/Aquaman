<template>
    <div class="talk_item">
        <div class="talk_info">
            <img :src="talkInfo.userAvatar" class="avatar"/>
            <span id="user_name" class="info_text">{{talkInfo.userName}}</span>
            <span id="pub_time" class="info_text">发布于 {{talkInfo.addTime}}
              <div class="comment_icon">
              </div>
              <div style="margin-left:3px">{{talkInfo.commentCount}}</div>
            </span>
        </div>
        <div class="talk_content">
            <div class="talk_text" @click="toTalkDetail">
                <div class="talk_text_detail">
                    {{content}}
                </div>
                <div v-if="needCover" class="talk_text_cover"></div>
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
</template>

<style scoped>
    .talk_item {
        width:100%;
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
    .comment_icon{
        transform: rotateY(180deg);
        height: 16px;
        background-size: contain;
        margin-left: 5px;
        background-repeat: no-repeat;
        width: 20px;
        background-image: url('/src/assets/svgs/commentIcon.svg')
    }
    @media  {

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
        display: flex;
        align-items: center;
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
        cursor: url("../assets/pointer1.cur"),auto;
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
        cursor: url("../assets/pointer1.cur"), auto;
    }
</style>

<script setup>
  import { ref, onMounted } from "vue";
  import router from "../router";

  const props = defineProps({
    talkInfo: {}
  });
  const needCover = ref(false);
  const urlreg = /((?:(http|https|Http|Https|rtsp|Rtsp):\/\/(?:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,64}(?:\:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,25})?\@)?)?((?:(?:[a-zA-Z0-9][a-zA-Z0-9\-]{0,64}\.)+(?:(?:aero|arpa|asia|a[cdefgilmnoqrstuwxz])|(?:biz|b[abdefghijmnorstvwyz])|(?:cat|com|coop|c[acdfghiklmnoruvxyz])|d[ejkmoz]|(?:edu|e[cegrstu])|f[ijkmor]|(?:gov|g[abdefghilmnpqrstuwy])|h[kmnrtu]|(?:info|int|i[delmnoqrst])|(?:jobs|j[emop])|k[eghimnrwyz]|l[abcikrstuvy]|(?:mil|mobi|museum|m[acdghklmnopqrstuvwxyz])|(?:name|net|n[acefgilopruz])|(?:org|om)|(?:pro|p[aefghklmnrstwy])|qa|r[eouw]|s[abcdeghijklmnortuvyz]|(?:tel|travel|t[cdfghjklmnoprtvwz])|u[agkmsyz]|v[aceginu]|w[fs]|y[etu]|z[amw]))|(?:(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9])\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[0-9])))(?:\:\d{1,5})?)(\/(?:(?:[a-zA-Z0-9\;\/\?\:\@\&\=\#\~\-\.\+\!\*\'\(\)\,\_])|(?:\%[a-fA-F0-9]{2}))*)?(?:\b|$)/gi;
  const content = props.talkInfo.talkContent.replace(urlreg, (url) => {
    return '<a class="text_link" href="' + url + '">' + url + '</a>';
  });
  console.log(props.talkInfo);
  onMounted(() => {
    document.getElementById(props.talkInfo.id).getElementsByClassName("talk_text_detail")[0].innerHTML = content;
    if (document.getElementById(props.talkInfo.id).getElementsByClassName("talk_text")[0].offsetHeight > 249) {
      needCover.value = true;
    }
  });

  function toTalkDetail() {
    router.push("/talkdetail/"+props.talkInfo.id);
  }
</script>
