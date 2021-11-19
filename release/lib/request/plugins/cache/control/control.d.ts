
interface ControlGetItem<T=any> {
    (key:string,callback?:Function):T
}

interface ControlGetGroupItem<T=any> {
    (id:string):Array<T>
}

interface ControlRemoveItem {
    (key:string):void
}

interface ControlRemoveGroup {
    (id:string):void
}

export interface CacheUpdateTriggerParams<T=any> {
    sign:string,
    data:T,
    expire:number| StorageGetExpire<T>,
    groupId:string,
    id?:string
}

export interface CacheUpdateTrigger<T=any> {
    (data:CacheUpdateTriggerParams<T>):T
}


export type CacheUpdateValue<T=any> = CacheUpdateTrigger<T>;

export interface CacheStorageOption {
    data:string,
    expire:number,
    beginExpire?:number
}

export interface StorageOption {
    keys?:Record<string, number | string | Array<string>>,
    expires?:Record<string, number>,
    id?:Record<string, string>
}

export interface StorageGetExpire<T=any> {
    (nowData:T | undefined,oldData:T | undefined,key:string):number
}

export interface StorageSetOption<T=any> {
    expire?:number | StorageGetExpire<T>,
    groupId?:string,
    id?:string
}

interface SetGetItem<T=any> {
    (key:string,value:T,option:StorageSetOption<T>):void
}

interface SetGroupItem<T=any> {
    (id:string,value:T,option:StorageSetOption<T>):void
}

export interface CacheStorageControl {

    data:Record<string, CacheStorageOption>

    // 索引表
    keys:Record<string, number | string | Array<string>>;

    // 组
    groups:Record<string, Array<string>>;

    // 设置key
    setKey:(key:string,option:StorageSetOption)=>void;

    // 删除 key
    deleteKey:(key:string,callback:Function)=>void;

    // 删除 组
    deleteGroup:(id:string,callback:Function)=>void;

    // 获取数据
    getItem:ControlGetItem;

    // 获取组数据
    getGroup:ControlGetGroupItem;

    // 设置数据
    setItem:SetGetItem;

    // 设置数据
    setGroup:SetGroupItem;

    // 删除数据
    removeItem:ControlRemoveItem;

    // 删除组
    removeGroup:ControlRemoveGroup;

    // 获取当前的日期
    getDateTime:()=>number

    // 查询
    search:(key:string)=>boolean

    // 查询group
    searchGroup:(id:string)=>boolean

    // 清空
    clear:()=>void

}
