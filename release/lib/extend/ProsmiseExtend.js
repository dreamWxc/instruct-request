export default class PromiseExtend {
    // 获取
    triggerTimeCallback;
    // 构造
    constructor(executor) {
        if (!executor) {
            console.error('no trigger Function,this arg is', executor, 'but need typeof is Function');
        }
        else {
            this.triggerTimeCallback = setTimeout(() => {
                return executor(this.resolve.bind(this), this.reject.bind(this));
            }, 0);
        }
    }
    // 成功的事件收集
    resolves = undefined;
    // 失败的事件收集
    rejects = undefined;
    // 完成的事件收集
    finallys = undefined;
    // 创建订阅收集机制
    subscribe(key, callback) {
        if (this[key] === undefined)
            this[key] = [];
        // 执行收集
        return this[key].push(callback);
    }
    // 广播
    broadcastSubscribe(key, data) {
        this[key] && this.broadcast(key, data);
        return this['finallys'] && this.broadcast('finallys', data);
    }
    // 广播执行器
    broadcast(key, data) {
        let resultData = data;
        this[key].map((item) => {
            resultData = item(resultData);
        });
    }
    // 成功的开放函数
    then(onfulfilled) {
        this.subscribe('resolves', onfulfilled);
        return this;
    }
    // 完成的开放函数
    finally(onfulfilled) {
        this.subscribe('finallys', onfulfilled);
        return this;
    }
    // 失败的开放函数
    catch(onfulfilled) {
        this.subscribe('rejects', onfulfilled);
        return this;
    }
    // 构造成功函数
    resolve(data) {
        return this.broadcastSubscribe('resolves', data);
    }
    // 失败的构造函数
    reject(data) {
        this.broadcastSubscribe('rejects', data);
        return this.done();
    }
    // 完成
    done() {
        // 清除计数器操作
        clearTimeout(this.triggerTimeCallback);
        // 清空所有回调
        ['resolves', 'rejects', 'finallys'].map((item) => {
            this[item] = undefined;
        });
    }
}
