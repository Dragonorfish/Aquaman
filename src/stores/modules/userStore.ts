import { defineStore } from "pinia";

const userData = {
  userName: "admin",
  userMail: "admin",
  userId: "admin",
  phoneNumber: "admin",
  userAvatar: "src/assets/static/weblogo.png",
  articleCount: 0,
  talkCount: 0
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
export const useConfirmBoxStore = defineStore("boxState", {
  // 共享状态，数据
  state: () => {
    return {
      message:"你确认吗?",
      isShow:false,
      callBack:function(bool) {
        console.log(bool)
      }
    };
  },
  getters: {},
  actions: {}
});
