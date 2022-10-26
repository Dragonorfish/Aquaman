<template>
  <dv-border-box1 class="all">
    <header></header>
    <main>
      <NavBar style="margin: 5px"></NavBar>
      <RouterView />
    </main>
    <footer></footer>
  </dv-border-box1>
</template>

<script>
import NavBar from "./components/NavBar.vue";

export default {
  name: "Home",
  components: {
    NavBar,
  },
};
</script>

<style scoped>
.all {
  background-image: url("assets/static/bg.png");
  background-size: 100% 100%;
  height: 100vh;
}
main {
  display: flex;
  height: 80vh;
  margin: 5px;
  left: 2vh;
}

header {
  display: flex;
  height: 10vh;
  background-color: transparent;
}

footer {
  display: flex;
  height: 10vh;
  background-color: transparent;
}
</style>
