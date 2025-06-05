# 使用方法
type:请求类型
url:请求地址
headers:请求头

请求地址前默认会拼接“api”，可以通过修改requestList同级的config来改变前缀
```js
// config默认配置
{
  // baseURL:
  //   process.env.NODE_ENV === 'development'
  //     ? 'development base_url'
  //     : 'production base_url',
  baseURL: "/api", // api的base_url
  // 自定义的请求头
  headers: {
    post: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
  },
  // 超时设置
  // timeout: 10000,
  // 跨域是否带Token
  withCredentials: true,
  // 响应的数据格式 json / blob /document /arraybuffer / text / stream
  responseType,
}
```
```js
import lfRequest from "lf-request";
import { message } from "antd";
import qs from "qs";
//config:全局配置，requestList:请求列表

const instance = new lfRequest({
config:{},
  requestList: [
    { type: "post", url: "login",headers:{}},
  ],
});
instance.interceptorsRequest = (config: any) => {
  if (config.headers["Content-Type"] == "multipart/form-data") {
    return config;
  }
  if (config.method === "post") config.data = qs.stringify(config.data);
  if (localStorage.token) {
    config.headers["Authorization "] = "Bearer " + localStorage.token;
  }
  return config;
};
instance.interceptorsResponse = (response: any, error: any) => {
  if (response) {
    if (response.status !== 200) {
      message.error(response.data.message ?? "服务异常");
    } else if (!response.data.success) {
      message.error(response.data.message);
    }
    return response.data;
  } else {
    const { response } = error;
    if (response.status !== 401) {
      message.error(response.data.message ?? "服务异常");
    } else if (!response.data.success) {
      if (window.location.pathname !== "/") {
        window.location.pathname = "/";
      }
      localStorage.removeItem("token");
      message.error(response.data.message);
    }
  }
};
const apiList = instance.getApi();
export default apiList;
```