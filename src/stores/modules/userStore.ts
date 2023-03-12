import { defineStore } from "pinia";

const userData = {
    userName:"",
    userMail:"",
    userId:"",
    phoneNumber:""
  }
export const useUserStore = defineStore("userInfo", {
  // 共享状态，数据
  state: () => {
    return {
      userData,
    };
  },
  getters: {},
  actions: {
    async initUserData(){
      try {

      }catch (e) {
        console.log(e)
      }
    },
  },
});

