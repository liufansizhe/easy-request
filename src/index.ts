import { AxiosInstance, AxiosResponse } from "./../node_modules/axios/index.d";

import { CreateAxiosDefaults } from "axios";
import axios from "axios";
import config from "./config";
import qs from "qs";

export interface RequestListType {
  url: string;
  type: "get" | "post" | "put" | "delete";
  headers?: object;
}
export interface LfRequestProps {
  config?: CreateAxiosDefaults;
  requestList: RequestListType[];
}
interface RequestListClassTypes extends RequestListType {
  fn?: (val?: any) => Promise<AxiosResponse<any, any>> | undefined;
}
class lfRequest {
  private config;
  private Axios: AxiosInstance | null;
  private requestList: RequestListClassTypes[];
  constructor(props: LfRequestProps) {
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
        return this.interceptorsRequest(config, null);
      },
      (error) => {
        return this.interceptorsRequest(null, error);
      }
    );
    this.Axios.interceptors.response.use(
      (response) => {
        return this.interceptorsResponse(response, null);
      },
      (error) => {
        return this.interceptorsResponse(null, error);
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
  interceptorsRequest(config: any, error: any) {
    if (config) {
      if (config.headers["Content-Type"] == "multipart/form-data") {
        return config;
      }
      if (config.method === "post") config.data = qs.stringify(config.data);
      return config;
    } else if (error) {
      return error;
    }
  }
  interceptorsResponse(response: any, error: any) {
    if (response) {
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
    } else if (error) {
      switch (error?.response?.status) {
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
    let apiList: {
      [key: string]: (
        val?: any
      ) => Promise<AxiosResponse<any, any>> | undefined;
    } = {};
    this.requestList.forEach((item) => {
      const list = item?.url?.split("/");
      const name =
        list[list.length - 1].charAt(0).toUpperCase() +
        list[list.length - 1].slice(1);
      if (item.fn) {
        apiList[name] = item.fn;
      }
    });
    return apiList;
  }
}
export default lfRequest;
