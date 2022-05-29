import { AxiosRequestConfig } from '../type/type';

export default {

    // 获取url
    getURL(config:AxiosRequestConfig){

        if (config.baseURL && (config.url as string).indexOf('http') !== 0) {
            return config.baseURL + config.url;
        } else {
            return  config.url;
        }

    }

}
