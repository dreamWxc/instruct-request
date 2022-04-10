export default class CacheControl {
    // 参数列表
    options;
    // 快照参数列表
    snapshotOptions;
    // 镜像
    imageOptions;
    constructor(options) {
        this.options = options;
        if (options) {
            // 绘制镜像
            this.imageOptions = Object.assign({}, options);
        }
        // 注入相关函数
        [
            'sign',
            'skip',
            'data',
            'groupId',
            'replace',
            'where',
            'option'
        ].map((key) => {
            this[key] = (value) => {
                return this.addRollBack(key, value);
            };
        });
    }
    // 是否处于正在修改的状态
    optionUpdate;
    // 处于修改的异步对象
    asyncOptionUpdateTime;
    // 修改参数
    addRollBack(key, value) {
        // 如果回滚的快照 不存在触发
        if (key === null && value === null)
            return this;
        // 如果镜像不存在创建一个
        if (this.imageOptions === undefined)
            this.imageOptions = {};
        // 比对配置
        if (key === null ? true : this.imageOptions[key] !== value) {
            // 设置参数
            if (key === null) {
                this.imageOptions = Object.assign({}, value);
            }
            else {
                this.imageOptions[key] = value;
            }
            // 清楚异步执行
            clearTimeout(this.asyncOptionUpdateTime);
            // 设置当前正在进行异步操作
            this.optionUpdate = true;
            // 获取异步执行
            this.asyncOptionUpdateTime = setTimeout(() => this.completeRollBack());
        }
        return this;
    }
    // 完成添加操作
    completeRollBack() {
        if (!this.optionUpdate)
            return;
        // 清楚异步执行
        clearTimeout(this.asyncOptionUpdateTime);
        // 关闭异步操作通道
        this.optionUpdate = false;
        if (this.snapshotOptions === null) {
            this.snapshotOptions = undefined;
        }
        else {
            // 执行绘制快照
            this.snapshotOptions = Object.assign({}, this.options);
        }
        // 执行同步镜像
        this.options = Object.assign({}, this.imageOptions);
    }
    // 回滚
    rollBack() {
        let snapshotOptions = this.snapshotOptions;
        if (snapshotOptions === null)
            return this;
        this.snapshotOptions = null;
        return this.addRollBack(null, snapshotOptions);
    }
    // 获取使用参数
    getParams(data) {
        // 创建完成
        this.completeRollBack();
        let resultData = data ? Object.assign({}, this.options, data) : this.options;
        if (resultData.replace) {
            this.triggerReplace(resultData.replace, resultData);
            // 执行完成
            this.completeRollBack();
        }
        return resultData;
    }
    // 触发替换
    triggerReplace(trigger, data) {
        if (typeof trigger === 'function') {
            for (let key in data) {
                if (data.hasOwnProperty(key) && data[key] !== this.options[key]) {
                    trigger(key, data[key], this.options[key]) && this.addRollBack(key, data[key]);
                }
            }
        }
        else {
            return this.addRollBack(null, data);
        }
    }
    // 循环
    map(cache, trigger, callback) {
        if (trigger && trigger instanceof Array) {
            return trigger.map(callback);
        }
        else if (typeof trigger === 'function') {
            return cache.map((item, index, arg) => {
                return trigger(item) && callback && callback(item, index, arg);
            });
        }
        else {
            return cache.map(callback);
        }
    }
    // 获取配置指南
    getParamsConfig = {
        'data': { function: true, next: 'dataTrigger' },
        'sign': { next: 'id' },
        'dataTrigger': { function: true }
    };
    // 获取key
    getParamsValue(data, key) {
        if (!data) {
            if (data.option && data.option[key]) {
                return data.option[key];
            }
            return undefined;
        }
        let config = this.getParamsConfig[key];
        if (config && config.function && typeof data[key] === 'function') {
            // @ts-ignore
            return data[key](data, this.options);
        }
        else {
            if (data[key] === undefined && config.next) {
                let next = typeof config.next === 'string' ? [config.next] : config.next;
                for (let i = 0, count = next.length; i < count; i++) {
                    if (data[next[i]] !== undefined) {
                        return this.getParamsValue(data, next[i]);
                    }
                }
            }
            return data[key];
        }
    }
    // 触发条件
    triggerWhere(trigger, item) {
        if (typeof trigger === 'function') {
            return trigger(item);
        }
        else if (trigger && trigger instanceof Array) {
            return trigger.includes(item);
        }
        return false;
    }
}
