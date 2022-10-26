import axios from "axios";
import { Observable } from "rxjs";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
import * as _sh from "lodash";
import { jsonp } from "vue-jsonp/dist";

export function ajaxPostJsonp(_url, _body) {
  // eslint-disable-next-line class-methods-use-this
  const observable = Observable.create((observer) => {
    jsonp(_url, _body)
      .then((response) => {
        // 处理成功情况

        observer.next(response);
        observer.complete();
      })
      .catch((error) => {
        // 处理错误情况
        console.log(error, "测试");
        const httpCode = _sh.get(error, ["code"], null);
        if (_sh.indexOf(["ERR_NETWORK", "ERR_BAD_RESPONSE"], httpCode) > -1) {
          const serverUrl = _sh.get(error, ["config", "url"], null);
          console.log(`连接服务器失败：${serverUrl}`);
        }
        observer.next(error);
        observer.complete();
      })
      .then(() => {
        // 总是会执行
      });
  });
  return observable;
}

export function ajaxPostJson(_url, _body) {
  // eslint-disable-next-line class-methods-use-this
  const observable = Observable.create((observer) => {
    const options = {
      method: "POST",
      headers: { "content-type": "application/json" },
      url: _url,
      data: _body,
    };
    axios(options)
      .then((response) => {
        // 处理成功情况
        observer.next(response);
        observer.complete();
      })
      .catch((error) => {
        // 处理错误情况
        const httpCode = _sh.get(error, ["code"], null);
        if (_sh.indexOf(["ERR_NETWORK", "ERR_BAD_RESPONSE"], httpCode) > -1) {
          const serverUrl = _sh.get(error, ["config", "url"], null);
          console.log(`连接服务器失败：${serverUrl}`);
        }
        observer.next(error);
        observer.complete();
      })
      .then(() => {
        // 总是会执行
      });
  });
  return observable;
}

// 请求实例
// const queryData={
//   tag:"银行",
//   region:"武汉",
//   output:"json",
//   ak:"0NxjAFyocgVbEU09zOVmIgm6WOOqnHXT"
// }
// ajaxPostJsonp("https://api.map.baidu.com/place/v2/search",queryData).subscribe((response)=>{
//   console.log(response)
// })
