import { AxiosInstance, AxiosResponse } from "./../node_modules/axios/index.d";

import { CreateAxiosDefaults } from "axios";
import axios from "axios";
import config from "./config";
import qs from "qs";

export interface RequestListType {
  name: string;
  url: string;
  type: "get" | "post" | "put" | "delete";
  headers?: object;
}
export interface EasyRequestProps {
  request?: Array<(props: any) => any>;
  response?: Array<(props: any) => any>;
  config?: CreateAxiosDefaults;
  requestList: RequestListType[];
}
interface RequestListClassTypes extends RequestListType {
  fn?: (val?: any) => Promise<AxiosResponse<any, any>> | undefined;
}
class easyRequest {
  private request;
  private response;
  private config;
  private Axios: AxiosInstance | null;
  private requestList: RequestListClassTypes[];
  constructor(props: EasyRequestProps) {
    this.request = props?.request;
    this.response = props?.response;
    this.config = props?.config;
    this.Axios = null;
    this.requestList = props.requestList;
    this.init();
  }
  private init() {
    const axiosConfig = { ...config, ...this.config };
    this.Axios = axios.create(axiosConfig);
    this.Axios.interceptors.request.use(
      (config) => {
        if (this.request?.[0]) {
          return this.request?.[0](config);
        }
        if (config.headers["Content-Type"] == "multipart/form-data") {
          return config;
        }
        if (config.method === "post") config.data = qs.stringify(config.data);
        return config;
      },
      (error) => {
        if (this.request?.[1]) {
          return this.request?.[1](error);
        }
        return Promise.reject(error);
      }
    );
    this.Axios.interceptors.response.use(
      (response) => {
        if (this.response?.[0]) {
          return this.response?.[0](response);
        }
        switch (response.status) {
          case 200: {
            if (response?.data?.code < 0) {
              return { ...response?.data, data: null };
            } else {
              return {
                ...response.data,
              };
            }
          }
          default: {
            return { ...response, data: null };
          }
        }
      },
      (error) => {
        if (this.response?.[1]) {
          return this.response?.[1](error);
        }
        switch (error?.response?.status) {
          case 401: {
            return { data: null };
          }
          default: {
            return { data: null };
          }
        }
      }
    );
    this.requestList.map((item) => {
      let requestConfig = {};

      item.fn = (val?: any) => {
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
        return this.Axios?.({
          url: item.url,
          method: item.type,
          headers: item?.headers,
          ...requestConfig,
        });
      };
    });
  }
  getApi() {
    let apiList: {
      [key: string]: (
        val?: any
      ) => Promise<AxiosResponse<any, any>> | undefined;
    } = {};
    this.requestList.forEach((item) => {
      if (item.fn) {
        apiList[item.name] = item.fn;
      }
    });
    return apiList;
  }
}
export default easyRequest;
