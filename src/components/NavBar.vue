<script>
import { useMenuStore } from "../stores";

export default {
  name: "NavBar",
  setup() {
    const menuStore = useMenuStore();
    let menu = JSON.parse(JSON.stringify(menuStore.msgData));
    console.log(menu);
    return {
      menu,
      isCollapse: true,
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    goTo(path) {
      this.$router.replace(path);
    },
    changeStatus() {
      this.isCollapse = !this.isCollapse;
    },
  },
};
</script>

<template>
  <dv-border-box13 :dur="5" style="width: 19%">
    <nav>
      <el-menu
        text-color="aliceblue"
        active-text-color="#18538e"
        default-active="2"
        class="el-menu-vertical-demo"
        unique-opened="true"
        router="true"
        @open="handleOpen"
        @close="handleClose"
      >
        <!-- index 为 router 对应的 path-->
        <el-sub-menu v-for="item in menu" :key="index" :index="item.name">
          <template #title>
            <div style="width: 100%">
              <dv-border-box10>
                <span>{{ item.name }}</span>
              </dv-border-box10>
            </div>
          </template>
          <el-menu-item
            style="background-color: transparent;left: 5%"
            v-for="child in item.children"
            :key="index"
            :index="child.path"
            >{{ child.name }}</el-menu-item
          >
        </el-sub-menu>
      </el-menu>
    </nav>
  </dv-border-box13>
</template>

<style scoped>
.el-menu-vertical-demo {
  margin-top: 10%;
  margin-left: 10px;
  --el-menu-bg-color: transparent;
  --el-menu-hover-bg-color: transparent;
  --el-menu-border-color: transparent;
}
</style>
