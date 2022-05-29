import control from './control';
import CancelTokenTarget, { CancelTarget } from './cancelToken';
class AppletRequest {
    // @ts-ignore
    Cancel = CancelTarget;
    CancelToken = CancelTokenTarget;
    isCancel = function (value) {
        return value instanceof CancelTarget;
    };
    create(config) {
        return AppletRequestInstance(config || {});
    }
}
function compatible(config = {}, baseConfig) {
    if (!baseConfig)
        return config;
    return {
        ...baseConfig,
        ...config,
    };
}
function AppletRequestInstance(_config) {
    let applaetInstance = function (config) {
        return new Promise(function (resolve, reject) {
            let resultConfig = compatible(config, _config);
            // @ts-ignore
            let cancel = wx.request({
                ...resultConfig,
                header: resultConfig.headers,
                url: control.getURL(resultConfig),
                success: function (data) {
                    return resolve({
                        status: data.statusCode,
                        // @ts-ignore
                        data: data.data,
                        headers: data.header,
                        config: resultConfig,
                        // @ts-ignore
                        statusText: data.profile,
                        ...data
                    });
                },
                fail: reject
            });
            if (resultConfig.cancelToken) {
                resultConfig.cancelToken.promise.then(() => {
                    // @ts-ignore
                    cancel && cancel();
                });
            }
        });
    };
    applaetInstance.upload = function (config) {
        return new Promise(function (resolve, reject) {
            let resultConfig = compatible(config, _config);
            // @ts-ignore
            let cancel = wx.uploadFile({
                ...resultConfig,
                // @ts-ignore
                formData: resultConfig.formData || resultConfig.data,
                header: resultConfig.headers,
                url: control.getURL(resultConfig),
                success: function (data) {
                    return resolve({
                        status: data.statusCode,
                        // @ts-ignore
                        data: data.data,
                        // @ts-ignore
                        headers: data.header,
                        config: resultConfig,
                        // @ts-ignore
                        statusText: data.profile,
                        ...data
                    });
                },
                fail: reject
            });
            if (resultConfig.cancelToken) {
                resultConfig.cancelToken.promise.then(() => {
                    // @ts-ignore
                    cancel && cancel();
                });
            }
        });
    };
    return applaetInstance;
}
export default new AppletRequest();
