<template>
<!--    <v-md-editor class="md-editor"-->
<!--        v-model="text"-->
<!--        :disabled-menus="disabledMenus"-->
<!--        @upload-image="handleUploadImage"-->
<!--     />-->
  <md-editor class="md-editor"
               v-model="text"
               theme="dark"
             @on-upload-img="handleUploadImage"
  />
</template>

<script setup>
import {ref,watch} from 'vue';
import { Axios as axios } from "axios";
import MdEditor from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import cos from '../utils/COSutils.js';
import { getServer } from "../environment/environment";
import { getRandomNum } from "../utils/utilsService";

let text=ref('');
const emit = defineEmits(["getText"])

// 图片上传事件
const handleUploadImage = async (files,callback) => {
  const res = await Promise.all(
    files.map((file) => {
      if (file.size<=1024*1024*5){
        const url=getServer().cosFileTree.blogPic.children.articlePic.path+"/"+getRandomNum();
        /* 直接调用 cos sdk 的方法 */
        return   cos.uploadFile({
          Bucket: getServer().bucket, /* 填写自己的 bucket，必须字段 */
          Region: getServer().region,     /* 存储桶所在地域，必须字段 */
          Key: url,              /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
          Body: file, // 上传文件对象
          SliceSize: 1024 * 1024 * 5,     /* 触发分块上传的阈值，超过5MB 使用分块上传，小于5MB使用简单上传。可自行设置，非必须 */
        }).then((res)=> {return res})
      }
      else{
        return {
          Location:'图片大于5M，上传失败'
        };
      }
    })
  );
  callback(res.map((item) => "https://"+item.Location));
};
function textChangeAct() {
  emit('getText',text.value);
}
watch(text,()=>{
        textChangeAct();
})
</script>

<style scoped>

.md-editor{
    height: 100%;
    border-radius: 15px 0px 0px 15px;
}
.v-md-editor{
  border-radius: 15px 0px 0px 15px;
}
</style>
