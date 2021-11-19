import {
    CacheStorageType,
    CacheOptionObject,
    CacheReturnResult
} from './type';

import {
    CacheStorageControl
} from './control/control';

import {
    SessionLocal,
    Memory
} from './control/index';

export default class Cache {

    constructor(private storageKey?:string){}

    // 当前所有的对象
    private examples:Record<CacheStorageType, CacheStorageControl>

    // 获取当前对象
    getExamples(key:CacheStorageType):CacheStorageControl{
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
                case 'local': this.examples[key] = new SessionLocal(window.localStorage,this.storageKey);break;
                case 'session': this.examples[key] = new SessionLocal(window.sessionStorage,this.storageKey);break;
                default: this.examples[key] = new Memory();
            }
        }

        return this.examples[key];

    }

    map(callback:(key:CacheStorageType,index:number,arr:Array<CacheStorageType>)=>any) {
        return (['memory','session','local'] as Array<CacheStorageType>).map(callback);
    }

    // 清除所有
    clear(option:CacheOptionObject){
        let example:CacheStorageControl = this.getExamples(option.storage);
        return  example.clear();
    }

    // 检查是否存在此key
    search(key:string,option:CacheOptionObject):boolean{
        let example:CacheStorageControl = this.getExamples(option.storage);
        return  example.search(key);
    }

    // 获取缓存
    getItem(key:string,option:CacheOptionObject):CacheReturnResult | undefined{

        // 是否为首次
        let first = false;

        // 获取实例
        let example:CacheStorageControl = this.getExamples(option.storage);

        let resultData = example.getItem(key,function () {
            first = true;
        });

        if (resultData) {
            return {
                first,
                data:resultData
            }
        }

        return undefined;

    }

    // 获取组缓存
    getGroupItem<T=any>(id:string,option:CacheOptionObject):Array<T>{
        // 获取实例
        let example:CacheStorageControl = this.getExamples(option.storage);
        return example.getGroup(id);
    }

    // 设置缓存
    setItem(key:string,data:Response | Record<string, any>,option:CacheOptionObject) {
        let example:CacheStorageControl = this.getExamples(option.storage);
        return example.setItem(key,data,option);
    }

    // 设置组缓存
    setGroupItem(id:string,data:Response | Record<string, any>,option:CacheOptionObject){
        let example:CacheStorageControl = this.getExamples(option.storage);

        return example.setGroup(id,data,option);
    }

    // 删除缓存
    removeItem(key:string,option:CacheOptionObject){
        let example:CacheStorageControl = this.getExamples(option.storage);
        return example.removeItem(key);
    }

    // 删除组缓存
    removeGroup(id:string,option:CacheOptionObject){
         let example:CacheStorageControl = this.getExamples(option.storage);

         return example.removeGroup(id);
    }

}
