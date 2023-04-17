<template>
  <div id="talk_pub_body" class="page_body">
    <h2>发布说说</h2>
    <textarea placeholder="请说些什么吧..." class="talk_pub_card" v-model="talkText"></textarea>
    <button class="talk_pub_button">发布</button>
  </div>
</template>

<style scoped>
  h2{
    color: whitesmoke;
  }
  #talk_pub_body{
    display: flex;
    flex-direction: column;
    width:90% ;
  }
  .talk_pub_card{
    height: 250px;
    outline: none;
    background-color: #2e2e2e;
    color: whitesmoke;
    border-radius: 15px;
    box-sizing: border-box;
    padding: 20px;
    font-size: 20px;
    resize: none;
    border: 2px solid lightseagreen;
    transition: box-shadow 0.3s;
  }
  .talk_pub_card:focus{
    border: 2px solid aquamarine;
    box-shadow:0px 0px 20px 0px #00a4a2;
  }
  .talk_pub_button{
    align-self: end;
    margin: 2rem;
  }
</style>


<script setup>
  import {ref} from 'vue'

  const talkText=ref("")
</script>
