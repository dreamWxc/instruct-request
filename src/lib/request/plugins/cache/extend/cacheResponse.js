import CacheDataExtend from "./cacheExtend";
class CacheResponse extends CacheDataExtend {
    constructor(target, option) {
        super({
            data: function () {
                return CacheResponse.getDataSource(target);
            },
            sign: target.__sign,
            option,
            groupId: option ? option.groupId : undefined
        });
    }
    // 根据数据源获取数据
    static getDataSource(example) {
        if (!example)
            return undefined;
        if (example.__isObject) {
            let data = Object.keys(example);
            let object = {};
            data.map((item) => {
                object[item] = data[item];
            });
            return object;
        }
        else {
            return example.data;
        }
    }
}
