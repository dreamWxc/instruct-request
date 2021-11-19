import slicePlugin from '../index';
import axios from 'axios';
const CancelToken = axios.CancelToken;
export default class UploadContxt {
    resultCache;
    // 成功的数量
    success;
    // 剩余将被执行的分片
    surplus;
    // 失败的分片
    fail;
    // 正在执行的分片
    running;
    //使用的缓存类型
    cache;
    // 是否暂停
    suspend = false;
    // 是否结束
    end = false;
    // 名称
    name;
    // 唯一值
    unique;
    // 分析文件是否纳入进度
    analysis;
    // 合并是否纳入进度配置
    mergeAnalysis;
    // 总共分片数量
    total;
    // 自定义存储信息
    stroage;
    // 系统暂存信息
    storageContent;
    // 存储
    _surplus;
    // 定义获取 unique中
    __unique;
    // 取消
    cancelToken;
    constructor(data, resultCache) {
        this.resultCache = resultCache;
        this.setParams(data);
        this.cancelToken = CancelToken.source();
    }
    // 获取请求的 cancelToken
    getCancelToekn() {
        return this.cancelToken.token;
    }
    // 退出
    exit = false;
    // 取消本次请求
    cancel(message, remove = true) {
        this.exit = true;
        this.over();
        if (this.cancelToken)
            this.cancelToken.cancel(message || 'slice cancel');
        this.cancelToken = CancelToken.source();
        return remove && this.removeStorage(this.unique, this.resultCache);
    }
    clear() {
        this.clearDefault();
        this.suspend = false;
    }
    clearDefault() {
        this.storageContent = undefined;
        this.fail = undefined;
        this.end = false;
        this.exit = false;
    }
    setParams(data) {
        if (data) {
            for (let key in data) {
                this[key] = data[key];
            }
        }
        if (this.surplus) {
            // 存储 
            this._surplus = [...this.surplus];
        }
    }
    // 控制结束
    over() {
        if (!this.end)
            this.end = true;
    }
    // 暂停
    pause() {
        if (this.storageContent) {
            if (!this.suspend && !this.end) {
                this.suspend = true;
            }
        }
        else {
            return console.error('no running upload');
        }
    }
    // 继续
    play() {
        if (this.suspend) {
            this.suspend = false;
            if (this.storageContent) {
                let { requestConfig, config, fileOption } = this.storageContent || {};
                return slicePlugin.uploadSlice.triggerUpload(config, requestConfig, fileOption, this);
            }
            else {
                return console.error('no running upload');
            }
        }
    }
    // 设置成功
    setSuccessSlice(index) {
        if (this.success === undefined) {
            this.success = {
                length: 0
            };
        }
        this.success.length++;
        this.success[index] = 1;
        this.operationSurplus(index);
        if (this.running && this.running[index] !== undefined) {
            delete this.running[index];
        }
    }
    getNextSlice() {
        return this._surplus.pop();
    }
    // 注入失败
    addFail(index) {
        this.operationSurplus(index);
        if (this.running && this.running[index] !== undefined) {
            this.running[index] = null;
        }
        if (this.fail === undefined) {
            this.fail = [index];
        }
        else {
            if (!this.fail.includes(index)) {
                return this.fail.push(index);
            }
        }
    }
    // 执行操作剩余数量
    operationSurplus(index) {
        let resultIndex = this.surplus.indexOf(index);
        if (resultIndex >= 0) {
            return this.surplus.splice(resultIndex, 1);
        }
    }
    // 执行存储
    setStorage(hash, cache) {
        if (this.cache) {
            return cache.setItem(hash, {
                success: this.success,
                surplus: this.surplus,
                running: this.running,
                total: this.total,
                fail: this.fail,
                name: this.name,
                unqiue: this.unique,
                storage: this.stroage,
                analysis: this.analysis,
                mergeAnalysis: this.mergeAnalysis
            }, this.cache);
        }
    }
    // 删除缓存
    removeStorage(hash, cache) {
        if (this.cache) {
            return cache.removeItem(hash, this.cache);
        }
    }
}
