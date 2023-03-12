<template>
    <div class="fly" style="background-image: url(src/assets/static/hero-drone.webp)"></div>
    <div class="bg">
        <div class="card">
            <el-form status-icon ref="ruleForm" class="form">
                <div class="title">Sign in Aquaman-Blog</div>
                <div style="display: flex;flex-direction: row;width: 100%;justify-content: space-between">
                    <div class="word">Email adress</div>
                </div>
                <el-form-item prop="username">
                    <el-input
                            v-model="userMail"
                            placeholder="用户名"
                            @keyup.enter.native="login" />
                </el-form-item>
                <div style="display: flex;flex-direction: row;width: 100%;justify-content: space-between">
                    <div class="word">Password</div>
                    <el-link href="/" class="link" id="update">Forgot Password?</el-link>
                </div>
                <el-form-item prop="password">
                    <el-input
                            v-model="password"
                            show-password
                            placeholder="密码"
                            @keyup.enter.native="login" />
                </el-form-item>
                <div class="warn">邮箱或密码错误</div>
                <button id="login_button" type="button" @click="login">登录</button>
                <div style="width:100%;display: flex;flex-direction: row;justify-content: center">
                    <el-link href="/register" class="link" id="create">Create an account</el-link>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
  import { ajaxPostJsonp, doActionByAqBack } from "../../utils/ajaxService";
  import router from "../../router";
  import { getServer} from "../../environment/environment";
  import { useUserStore } from "../../stores/modules/userStore";

  export default {
    name: "login",
    setup(){
        const store=useUserStore();
        return store
    },
    data(){
      let userMail;
      let password;
      return{
        userMail,
        password
      }
    },
    methods:{
      login(){
        const queryData={
          userMail:this.userMail,
          userPassword:this.password
        }
        doActionByAqBack(
          getServer().aquamanBackDev,
          "AqUserController",
          "userLogin",
          queryData
        ).subscribe((response) => {
            console.log(response)
          if ('response' in response&&response.response.data.status===500){
            document.getElementsByClassName("warn")[0].style.display="flex";
          }else {
            document.getElementsByClassName("warn")[0].style.display="none";
            // this.store.userData.userName=response.data.userName;
            // this.store.userData.userMail=response.data.userMail;
            // this.store.userData.userId=response.data.userId;
            this.store=response.data;
            console.log(this.store);
            localStorage.removeItem("token");
            localStorage.removeItem("userInfo");
            localStorage.setItem("token",response.data.token);
            localStorage.setItem("userInfo",JSON.stringify(
        {
                    userId:response.data.id,
                    userName:response.data.userName,
                    personSign:response.data.personSign,
                    phoneNumber:response.data.phoneNumber,
                    userMail:response.data.userMail,
                    userAVATAR:response.data.userAVATAR
               }
            ));
            router.push("/");
          }
        });
      }
    }
  };
</script>

<style scoped>
@import "styles.css";
</style>
