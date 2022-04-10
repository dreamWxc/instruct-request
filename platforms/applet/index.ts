import { AxiosInstance, AxiosRequestConfig, AxiosStatic, CancelStatic, CancelTokenStatic,AxiosResponse} from '../../src/lib/request-config';

import control from './control';

import CancelTokenTarget,{CancelTarget} from './cancelToken';


class AppletRequest implements AxiosStatic{

    Cancel: CancelStatic = CancelTarget;
    CancelToken: CancelTokenStatic = CancelTokenTarget;
    isCancel: (value: any) => boolean = function (value) {
        return value instanceof CancelTarget;
    };
    create(config?: AxiosRequestConfig): AxiosInstance {
        return AppletRequestInstance(config);
    }

}

function compatible(config:AxiosRequestConfig={},baseConfig:AxiosRequestConfig) {
    if (!baseConfig) return config;
    return {
        ...baseConfig,
        ...config,
    }
}

function AppletRequestInstance(_config:AxiosRequestConfig) :AxiosInstance{


    let applaetInstance:AxiosInstance = function<T>(config:AxiosRequestConfig):Promise<AxiosResponse<T>> {
        return new Promise(function (resolve, reject) {
            let resultConfig = compatible(config,_config);
            // @ts-ignore
            let cancel = wx.request({
                ...resultConfig,
                header:resultConfig.headers,
                url:control.getURL(resultConfig),
                success:function (data){
                    return resolve({
                        status:data.statusCode,
                        // @ts-ignore
                        data:data.data,
                        headers:data.header,
                        config:resultConfig,
                        // @ts-ignore
                        statusText:data.profile,
                        ...data
                    });
                },
                fail:reject
            });

            if (resultConfig.cancelToken) {
                resultConfig.cancelToken.promise.then(()=>{
                    // @ts-ignore
                    cancel && cancel();
                });
            }
        });
    };
    applaetInstance.upload =function<T> (config:AxiosRequestConfig):Promise<AxiosResponse<T>> {
        return new Promise(function (resolve, reject) {
            let resultConfig = compatible(config,_config);
            // @ts-ignore
            let cancel = wx.uploadFile({
                ...resultConfig,
                // @ts-ignore
                formData: resultConfig.formData || resultConfig.data,
                header:resultConfig.headers,
                url:control.getURL(resultConfig),
                success:function (data){
                    return resolve({
                        status:data.statusCode,
                        // @ts-ignore
                        data:data.data,
                        // @ts-ignore
                        headers:data.header,
                        config:resultConfig,
                        // @ts-ignore
                        statusText:data.profile,
                        ...data
                    });
                },
                fail:reject
            });
            if (resultConfig.cancelToken) {
                resultConfig.cancelToken.promise.then(()=>{
                    // @ts-ignore
                    cancel && cancel();
                });
            }
        });
    }

    return applaetInstance;
}

export default new AppletRequest();
