<template>

</template>

<style scoped>

</style>

<script setup>
  import {ref} from "vue";
  import { getServer } from "../environment/environment";
  import { getRandomNum } from "../utils/utilsService";
  import cos from "../utils/COSutils";
  import { ElMessage } from 'element-plus';
  import 'element-plus/es/components/message/style/css'; // this is only needed if the page also used ElMessage
  import 'element-plus/es/components/message-box/style/css';//还要引入css，抽象


  async function uploadFile(e) {
    const file=e.target.files[0];
    if (file.size<=1024*1024*5){
      const url=getServer().cosFileTree.blogPic.children.talkPic.path+"/"+getRandomNum();
      /* 直接调用 cos sdk 的方法 */
      return   cos.uploadFile({
        Bucket: getServer().bucket, /* 填写自己的 bucket，必须字段 */
        Region: getServer().region,     /* 存储桶所在地域，必须字段 */
        Key: url,              /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
        Body: file, // 上传文件对象
        SliceSize: 1024 * 1024 * 5,     /* 触发分块上传的阈值，超过5MB 使用分块上传，小于5MB使用简单上传。可自行设置，非必须 */
      }).then((res)=> {
        imgUrl.value="https://"+res.Location;

      }).catch((error)=>{
      })
    }
    else{
      ElMessage.error('图片大于5m，上传失败')
    }

  }
</script>


