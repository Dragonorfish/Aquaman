<template>
  <div class="talk_pub_body">
    <h2>发布说说</h2>
    <textarea class="talk_pub_card" v-model="talkText"></textarea>

  </div>
</template>

<style scoped>
  h2{
    color: whitesmoke;
  }
  .talk_pub_body{
    display: flex;
    flex-direction: column;
  }
  .talk_pub_card{
    height: 250px;
    width: 100%;
    outline: none;
    background-color: #2e2e2e;
    color: whitesmoke;
    border-radius: 15px;
    box-sizing: border-box;
    padding: 20px;
    font-size: 20px;
    resize: none;
    border: 2px solid lightseagreen;

  }
  .talk_pub_card:focus{
    border: 2px solid aquamarine;
    box-shadow:0px 0px 20px 0px #00a4a2;
    animation: ease-out 0.2s lighting;
  }

  @keyframes lighting {
    0%{
      box-shadow:0px 0px 0px 0px #00a4a2;
    }
    100%{
      box-shadow:0px 0px 20px 0px #00a4a2;
    }
  }
</style>


<script setup>
  import {ref} from 'vue'

  const talkText=ref("")
</script>
