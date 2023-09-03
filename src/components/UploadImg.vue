<template>
<div style="width: 100%;height: 100%">
  <div id="back_img" @click="uploadClick" >
    <svg id="upload_icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
      <path style="opacity: 0.2" fill="grey"
            d="M480 480V128a32 32 0 0 1 64 0v352h352a32 32 0 1 1 0 64H544v352a32 32 0 1 1-64 0V544H128a32 32 0 0 1 0-64h352z">
      </path>
    </svg>
    <input id="upload_input" type="file" @change="uploadFile">
  </div>
  <div id="img_cover" @click="restartUpLoad">
    上传中
  </div>
</div>

</template>

<script setup>
  import {ref} from "vue";
  import { getServer } from "../environment/environment";
  import { getRandomNum } from "../utils/utilsService";
  import cos from "../utils/COSutils";
  import { ElMessage } from 'element-plus';
  import 'element-plus/es/components/message/style/css'; // this is only needed if the page also used ElMessage
  import 'element-plus/es/components/message-box/style/css';//还要引入css，抽象
  let ifUploadFalse=false;
  let imgUrl=ref("");
  const emit = defineEmits(["getImgUrl"]);

  function restartUpLoad() {
    if(ifUploadFalse){
      document.getElementById('img_cover').style.display="none";
      document.getElementById('img_cover').innerHTML="上传中";
      ifUploadFalse=false
      document.getElementById('upload_icon').style.display="";
      document.getElementById('back_img').style.display="flex";
    }
  }

  function uploadClick(){
    document.getElementById('upload_input').click()
  }

  async function uploadFile(e) {
    const file=e.target.files[0];
    if (file.size<=1024*1024*5){
      document.getElementById('upload_icon').style.display="none";
      document.getElementById('back_img').style.display="none";
      document.getElementById('img_cover').style.display="flex";
      const url=getServer().cosFileTree.blogPic.children.articlePic.path+"/"+getRandomNum();
      /* 直接调用 cos sdk 的方法 */
      return   cos.uploadFile({
        Bucket: getServer().bucket, /* 填写自己的 bucket，必须字段 */
        Region: getServer().region,     /* 存储桶所在地域，必须字段 */
        Key: url,              /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
        Body: file, // 上传文件对象
        SliceSize: 1024 * 1024 * 5,     /* 触发分块上传的阈值，超过5MB 使用分块上传，小于5MB使用简单上传。可自行设置，非必须 */
      }).then((res)=> {
        imgUrl.value="https://"+res.Location;
        document.getElementById('back_img').style.backgroundImage="url("+imgUrl.value+")";
        let getImg = new Image(); //新建Image对象
        getImg.src = "https://"+res.Location; //给Image元素指定地址
        let i=0;
        const timer=setInterval(() => {
          if(getImg.complete){
            emit("getImgUrl",imgUrl.value)
            document.getElementById('img_cover').style.display="none";
            document.getElementById('back_img').style.display="flex";
            i=0;
            clearInterval(timer);
          }else if (i>200){
            document.getElementById('img_cover').innerHTML="图片加载失败,点击重新上传";
            ifUploadFalse=true;
            i=0;
            clearInterval(timer);
          }else {
            i+=1;
          }
        }, 100);
      })
    }
    else{
      ElMessage.error('图片大于5m，上传失败')
    }

  }
</script>

<style scoped>

  #back_img{
    width: 100%;
    height: 100%;
    background-color: transparent;
    background-size: 100% 100%;
    display: flex;
    flex-direction: row;
    cursor: url("../assets/pointer1.cur"),auto;
  }
  #upload_input{
    display: none
  }
  #img_cover{
    width: 100%;
    height: 100%;
    display: none;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    color: aqua;
    z-index: 20;
    pointer-events: none;
  }
</style>
