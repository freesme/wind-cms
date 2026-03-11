import {RequestClient} from "@/transport/rest/request-client";
import {HttpResponse} from "@/transport/rest/types";
import {authenticateResponseInterceptor, errorMessageResponseInterceptor} from "@/transport/rest/preset-interceptors";
import store from '@/store';
import {reauthenticate, refreshToken} from "@/store/slices/authentication/slice";


const apiURL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
const preferences = {
    app: {
        locale: 'zh-CN',
        enableRefreshToken: true,
    },
};

function createRequestClient(baseURL: string) {
    const client = new RequestClient({
        baseURL,
    });

    /**
     * 重新认证逻辑
     */
    async function doReAuthenticate() {
        await reauthenticate();
    }

    /**
     * 刷新token逻辑
     */
    async function doRefreshToken() {
        const state = store.getState();
        const token = typeof state.access.refreshToken === 'string' ? state.access.refreshToken : '';
        // dispatch refreshToken action，等待结果
        const result = await store.dispatch(refreshToken(token));
        // 提取新 token
        return result.payload as string;
    }

    /**
     * 格式化令牌
     * @param token
     */
    function formatToken(token: null | string) {
        return token ? `Bearer ${token}` : null;
    }

    // 请求头处理
    client.addRequestInterceptor({
        fulfilled: (config) => {
            config.headers.Authorization = formatToken(store.getState().access.accessToken);
            config.headers['Accept-Language'] = preferences.app.locale;
            return config as never;
        },
    });

    // response数据解构
    client.addResponseInterceptor({
        fulfilled: (response) => {
            const {data: responseData, status} = response;

            // TODO 根据Kratos进行定制

            if (status >= 200 && status < 400) {
                return responseData;
            }

            const {code} = responseData as HttpResponse;
            if (code !== null) {
                throw Object.assign({}, responseData, {responseData});
            }

            console.error('parse HttpResponse failed!', response);
            throw Object.assign({}, response, {response});
        },
    });

    // token过期的处理
    client.addResponseInterceptor(
        authenticateResponseInterceptor({
            client,
            doReAuthenticate,
            doRefreshToken,
            enableRefreshToken: preferences.app.enableRefreshToken,
            formatToken,
        }),
    );

    // 通用的错误处理,如果没有进入上面的错误处理逻辑，就会进入这里
    client.addResponseInterceptor(
        errorMessageResponseInterceptor(async (msg: string, error) => {
            const responseData = (error as unknown as { response?: { data?: any } })?.response?.data ?? {};
            const errorMessage = responseData?.error ?? responseData?.message ?? '';
            window.alert(errorMessage || msg);
        }),
    );

    return client;
}

export const requestClient = createRequestClient(apiURL);

export const baseRequestClient = new RequestClient({baseURL: apiURL});
