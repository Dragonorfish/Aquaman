<template>
    <el-scrollbar class="home_page" height="100vh">
        <div class="background">
            <BackActivePic></BackActivePic>
        </div>

        <div class="background2">

            <ToolBar></ToolBar>
            <div class="body">
                <router-view></router-view>
            </div>
            <Footer></Footer>
        </div>
    </el-scrollbar>
</template>

<script setup>

</script>

<style scoped>
@import "style.css";
</style>
