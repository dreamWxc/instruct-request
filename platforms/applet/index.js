import control from './control';
import CancelTokenTarget, { CancelTarget } from './cancelToken';
class AppletRequest {
    Cancel = CancelTarget;
    CancelToken = CancelTokenTarget;
    isCancel = function (value) {
        return value instanceof CancelTarget;
    };
    create(config) {
        return AppletRequestInstance(config);
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
            let cancel = wx.request({
                ...resultConfig,
                header: resultConfig.headers,
                url: control.getURL(resultConfig),
                success: function (data) {
                    return resolve({
                        status: data.statusCode,
                        data: data.data,
                        headers: data.header,
                        config: resultConfig,
                        statusText: data.profile,
                        ...data
                    });
                },
                reject: reject
            });
            if (resultConfig.cancelToken) {
                resultConfig.cancelToken.promise.then(() => {
                    cancel && cancel();
                });
            }
        });
    };
    applaetInstance.upload = function (config) {
        return new Promise(function (resolve, reject) {
            let resultConfig = compatible(config, _config);
            let cancel = wx.$request({
                ...resultConfig,
                header: resultConfig.headers,
                url: control.getURL(resultConfig),
                success: function (data) {
                    return resolve({
                        status: data.statusCode,
                        data: data.data,
                        headers: data.header,
                        config: resultConfig,
                        statusText: data.profile,
                        ...data
                    });
                },
                reject: reject
            });
            if (resultConfig.cancelToken) {
                resultConfig.cancelToken.promise.then(() => {
                    cancel && cancel();
                });
            }
        });
    };
    return applaetInstance;
}
