<template>
    <div class="carousel_body">
        <div class="turn_icon" id="turn_left"></div>
        <div class="turn_icon" id="turn_right"></div>
        <div :style="{transform:'rotateY('+rotateDeg+'deg)'}" v-if="articleList.length!==0" class="container">
            <div class="box box-1">
                <div class="box_contain">
                    <ArticleItemBig :articleInfo="articleList[0]"></ArticleItemBig>
                </div>
            </div>
            <div class="box box-2">
                <div class="box_contain">
                    <ArticleItemBig :articleInfo="articleList[1]"></ArticleItemBig>
                </div>
            </div>
            <div class="box box-3">
                <div class="box_contain">
                    <ArticleItemBig :articleInfo="articleList[2]"></ArticleItemBig>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import {ref,onMounted} from "vue"
    const props=defineProps({
      articleList:Array
    })
    const rotateDeg=ref(0)
    onMounted(()=>{
      document.getElementById("turn_right").addEventListener("click",function() {
        rotateDeg.value=rotateDeg.value-120;
      })
      document.getElementById("turn_left").addEventListener("click",function() {
        rotateDeg.value=rotateDeg.value+120;
      })
    })

</script>

<style scoped>
    .carousel_body{
        width: 100%;
        height: 25rem;
        margin-top: 4rem;
        margin-bottom: 4rem;
        perspective:3000px
    }
    .turn_icon{
        position: absolute;
        height: 80px;
        width: 6rem;
        transform: scaleY(4) translateY(-15%);
        z-index: 10;
        top: 50%;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-color: #2b2b2b;
        opacity: 0.5;
        transition: opacity 0.2s;
    }
    .turn_icon:hover{
        cursor: url("/src/assets/pointer1.cur"),auto;
        opacity: 0.8;
    }
    #turn_left{
        background-image: url("/src/assets/svgs/left.svg");
    }
    #turn_right{
        right: 0px;
        background-image: url("/src/assets/svgs/right.svg");
    }

    .container{
        width: 100%;
        height: 25rem;
        font-size: 80px;
        color: white;
        transform-style: preserve-3d;
        margin: 0 auto;
        transition: transform 0.2s;
    }
    .box{
        width: 100%;
        position: absolute;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;

    }
    .box_contain{
        width: 70%;
        height: 25rem;
        border-radius: 15px;
        box-shadow: #0d8b89 0px 0px 10px 1px;
        transition: box-shadow 0.2s;
    }
    .box_contain:hover{
        box-shadow:#0d8b89 0px 0px 15px 5px ;
    }
    .box-1{
        transform: rotateY(0deg) translateZ(500px);
    }
    .box-2{

        transform: rotateY(120deg) translateZ(500px);
    }
    .box-3{

        transform: rotateY(240deg) translateZ(500px);
    }

</style>