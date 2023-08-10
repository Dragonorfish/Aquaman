<template>
  <div id="userInfo_box" class="color_box">
    <div class="avatar_box">
      <img :src="author.userAVATAR" class="avatar"/>
      <span class="author_name">{{author.userName}}</span>
    </div>
    <div class="person_sign">
        <span>{{author.personSign}}</span>
    </div>
    <div class="author_center_link">
      <img style="width: 100%;height: 100%" src="/src/assets/svgs/authorCenter.svg">
    </div>
    <div class="info_box">
      <span class="info_box_item">
        <span class="info_box_item_title">文章数量</span>
        <span>{{author.articleCount}}</span>
      </span>
      <span class="info_box_item">
        <span class="info_box_item_title">说说数量</span>
        <span>{{author.talkCount}}</span>
      </span>
    </div>
    <div class="cover"></div>
  </div>
</template>

<script setup>

    const props = defineProps({
      author: { }
    })
    console.log(props.author)
</script>

<style scoped>
  #userInfo_box{
    min-width: 16rem;
    height: 100%;
  }
  .avatar_box{
    width: 100%;
    height: 35%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .avatar{
    width: 90px;
    height: 90px;
    border-radius: 50%;
    border: 7px #3a3a3a solid;
    margin: 20px;
    z-index: 10;
  }
  .author_name{
    font-size: 20px;
    font-weight: 900;
    color: powderblue;
    z-index: 10;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .author_name::after{
    border-radius: 9999px;
    height: 0.25rem;
    position: relative;
    bottom: 0;
    width: 5rem;
    content: "";
    background-image: linear-gradient(to right,aquamarine,orange);
    margin-top: 10px;
  }
  .cover{
    width: 98%;
    height: 90%;
    position: absolute;
    background-color: #2b2b2b;
    border-radius: 20px;
    opacity:0.92;
    left: 1%;
    bottom: 0.6%;
  }
  .person_sign{
    height: auto;
  }
  .author_center_link{
    height: 3rem;
    width: 3rem;
    z-index: 10;
    margin: auto;
    clip-path: polygon(50% 3%,91% 25%,91% 75%,50% 97%,9% 75%,9% 25%);
    background-color: aquamarine;
    opacity: 0.7;
  }
  .info_box{
    display: flex;
    flex-direction: row;
    justify-content: center;
    color: powderblue;
    font-weight: 600;
    position: relative;
    bottom: 0.5rem;
  }
  .info_box_item{
    display: flex;
    flex-direction: column;
    justify-content: end;
    align-items: center;
    z-index: 10;
    margin: 2rem;
  }
  .info_box_item_title{
    font-weight: 900;
    font-size: 18px;
    opacity: 0.8;
    color: #a0cfff;
    margin-bottom: 0.5rem;
  }
  .person_sign{
    z-index: 10;
    margin: 2rem;
    color: whitesmoke;
    opacity: 0.8;
    font-family: 'Fira Mono', monospace;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    word-break: break-all;
  }
</style>
