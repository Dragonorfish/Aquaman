import { createPinia } from "pinia";

const store = createPinia();

export { store };

//将model中的store整合暴露出去
export * from "./modules/menu";

export default store;
