<template>
    <el-scrollbar class="home_page" height="100vh">
        <img src="/src/assets/static/bgpic.jpg" class="background"/>
        <div class="bgimg_cover"></div>
        <div class="background2">
            <ToolBar></ToolBar>
            <Suspense>
                <template #default>
                    <router-view class="body"></router-view>
                </template>
                <template #fallback>
                    <Loading></Loading>
                </template>
            </Suspense>
            <Footer></Footer>
        </div>
    </el-scrollbar>
</template>

<script setup>
    import ToolBar from "../../components/ToolBar.vue";
    import Footer from "../../components/Footer.vue";
    import router from "../../router";
    import Loading from "../../components/Loading.vue"

</script>

<style scoped>
@import "style.css";
</style>
