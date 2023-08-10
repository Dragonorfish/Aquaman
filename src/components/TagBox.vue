<template>
    <div class="tag_box">
        <div class="tag_items">
            <div class="tag_item" v-for="item in items" :id="item">{{item}}</div>
        </div>
        <div class="pull_btn"></div>
    </div>
</template>

<script setup>
    const items=["qdq","adwda","dawd","awd","csfca","qdq",
      "adwda","dawd","awd","csfca","cawef","adw","jgs","ayfigaio;id"]
</script>

<style scoped>
    .tag_box{
        width: 100%;
        height: 70px;
        margin: auto;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        background-color: #2e2e2e;
        box-sizing: border-box;
        overflow: hidden;
    }
    .tag_item{
        margin: 10px;
        min-width: 80px;
        height: 50px;
        line-height: 50px;
        text-align: center;
        font-size: 25px;
        color: whitesmoke;
        cursor: url("src/assets/pointer1.cur"),default;
    }
</style>