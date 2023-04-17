<template>
  <div id="about_body" class="page_body">
    <div class="about_title">
      海王汇智工作室
    </div>
    <div class="about_card">
      <div v-for="item in aboutInfo" class="about_box">
        <h2 class="self_introduction">成员名称</h2>
        <p>{{item.selfName}}</p>
        <h2 class="self_introduction">个人介绍</h2>
        <p>{{item.selfIntroduction}}</p>
        <h2 class="self_introduction">个性签名</h2>
        <p>{{item.speak}}</p>
        <h2 class="self_introduction">联系方式</h2>
        <p>{{item.contactInfo}}</p>
      </div>
    </div>
    <CommentArea :familyId="'about'" class="comment_"></CommentArea>
  </div>
</template>

<script setup>
  import CommentArea from "../../components/CommentArea.vue"


  const aboutInfo=[
    {
      selfName:"Caspar",
      selfIntroduction:"武汉理工大学 地理信息科学系 大三",
      speak:"I can do all things",
      contactInfo:"QQ:2677423874"
    },
    {
      selfName:"amllIHFx",
      selfIntroduction:"武汉理工大学 地理信息科学系 大三",
      speak:"这个人有点懒，什么都没有说 ",
      contactInfo:"QQ:541610102"
    },
    {
      selfName:"樱",
      selfIntroduction:"武汉理工大学 地理信息科学系 大三",
      speak:"人は笑われって笑われって強くなった",
      contactInfo:"QQ:2771634192"
    }
  ]


</script>

<style scoped>
@import "style.css";
</style>
