
const environment={
  //请求后台地址
  aquamanBackDev:"https://cnaquaman.com:8080/WebApi",//线上环境
  // aquamanBackDev:"http://127.0.0.1:8080/WebApi",//开发环境,本地域名穿透
  //腾讯cos存储配置
  bucket:'aquaman-1314140460',
  region:'ap-beijing',
  cosip:"https://aquaman-1314140460.cos.ap-beijing.myqcloud.com",
  cosFileTree:{
    blogPic:{
      path:"/blogPic",
      children:{
        articlePic:{
          path:"/blogPic/articlePic"
        },
        talkPic:{
          path:"/blogPic/talkPic"
        }
      }
    },
    aquamanIcon:{
      path:"/aquamanIcon"
    }
  },

}





export function getServer() {
  return environment
}
