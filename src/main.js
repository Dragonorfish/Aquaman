import { createApp } from "vue";
import { createPinia } from "pinia";


import App from "./App.vue";
import router from "./router";
import { ElMessage } from 'element-plus';
import "./assets/main.css";
import Loading from "./components/Loading.vue"

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.component('Loading',Loading)
app.mount("#app");
