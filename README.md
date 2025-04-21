# 使用方法
type:请求类型
url:请求地址
name：后续发请求的函数名

请求地址前默认会拼接“api”，可以通过修改requestList同级的config来改变前缀
```js
import easyRequest from "lf-request";

const easyRequestInstance = new easyRequest({
  requestList: [{ type: "post", url: "login",headers:{}}],
});
//请求前拦截
easyRequestInstance.interceptorRequest=(config,error)=>{}
//请求结果拦截
easyRequestInstance.interceptorsResponse=(config,error)=>{}
export default easyRequestInstance.getApi();
```