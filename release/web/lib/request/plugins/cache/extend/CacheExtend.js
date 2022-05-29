import CacheDataExtend from './cacheDataExtend';
export default class CacheExtend extends CacheDataExtend {
    constructor(options, cache) {
        super(options, 'superset', cache);
    }
    // 清除
    clear(storage) {
        this.cache.clear({
            storage
        });
        return this;
    }
    // 清空所有类型
    clearAll(data) {
        let option = this.getParams(data);
        this.map(this.cache, option.where, (item) => {
            return this.clear(item);
        });
        return this;
    }
}
