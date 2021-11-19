import CacheDataExtend from '../../cache/extend/cacheDataExtend';
import UploadContxt from './uploadContxt';
export default class UploadExtend extends CacheDataExtend {
    cacheParams;
    constructor(cache, cacheParams) {
        super(UploadExtend.getCacheParams(cacheParams), 'noUpdate', cache);
        this.cacheParams = cacheParams;
    }
    static getCacheParams(cache) {
        if (cache) {
            return {
                ...cache,
                option: {
                    storage: cache.storage
                }
            };
        }
        else {
            return {};
        }
    }
    // 创建上传上下文
    createdController() {
        return new UploadContxt({}, this.cache);
    }
    // 获取参数
    getCacheParamsKey(key, value, defaultValue) {
        if (value)
            return value;
        if (this.cacheParams && this.cacheParams[key]) {
            return this.cacheParams[key];
        }
        else {
            return defaultValue;
        }
    }
    // 获取所有缓存 
    getCaches(storage) {
        // 获取实例
        let example = this.cache.getExamples(this.getCacheParamsKey('storage', storage, 'memory'));
        let data = [];
        if (example.keys) {
            for (let key in example.keys) {
                data.push(this.transfSpeed(example.getItem(key)));
            }
        }
        return data;
    }
    // 获取所有缓存 Promise
    getCachesPromise(storage) {
        return new Promise((relove) => relove(this.getCaches(storage)));
    }
    // 获取组
    getCacheGroup(option) {
        let data = this.getGroupData(UploadExtend.getCacheParams(option || this.cacheParams));
        let reusltData = [];
        if (data) {
            data.map((item) => reusltData.push(this.transfSpeed(item)));
        }
        return reusltData;
    }
    // 获取所有缓存 Promise
    getCachesGroupPromise(option) {
        return new Promise((relove) => relove(this.getCacheGroup(option)));
    }
    // 转变为进度
    transfSpeed(data) {
        if (!data)
            return;
        // 获取成功的数量
        let successNumber = 0;
        if (data.success) {
            successNumber = data.success.length;
        }
        let speedParams = UploadExtend.getSpeedParams({
            loaded: successNumber,
            total: data.total,
        }, data);
        // 设置必要参数
        speedParams.name = data.name;
        speedParams.storage = data.storage;
        speedParams.unique = data.unique;
        return speedParams;
    }
    static getSpeedParams(data, contxtParams = {}) {
        let analysis = contxtParams.__analysis || contxtParams.analysis || 0;
        let mergeAnalysis = contxtParams.__merge || contxtParams.mergeAnalysis || 0;
        let total = data.total + analysis + mergeAnalysis;
        let loaded = data.loaded;
        if (data.analysis) {
            loaded += analysis;
        }
        if (data.mergeAnalysis) {
            loaded += mergeAnalysis;
        }
        loaded = data.loaded > total ? total : loaded;
        // @ts-ignore
        return {
            loaded,
            total,
            relayTotal: data.total,
            analysis,
            mergeAnalysis
        };
    }
}
