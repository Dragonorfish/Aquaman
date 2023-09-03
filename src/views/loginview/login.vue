<template>
        <div class="login_card">
            <el-form status-icon ref="ruleForm" class="form">
                <div class="title">登陆 Aquaman-Blog</div>
                <div style="display: flex;flex-direction: row;width: 100%;justify-content: space-between">
                    <div class="word">邮箱地址</div>
                </div>
                <el-form-item prop="username">
                    <el-input
                            v-model="userMail"
                            placeholder="用户名"
                            @keyup.enter.native="login" />
                </el-form-item>
                <div style="display: flex;flex-direction: row;width: 100%;justify-content: space-between">
                    <div class="word">密码</div>
                    <el-link href="/" class="link" id="update">忘记密码?</el-link>
                </div>
                <el-form-item prop="password">
                    <el-input
                            v-model="password"
                            show-password
                            placeholder="密码"
                            @keyup.enter.native="login" />
                </el-form-item>
                <div class="warn">邮箱或密码错误</div>
                <div style="width:100%;display: flex;flex-direction: row;justify-content: center">
                    <el-link href="/register" class="link" id="create">注册帐号</el-link>
                </div>
            </el-form>
        </div>
</template>

<script>
  import { ajaxPostJsonp, doActionByAqBack } from "../../utils/ajaxService";
  import router from "../../router";
  import { getServer} from "../../environment/environment";

  export default {
    name: "login",
    props:{
      islogin: { type:Boolean,default(){return false} }
    },
    data(){
      let userMail;
      let password;
      return{
        userMail,
        password
      }
    },
    watch:{
      islogin(newValue,oldValue) {
        if (newValue===true){
          this.login()
        }
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
            this.$emit("loginCallBack",false);
          }else {
            document.getElementsByClassName("warn")[0].style.display="none";
            localStorage.removeItem("token");
            localStorage.removeItem("userInfo");
            localStorage.setItem("token",response.data.token);
            localStorage.setItem("userInfo",JSON.stringify(
        {
                    userId:response.data.id,
                    userAVATAR:response.data.userAVATAR
               }
            ));
            this.$emit("loginCallBack",true);
          }
        });
      }
    }
  };
</script>

<style scoped>
@import "styles.css";
</style>
