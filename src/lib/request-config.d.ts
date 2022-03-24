export interface AxiosTransformer {
    (data: any, headers?: any): any;
}

export interface CancelTokenStatic {
    new (executor: (cancel: Canceler) => void): CancelToken;
    source(): CancelTokenSource;
}

export interface AxiosAdapter {
    (config: AxiosRequestConfig): AxiosPromise<any>;
}

export interface AxiosBasicCredentials {
    username: string;
    password: string;
}

export interface AxiosProxyConfig {
    host: string;
    port: number;
    auth?: {
        username: string;
        password:string;
    };
    protocol?: string;
}

export type Method =
    | 'get' | 'GET'
    | 'delete' | 'DELETE'
    | 'head' | 'HEAD'
    | 'options' | 'OPTIONS'
    | 'post' | 'POST'
    | 'put' | 'PUT'
    | 'patch' | 'PATCH'
    | 'purge' | 'PURGE'
    | 'link' | 'LINK'
    | 'unlink' | 'UNLINK'

export type ResponseType =
    | 'arraybuffer'
    | 'blob'
    | 'document'
    | 'json'
    | 'text'
    | 'stream'

export interface TransitionalOptions{
    silentJSONParsing: boolean;
    forcedJSONParsing: boolean;
    clarifyTimeoutError: boolean;
}

export interface AxiosRequestConfig {
    url?: string;
    method?: Method;
    baseURL?: string;
    transformRequest?: AxiosTransformer | AxiosTransformer[];
    transformResponse?: AxiosTransformer | AxiosTransformer[];
    headers?: any;
    params?: any;
    paramsSerializer?: (params: any) => string;
    data?: any;
    timeout?: number;
    timeoutErrorMessage?: string;
    withCredentials?: boolean;
    adapter?: AxiosAdapter;
    auth?: AxiosBasicCredentials;
    responseType?: ResponseType;
    xsrfCookieName?: string;
    xsrfHeaderName?: string;
    onUploadProgress?: (progressEvent: any) => void;
    onDownloadProgress?: (progressEvent: any) => void;
    maxContentLength?: number;
    validateStatus?: ((status: number) => boolean) | null;
    maxBodyLength?: number;
    maxRedirects?: number;
    socketPath?: string | null;
    httpAgent?: any;
    httpsAgent?: any;
    proxy?: AxiosProxyConfig | false;
    cancelToken?: CancelToken;
    decompress?: boolean;
    transitional?: TransitionalOptions
}

export interface AxiosResponse<T = any>  {
    data: T;
    status: number;
    statusText: string;
    headers: any;
    config: AxiosRequestConfig;
    request?: any;
}

export interface AxiosError<T = any> extends Error {
    config: AxiosRequestConfig;
    code?: string;
    request?: any;
    response?: AxiosResponse<T>;
    isAxiosError: boolean;
    toJSON: () => object;
}

export interface AxiosPromise<T = any> extends Promise<AxiosResponse<T>> {
}

export interface CancelStatic {
    new (message?: string): Cancel;
}

export interface Cancel {
    message: string;
}

export interface Canceler {
    (message?: string): void;
}

export interface CancelToken {
    promise: Promise<Cancel>;
    reason?: Cancel;
    throwIfRequested(): void;
}

export interface CancelTokenSource {
    token: CancelToken;
    cancel: Canceler;
}


export interface AxiosInstance {
    (config: AxiosRequestConfig): AxiosPromise;
}

export interface AxiosStatic extends AxiosInstance {
    create(config?: AxiosRequestConfig): AxiosInstance;
    Cancel?: CancelStatic;
    CancelToken?: CancelTokenStatic;
    // 请求手动取消
    isCancel?:(value: any)=>boolean;
}
