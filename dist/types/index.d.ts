import { AxiosResponse } from "./../node_modules/axios/index.d";
import { CreateAxiosDefaults } from "axios";
export interface RequestListType {
    url: string;
    type: "get" | "post" | "put" | "delete";
    headers?: object;
}
export interface EasyRequestProps {
    config?: CreateAxiosDefaults;
    requestList: RequestListType[];
}
declare class easyRequest {
    private config;
    private Axios;
    private requestList;
    constructor(props: EasyRequestProps);
    private init;
    interceptorsRequest(config: any, error: any): any;
    interceptorsResponse(response: any, error: any): any;
    getApi(): {
        [key: string]: (val?: any) => Promise<AxiosResponse<any, any>> | undefined;
    };
}
export default easyRequest;
