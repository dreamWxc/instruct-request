import CacheDataExtend from "./cacheExtend";
import {ResponseExtendChain} from "../../../type";
import {CacheOptionObject} from "../type";

class CacheResponse extends CacheDataExtend{

    constructor(target:ResponseExtendChain,option?:CacheOptionObject) {
        super({
            data:function () {
                return CacheResponse.getDataSource(target);
            },
            sign:target.__sign,
            option,
            groupId:option ? option.groupId : undefined
        });
    }

    // 根据数据源获取数据
    static getDataSource(example:Record<string,any> & ResponseExtendChain){

        if (!example) return  undefined;

        if (example.__isObject) {
            let data = Object.keys(example);
            let object:Record<string, any> = {};
            data.map((item)=>{
                object[item] = data[item];
            });
            return object;

        } else {
            return example.data;
        }
    }

}
