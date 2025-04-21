import axios from 'axios';
import qs from 'qs';

const responseType = "json";
var config = {
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
};

class easyRequest {
    constructor(props) {
        this.config = props === null || props === void 0 ? void 0 : props.config;
        this.Axios = null;
        this.requestList = props.requestList;
        this.init();
    }
    init() {
        const axiosConfig = Object.assign(Object.assign({}, config), this.config);
        this.Axios = axios.create(axiosConfig);
        this.Axios.interceptors.request.use((config) => {
            return this.interceptorsRequest(config, null);
        }, (error) => {
            return this.interceptorsRequest(null, error);
        });
        this.Axios.interceptors.response.use((response) => {
            return this.interceptorsResponse(response, null);
        }, (error) => {
            return this.interceptorsResponse(null, error);
        });
        this.requestList.map((item) => {
            let requestConfig = {};
            item.fn = (val) => {
                var _a;
                switch (item.type) {
                    case "get": {
                        requestConfig = {
                            params: val,
                        };
                        break;
                    }
                    case "delete":
                    case "put":
                    case "post": {
                        requestConfig = {
                            data: val,
                        };
                        break;
                    }
                }
                return (_a = this.Axios) === null || _a === void 0 ? void 0 : _a.call(this, Object.assign({ url: item.url, method: item.type, headers: item === null || item === void 0 ? void 0 : item.headers }, requestConfig));
            };
        });
    }
    interceptorsRequest(config, error) {
        if (config) {
            if (config.headers["Content-Type"] == "multipart/form-data") {
                return config;
            }
            if (config.method === "post")
                config.data = qs.stringify(config.data);
            return config;
        }
        else if (error) {
            return error;
        }
    }
    interceptorsResponse(response, error) {
        var _a, _b;
        if (response) {
            switch (response.status) {
                case 200: {
                    if (((_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.code) < 0) {
                        return Object.assign(Object.assign({}, response === null || response === void 0 ? void 0 : response.data), { data: null });
                    }
                    else {
                        return Object.assign({}, response.data);
                    }
                }
                default: {
                    return Object.assign(Object.assign({}, response), { data: null });
                }
            }
        }
        else if (error) {
            switch ((_b = error === null || error === void 0 ? void 0 : error.response) === null || _b === void 0 ? void 0 : _b.status) {
                case 401: {
                    return { data: null };
                }
                default: {
                    return { data: null };
                }
            }
        }
    }
    getApi() {
        let apiList = {};
        this.requestList.forEach((item) => {
            var _a;
            const list = (_a = item === null || item === void 0 ? void 0 : item.url) === null || _a === void 0 ? void 0 : _a.split("/");
            const name = list[list.length - 1].charAt(0).toUpperCase() +
                list[list.length - 1].slice(1);
            if (item.fn) {
                apiList[name] = item.fn;
            }
        });
        return apiList;
    }
}

export { easyRequest as default };
