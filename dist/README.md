# 使用方法
type:请求类型
url:请求地址
name：后续发请求的函数名

请求地址前默认会拼接“api”，可以通过修改requestList同级的config来改变前缀
```js
import easyRequest from "lf-request";

const easyRequestInstance = new easyRequest({
  requestList: [{ type: "post", url: "login", name: "Login" }],
});
const apiList = easyRequestInstance.getApi();
export const Login = apiList.Login;
```