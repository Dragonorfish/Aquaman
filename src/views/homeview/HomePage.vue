<template>
    <el-scrollbar class="home_page" height="100vh">
        <div class="background"/>
        <div class="bgimg_cover"></div>
        <div class="background2">
            <ConfirmAlert v-if="confirmStore.isShow" :confirmMessage="confirmStore.message" @callBack="confirmStore.callBack"></ConfirmAlert>
            <ToolBar></ToolBar>
            <div class="body">
                <router-view></router-view>
            </div>
            <Footer></Footer>
        </div>
    </el-scrollbar>
</template>

<script setup>
import {useConfirmBoxStore} from "../../stores/modules/userStore";
const confirmStore=useConfirmBoxStore();

</script>

<style scoped>
@import "style.css";
</style>
