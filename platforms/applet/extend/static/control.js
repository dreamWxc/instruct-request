export default {
    // 获取url
    getURL(config) {
        if (config.baseURL && config.url.indexOf('http') !== 0) {
            return config.baseURL + config.url;
        }
        else {
            return config.url;
        }
    }
};
