import {requestClient} from "@/transport/rest/rest-client";


type Request = {
    body: null | string;
    method: string;
    path: string;
};

export type Paging =
    | {
    page?: number;
    pageSize?: number;
}
    | undefined;

/**
 * 通用请求处理器
 */
export function requestClientRequestHandler({path, method, body}: Request) {
    return requestClient.request(path, {
        method,
        data: body,
    } as never);
}
