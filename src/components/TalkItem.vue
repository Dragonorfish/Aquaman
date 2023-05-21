<template>
    <div class="talk_item">
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
</template>

<style scoped>

</style>

<script setup>
const props=defineProps({
  talkInfo:{

  }
})
</script>
