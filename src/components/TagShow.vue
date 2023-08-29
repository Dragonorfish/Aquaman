<template>
    <div class="tag_show">
        <div @click="tagClick(item[0])" :class="type==='home'?'tag_item_home':'tag_item_page'" v-for="item in tagList">
            <div style="color:grey;margin-right: 5px">#</div>
            {{item[0]}}
            <div style="border-left: #434343 2px solid;margin-left:10px;padding-left: 10px;color: orange">{{item[1]}}</div>
        </div>
    </div>
</template>

<script setup>
    import router from "../router";

    const props=defineProps({
      tagList:Array,
      type:""
    })
    function tagClick(e) {
      console.log(e);
        router.push("/blogpage/"+e)
    }
</script>

<style scoped>
    .tag_show{
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
    }
    .tag_item_home{
        height: 38px;
        color: whitesmoke;
        padding: 7px;
        padding-left: 10px;
        padding-right: 10px;
        font-size: 14px;
        box-sizing: border-box;
        background-color: #1a1a1a;
        margin-right: 10px;
        margin-bottom: 10px;
        line-height: 24px;
        display: flex;
        flex-direction: row;
        border-radius: 10px;
        cursor: url("/src/assets/pointer1.cur"),auto;
        transition: 0.2s;
    }
    .tag_item_home:hover{
        opacity: 0.8;
        color: #0d8b89;
    }
    .tag_item_page{
        height: 44px;
        color: whitesmoke;
        padding: 10px;
        font-size: 24px;
        box-sizing: border-box;
        background-color: #1a1a1a;
        margin-right: 10px;
        margin-bottom: 10px;
        line-height: 24px;
        display: flex;
        flex-direction: row;
        border-radius: 10px;
        cursor: url("/src/assets/pointer1.cur"),auto;
        transition: 0.2s;
    }
    .tag_item_page:hover{
        opacity: 0.8;
        color: #0d8b89;
    }

</style>