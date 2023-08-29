<template>
    <div class="tag_box" :style="{height:boxHeight}">
        <div class="tag_items">
            <div @click="itemClick"
                 v-for="item in props.itemList"
                 :id="item[0]"
                 :class="item[0]===hoverItem?'tag_item_hover':'tag_item'">{{item[0]}}</div>
        </div>
        <div class="pull_btn">
            <img @click="pullBtnReverse" style="width: 80px;height: 50px" src="/src/assets/svgs/pullicon.svg">
        </div>
    </div>
</template>

<script setup>
    import {nextTick,ref,watch} from "vue";
    const props=defineProps({
      itemList: {
        default: []
      },
      initHover:{
        type: String,
        default: ""
      },
    })
    const emits=defineEmits(["tagClick"]);

    let boxHeight=ref("auto");
    let realHeight="";
    let hoverItem=ref(props.initHover)

    function pullBtnReverse(e) {
      if (e.target.style.transform!=="rotateZ(180deg)"){
        e.target.style.transform="rotateZ(180deg)";
        boxHeight.value=realHeight+"px";
      }else {
        e.target.style.transform="rotateZ(0deg)";
        boxHeight.value="50px";
      }

    }

    function itemClick(e) {
      hoverItem.value=e.target.id;
      emits("tagClick",e.target.id);
    }

    watch([props],()=>{
      boxHeight.value="auto";
      nextTick(()=>{
        realHeight=document.getElementsByClassName("tag_box")[0]
          .clientHeight;
        console.log(realHeight)
        boxHeight.value="50px";
      })
    })
    window.addEventListener('resize', ()=>{
      boxHeight.value="auto";
      nextTick(()=>{
        realHeight=document.getElementsByClassName("tag_box")[0]
          .clientHeight;
        console.log(realHeight)
        boxHeight.value="50px";
      });
    })

</script>

<style scoped>
    .tag_box{
        width: 100%;
        margin-bottom: 1rem;
        display: flex;
        flex-direction: row;
        background-image: linear-gradient(#0B4252,#2e2e2e);
        box-sizing: border-box;
        border-radius: 15px;
        box-shadow:inset 0px 0px 7px 0px #00a4a2;
        transition: height,0.3s;
    }
    .tag_items{
        flex:1;
        margin-left: 10px;
        max-height: 300px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        overflow: hidden;
    }
    .tag_item{
        margin: 10px;
        margin-left: 5px;
        padding-left: 10px;
        padding-right: 10px;
        box-sizing: border-box;
        min-width: 80px;
        height: 30px;
        line-height: 30px;
        font-weight: 300;
        text-align: center;
        font-size: 16px;
        color: whitesmoke;
        opacity: 0.8;
        cursor: url("/src/assets/pointer1.cur"),default;
        background-color: darkslategray;
        border-radius: 10px;
        transition: opacity,0.2s;
    }
    .tag_item_hover{
        margin: 10px;
        margin-left: 5px;
        padding-left: 10px;
        padding-right: 10px;
        box-sizing: border-box;
        min-width: 80px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        font-size: 16px;
        color: grey;
        opacity: 0.8;
        background-image: linear-gradient(to right bottom,aquamarine,orange);
        border-radius: 10px;
        transition: opacity,0.2s;
    }

    .tag_item:hover{
        opacity: 0.5;
    }

    .pull_btn img{
        cursor: url("/src/assets/pointer1.cur"),default;
        transition: transform 0.3s;
    }
</style>