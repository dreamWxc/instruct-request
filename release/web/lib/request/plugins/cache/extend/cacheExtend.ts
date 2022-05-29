import {CacheExtendParams} from "./type";
import {CacheStorageType} from "../type";
import Cache from "../cache";
import CacheDataExtend from './cacheDataExtend';

export default class CacheExtend extends CacheDataExtend {

    constructor(options?:CacheExtendParams,cache?:Cache) {
        super(options,'superset',cache);
    }

    // 清除
    clear(storage:CacheStorageType){
        this.cache.clear({
            storage
        });
        return this;
    }

    // 清空所有类型
    clearAll(data?:CacheExtendParams) {
        let option = this.getParams(data);
        this.map(this.cache,option.where,(item)=>{
            return this.clear(item);
        });
        return this;
    }

}
