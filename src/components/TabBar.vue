<template>
    <div class="tab_body">
        <div @click="itemClick" :class="item===hoverTab?'tab_item_hover':'tab_item'" v-for="item in tabList" >
            {{item}}
        </div>
    </div>
</template>

<script setup>
    import {ref,onMounted} from "vue";
    const props=defineProps({
      tabList:Array
    })
    const emits=defineEmits(["tabClick"]);
    const hoverTab=ref("")
    onMounted(()=>{
      hoverTab.value=props.tabList[0]
      emits("tabClick",props.tabList[0]);
    })
    function itemClick(e) {
      hoverTab.value=e.target.innerText;
      emits("tabClick",e.target.innerText);
    }
</script>

<style scoped>
    .tab_body{
        display: flex;
        flex-direction: row;
        width: 100%;
        margin-top: 1rem;
        background-image: linear-gradient(to top,black,transparent);
    }
    .tab_item{
        flex: 1;
        text-align: center;
        color: whitesmoke;
        font-size: 20px;
        line-height: 50px;
        font-weight: 900;
        transition: box-shadow 0.2s;
    }
    .tab_item:hover{
        box-shadow: inset #00a4a2 0px -5px 5px 0px;
        cursor: url("/src/assets/pointer1.cur"),auto;
    }
    .tab_item_hover{
        flex: 1;
        text-align: center;
        color: whitesmoke;
        font-size: 20px;
        line-height: 50px;
        font-weight: 900;
        transition: box-shadow 0.2s;
        box-shadow: inset #00a4a2 0px -5px 5px 0px;

    }
</style>