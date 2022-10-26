import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import "./assets/main.css";
import "@arcgis/core/assets/esri/themes/light/main.css";
import DataVVue3 from "@kjgl77/datav-vue3";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(DataVVue3);

app.mount("#app");
