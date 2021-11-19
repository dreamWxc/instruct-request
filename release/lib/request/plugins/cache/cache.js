import { SessionLocal, Memory } from './control/index';
export default class Cache {
    storageKey;
    constructor(storageKey) {
        this.storageKey = storageKey;
    }
    // 当前所有的对象
    examples;
    // 获取当前对象
    getExamples(key) {
        if (!this.examples) {
            // @ts-ignore
            this.examples = {};
        }
        if (!this.examples[key]) {
            // 兼容对象
            if (!window && key !== 'memory' || window && !window.localStorage && key === 'local' || window && !window.sessionStorage && key === 'session') {
                key = 'memory';
            }
            switch (key) {
                case 'local':
                    this.examples[key] = new SessionLocal(window.localStorage, this.storageKey);
                    break;
                case 'session':
                    this.examples[key] = new SessionLocal(window.sessionStorage, this.storageKey);
                    break;
                default: this.examples[key] = new Memory();
            }
        }
        return this.examples[key];
    }
    map(callback) {
        return ['memory', 'session', 'local'].map(callback);
    }
    // 清除所有
    clear(option) {
        let example = this.getExamples(option.storage);
        return example.clear();
    }
    // 检查是否存在此key
    search(key, option) {
        let example = this.getExamples(option.storage);
        return example.search(key);
    }
    // 获取缓存
    getItem(key, option) {
        // 是否为首次
        let first = false;
        // 获取实例
        let example = this.getExamples(option.storage);
        let resultData = example.getItem(key, function () {
            first = true;
        });
        if (resultData) {
            return {
                first,
                data: resultData
            };
        }
        return undefined;
    }
    // 获取组缓存
    getGroupItem(id, option) {
        // 获取实例
        let example = this.getExamples(option.storage);
        return example.getGroup(id);
    }
    // 设置缓存
    setItem(key, data, option) {
        let example = this.getExamples(option.storage);
        return example.setItem(key, data, option);
    }
    // 设置组缓存
    setGroupItem(id, data, option) {
        let example = this.getExamples(option.storage);
        return example.setGroup(id, data, option);
    }
    // 删除缓存
    removeItem(key, option) {
        let example = this.getExamples(option.storage);
        return example.removeItem(key);
    }
    // 删除组缓存
    removeGroup(id, option) {
        let example = this.getExamples(option.storage);
        return example.removeGroup(id);
    }
}
