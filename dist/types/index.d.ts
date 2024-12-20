import { AxiosResponse } from "./../node_modules/axios/index.d";
import { CreateAxiosDefaults } from "axios";
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
declare class easyRequest {
    private request;
    private response;
    private config;
    private Axios;
    requestList: RequestListClassTypes[];
    constructor(props: EasyRequestProps);
    private init;
    getApi(): {
        [key: string]: (val?: any) => Promise<AxiosResponse<any, any>> | undefined;
    };
}
export default easyRequest;
