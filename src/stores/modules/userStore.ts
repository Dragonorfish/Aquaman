import { defineStore } from "pinia";

const userData = {
  loginStatus:!!localStorage.getItem("userInfo")
};
export const useUserStore = defineStore("userInfo", {
  // 共享状态，数据
  state: () => {
    return {
      userData
    };
  },
  getters: {},
  actions: {}
});

