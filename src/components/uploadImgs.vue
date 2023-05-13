<template>
  <div>
    <el-upload
            v-model:file-list="fileList"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :before-upload="beforeUpload"
            :on-change="onChange"
    >
      <el-icon><Plus /></el-icon>
    </el-upload>

    <el-dialog v-model="dialogVisible">
      <img w-full :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
  </div>
</template>

<style scoped>
  .el-upload .el-upload--picture-card{
    background-color: #2b2b2b;
  }
</style>

<script setup>
  import { getServer } from "../environment/environment";
  import { getRandomNum } from "../utils/utilsService";
  import cos from "../utils/COSutils";
  import { ElMessage } from 'element-plus';
  import 'element-plus/es/components/message/style/css'; // this is only needed if the page also used ElMessage
  import 'element-plus/es/components/message-box/style/css';//还要引入css，抽象
  import { ref,watch} from 'vue'
  import { Plus } from '@element-plus/icons-vue'

  const dialogImageUrl = ref('');
  const dialogVisible = ref(false);
  const emits=defineEmits(["getImgList"]);
  const fileList=ref([]);
  const imgList=ref([]);


  const handleRemove = (uploadFile, uploadFiles) => {
    // console.log(uploadFile, uploadFiles);
  }

  const onChange=(uploadFile, uploadFiles) => {
    console.log(uploadFile, uploadFiles);
  }

  const handlePictureCardPreview= (uploadFile) => {
    dialogImageUrl.value = uploadFile.url;
    dialogVisible.value = true;
  }


  function beforeUpload(file) {
    console.log(file);
    uploadFile(file);
    return false;
  }

  function uploadFile(file) {
    if (file.size<=1024*1024*5){
      const fileName=getRandomNum();
      const url=getServer().cosFileTree.blogPic.children.talkPic.path+"/"+fileName;
      /* 直接调用 cos sdk 的方法 */
      return   cos.uploadFile({
        Bucket: getServer().bucket, /* 填写自己的 bucket，必须字段 */
        Region: getServer().region,     /* 存储桶所在地域，必须字段 */
        Key: url,              /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
        Body: file, // 上传文件对象
        SliceSize: 1024 * 1024 * 5,     /* 触发分块上传的阈值，超过5MB 使用分块上传，小于5MB使用简单上传。可自行设置，非必须 */
      }).then((res)=> {
        imgList.value.push({ name:fileName,url:"https://"+res.Location});
        fileList.value.push(
                {
                  name:file.name,
                  percentage:100,
                  raw:file,
                  size:file.size,
                  status:"done",
                  uid:file.uid,
                  url:"https://"+res.Location
                }
        )
        console.log(imgList)
      }).catch((error)=>{
        ElMessage.error('文件错误，上传失败')
      })
    }
    else{
      ElMessage.error('图片大于5m，上传失败')
    }

  }

  watch(imgList.value,()=>{
    emits("getImgList",imgList.value);
  })
</script>


