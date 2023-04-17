<template>
  <div class="upload_body">
    <div style="width: 200px;height: 200px">
      <uploadImg @getImgUrl="getImgUrl"></uploadImg>
    </div>
    <button @click="getOrcResult">识别</button>
  </div>
  <div class="result_body">
    <Loading class="loading" v-if="isOrcing"></Loading>
    <div class="result_img">
      <img :src="imgUrl">
    </div>
    <div class="result_form">
      <div class="form_item" id="form_title">
        <span>块号</span>
        <span>序号</span>
        <span style="width: 140px;">识别结果</span>
        <span>左上X</span>
        <span>左上Y</span>
        <span>右下X</span>
        <span>右下Y</span>
      </div>
      <div v-for="(item,index) in currentList" :key="item[1][1]" class="form_item" id="form_child">
        <span>{{index+1}}</span>
        <span>{{index+1}}</span>
        <span style="width: 140px;overflow: auto">{{item[1][0]}}</span>
        <span>{{item[0][0][0]}}</span>
        <span>{{item[0][0][1]}}</span>
        <span>{{item[0][2][0]}}</span>
        <span>{{item[0][2][1]}}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .loading{
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: #00a4a2;
    opacity: 0.5;
  }
.test_body{
  width: 200px;
  height: 200px;
}
  .result_body{
    display: flex;
    flex-direction: row;
    margin-left: 0.5rem;
    position: relative;
  }
  .result_img{
    width: 50%;
    position: relative;
  }
  .result_img img{
    width: 100%;
  }
  .result_form{
    display: flex;
    flex-direction: column;
    max-height: 500px;
    overflow: auto;
    box-sizing: border-box;
  }
  .result_form::-webkit-scrollbar {
    width: 0;
    height: 10px;
  } /* 这是针对缺省样式 (必须的) */
  .form_item{
    display: flex;
    flex-direction: row;
    color: whitesmoke;
  }
  .form_item span{
    line-height: 30px;
    border: 2px #00a4a2 solid;
    width: 50px;
    text-align: center;
  }
</style>

<script setup>
  import {ref,onMounted} from "vue";
  import { getServer } from "../../environment/environment";
  import { getRandomNum } from "../../utils/utilsService";
  import cos from "../../utils/COSutils";
  import { ElMessage } from 'element-plus';
  import 'element-plus/es/components/message/style/css'; // this is only needed if the page also used ElMessage
  import 'element-plus/es/components/message-box/style/css';//还要引入css，抽象

  const imgUrl=ref("https://aquaman-1314140460.cos.ap-beijing.myqcloud.com/blogPic/articlePic/168154675042087146");
  const resultUrl=ref("");
  const resultList=ref([]);
  const currentList=ref([]);
  const resultElementList=[];
  const isOrcing=ref(false)
  let imgRatio=1;

  let imgElement={}

  onMounted(()=>{
    imgElement=document.querySelector('.result_img')
  })

  function getImgUrl(url){
    resultElementList.forEach((element)=>{
      imgElement.removeChild(element)
    });
    imgUrl.value=url;
    const imgObj = new Image();
    // 改变图片的src
    imgObj.src = imgUrl.value;
    imgObj.onload = function(){
      console.log(imgElement.offsetWidth,imgObj.width,imgElement.offsetWidth/imgObj.width)
      imgRatio=imgElement.offsetWidth/imgObj.width
    };

    console.log(url);

  }
  function getOrcResult() {
    isOrcing.value=true;
    fetchJson("http://127.0.0.1:6111/orctest?imgUrl="+imgUrl.value,{},"POST").then((response)=>{
      response.json().then((data)=>{
        console.log(data);
        resultUrl.value=data[1];
        resultList.value=data[0];
        currentList.value=resultList.value
        resultList.value.forEach((item)=>{
          const Element=document.createElement('div');
          Element.className="box_item";
          Element.id=item[1][1]+'';
          Element.style.top=item[0][0][1]*imgRatio+"px";
          Element.style.left=item[0][0][0]*imgRatio+"px";
          Element.style.width=(item[0][2][0]-item[0][0][0])*imgRatio+"px";
          Element.style.height=(item[0][2][1]-item[0][0][1])*imgRatio+"px";
          Element.style.border="1px blue solid";
          Element.style.position="absolute";
          Element.addEventListener("mouseenter",()=> {
            currentList.value = resultList.value.filter(resultItem => resultItem[1][1] + '' === item[1][1] + '');
            Element.style.border = "1px red solid";
          });
          Element.addEventListener("mouseleave",()=> {
            currentList.value = resultList.value;
            Element.style.border = "1px blue solid";
          })
          resultElementList.push(Element);
          imgElement.appendChild(Element);
        })
        isOrcing.value=false
      })
    })
  }




  function fetchJson(url,bodyData,reqMethod){
    //发起请求
    const options={
      method:reqMethod,
      body:bodyData,
      headers:{
        "Content-Type":"application/x-www-form-urlencoded"
      }
    }
    const promise = fetch(url,options)
    return promise
  }

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
