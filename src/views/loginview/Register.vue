<template>
    <div class="fly"></div>
    <div class="bg">
        <div class="card" style="height: 370px">
            <el-form status-icon ref="ruleForm" class="form">
                <div class="title">Sign up Aquaman-Blog</div>
                <div style="display: flex;flex-direction: row;width: 100%;justify-content: space-between">
                    <div class="word">Email adress</div>
                </div>
                <el-form-item prop="username">
                    <el-input
                            v-model="userMail"
                            placeholder="用户名"
                            @keyup.enter.native="Verify" />
                </el-form-item>
                <div style="display: flex;flex-direction: row;width: 100%;justify-content: space-between">
                    <div class="word">Verifiction Code</div>
                </div>
                <el-form-item id="vcode_item" prop="Vcode">
                    <el-input
                            v-model="Vcode"
                            placeholder="验证码"
                            @keyup.enter.native="Verify"
                            style="width: 50%"
                    />
                    <button style="width: 40%;" type="button" @click="Verify">{{buttonName}}</button>
                </el-form-item>
                <div style="display: flex;flex-direction: row;width: 100%;justify-content: space-between">
                    <div class="word">Password</div>
                </div>
                <el-form-item prop="password">
                    <el-input
                            v-model="userPassword"
                            show-password
                            placeholder="密码"
                            @keyup.enter.native="Register" />
                </el-form-item>
                <div class="warn" id="mail_warn">邮箱格式错误</div>
                <div class="warn" id="vcode_warn">请输入验证码</div>
                <button type="button" @click="Register">注册</button>
                <div style="width:100%;display: flex;flex-direction: row;justify-content: center">
                    <el-link href="/login" class="link" id="create">Click to sign in</el-link>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
  import { ajaxPostJsonp, doActionByAqBack } from "../../utils/ajaxService";
  import router from "../../router";
  import { getServer} from "../../environment/environment";
  import {ElMessage } from 'element-plus';
  import 'element-plus/es/components/message/style/css'; // this is only needed if the page also used ElMessage
  import 'element-plus/es/components/message-box/style/css';//还要引入css，抽象

  export default {
    name: "Register",
    setup(){

    },
    data(){
      return{
        userMail:null,
        Vcode:null,
        userPassword:null,
        buttonName:"获取验证码",
        count:59,
        disable:false
      }
    },
    methods:{
      Verify(){
        const reg=/^([a-zA-Z\d][\w-]{2,})@(\w{2,})\.([a-z]{2,})(\.[a-z]{2,})?$/;
        if (reg.test(this.userMail)){
          document.getElementsByClassName("warn")[0].style.display="none";
          document.getElementsByClassName("warn")[1].style.display="none";
          if (this.disable===true){
            ElMessage({
              message: '请勿重复点击',
              type: 'warning',
            });
          }else {
            const queryData={
              userMail:this.userMail,
              codeType:"register"
            };
            doActionByAqBack(
              getServer().aquamanBackDev,
              "AqUserController",
              "getVerifyCode",
              queryData
            ).subscribe((response) => {
              console.log(response);
            });
            ElMessage({
              message: '验证码已发送',
              type: 'success',
            });
            const timeout=setInterval(()=>{
              if (this.count < 1) {
                this.disable = false;
                this.buttonName = "获取验证码";
                this.count = 59;
                clearInterval(timeout);
              } else {
                this.disable = true;
                this.buttonName = this.count-- + "s后重发";
              }
            },1000);
          }
        }else {
          document.getElementById("mail_warn").style.display="flex";
        }
      },
      Register(){
        const reg=/^([a-zA-Z\d][\w-]{2,})@(\w{2,})\.([a-z]{2,})(\.[a-z]{2,})?$/;
        if (reg.test(this.userMail)&&this.Vcode){
          document.getElementsByClassName("warn")[0].style.display="none";
          document.getElementsByClassName("warn")[1].style.display="none";
          const queryData={
            userName:this.userMail,
            userMail:this.userMail,
            userPassword:this.userPassword,
            verifyCode:this.Vcode
          }
          doActionByAqBack(
            getServer().aquamanBackDev,
            "AqUserController",
            "userRegister",
            queryData
          ).subscribe((response) => {
            console.log(response)
            ElMessage({
              message: response.data,
              type: response.data==="注册成功"?"success":"warning",
            })
            if (response.data==="注册成功"){
                this.Login()
            }
          })
        }else if(!reg.test(this.userMail)){
          document.getElementById("mail_warn").style.display="flex";
        }else {
          document.getElementById("vcode_warn").style.display="flex";
        }
      },
      Login(){
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
            console.log(response);
          if ('response' in response&&response.response.data.status===500){
            document.getElementsByClassName("warn")[0].style.display="flex";
          }else {
            document.getElementsByClassName("warn")[0].style.display="none";
            const userInfo=response.data;
            console.log(JSON.stringify(userInfo));
            localStorage.removeItem("userInfo");
            localStorage.removeItem("token");
            localStorage.setItem("userInfo",JSON.stringify(
              {
                userId:response.data.id,
                userAVATAR:response.data.userAVATAR
              }
            ));
            localStorage.setItem("token",response.data.token);
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
