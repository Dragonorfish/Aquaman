<template>
    <div class="avatar_edit" :style="{backgroundImage:'url('+avatarUrl+')'}">
        <div v-if="ishover" class="change_tips">更换你的头像</div>
    </div>
</template>

<script setup>
     import {ref,onMounted} from "vue";
     const props=defineProps({
       avatarUrl:String
     })
     const ishover=ref(false);
     onMounted(()=>{
       document.getElementsByClassName("avatar_edit")[0].addEventListener("mouseenter",changeHoverStatus)
       document.getElementsByClassName("avatar_edit")[0].addEventListener("mouseleave",changeHoverStatus)

     })

     function changeHoverStatus() {
        ishover.value=!ishover.value;
    }
</script>

<style scoped>
    .avatar_edit{
        width: 100%;
        height: 100%;
        background-color: orange;
        border-radius: 50%;
        background-size: cover;
        position: relative;
    }
    .avatar_edit:hover{
        cursor: url("/src/assets/pointer1.cur"),auto;
    }
    .change_tips{
        position: absolute;
        width: 120px;
        height: 30px;
        background-color: #a8abb2;
        color: whitesmoke;
        border-radius: 5px;
        padding: 5px;
        line-height: 20px;
        text-align: center;
        box-sizing: border-box;
        left: 50%;
        top: 105%;
        transform: translateX(-50%);
        animation: appear 0.5s;
    }
    .change_tips::before{
        content: "";
        border-bottom: #a8abb2 10px solid;
        border-left: transparent 10px solid;
        border-right: transparent 10px solid;
        position: absolute;
        left: 50%;
        transform: translateX(-50%) translateY(-150%);
    }
    @keyframes appear {
        0%{opacity: 0}
        100%{opacity: 1}
    }
</style>