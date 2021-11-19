import {
    InstructionOption,
    ResponseData,
    ResponseSuccess,
} from '../../index';
import {
    StorageSetOption
} from './control/control';
import {CacheExtendParams,CacheUseResponseExtend,CacheUseRequestExtendClass} from "./extend/type";
export type CacheStorageType =
    'memory' |
    'local' |
    'session'

export interface CacheExtendConfig {
    // 当前是否使用了缓存
    useCache:boolean,
}

// 向外界开放
export interface CacheRequestExtend {
    // 创建cache对象处理
    cache:(options?:CacheExtendParams)=> CacheUseRequestExtendClass,
}

// 向返回值注入字段
export interface CacheResponseExtend {
    // 是否使用缓存
    isCache?:boolean,
    // 创建cache对象处理
    cache?:()=>CacheUseResponseExtend,
}

interface CacheUpdateTrigger {
    (config:InstructionOption,result:CacheReturnResult):boolean
}

interface CacheWhereTrigger {
    (config:InstructionOption):boolean
}

export interface CacheOptionObject extends ResponseSuccess,StorageSetOption {
    // 是否更新，如果处于更新将会 继续去执行请求，并优先进行设置缓存 如果指定 where 则会优先执行 where
    update?:boolean | CacheUpdateTrigger;
    // 是否首次执行更新 所谓首次格式为 此缓存刚被读取 如果指定 update 优先使用update
    first?:boolean;
    // 存储类型 如果设置的 缓存类型不支持 默认 将自动转为 `memory`
    storage?: CacheStorageType;
    // 过期时间 时间为ms 小于 0 或者不传入 会被认为 按照模式的生命周期
    // expire?: number;
    // 是否使用缓存 自定义 获取缓存前执行
    where?:boolean | CacheWhereTrigger;
    // 是否使用缓存 自定义 获取完成缓存后执行
    hasWhere?:(config:InstructionOption,result:CacheReturnResult)=> boolean;
    // 获取到缓存后的处理 返回值将作为新的数据返回出去
    handle?:(cache:CacheReturnResult)=> any;
    // 组id 可以通过组id进行删除多个缓存
    // groupId?:string,
    /*
    *   唯一id 和 组id不一样，此id仅会存储一个 如果id相同会相互替换 如果需要存储多个建议使用 groupId
    *   多个比如 请求不同的参数 也被认定为 多个
    *   使用id操作缓存 sign 会被自动映射
    * */
    // id?:string
}

export interface CacheReturnResult {
    // 是否为首次获取
    first:boolean,
    // 数据
    data:ResponseData
}


export type CachePluginOption = CacheStorageType | CacheOptionObject | boolean;
