// 扩展类用于开放给外界
import {CacheOptionObject, CacheStorageType} from "../type";

import {CacheUpdateTrigger} from '../control/control';

import CacheDataExtend from './cacheDataExtend';
import CacheExtend from './CacheExtend';


interface CacheExtendWhereTrigger {
    (item:CacheStorageType):boolean
}
type CacheExtendWhere = Array<CacheStorageType> | CacheExtendWhereTrigger;

export interface CacheExtendTrigger<T> {
    (localData:CacheExtendParams,globalData:CacheExtendParams):T
}

export interface CacheExtendParams<T=Record<string, any>>{
    data?:CacheExtendTrigger<T> | T | any,
    dataTrigger?:CacheUpdateTrigger,
    option?:CacheOptionObject,
    skip?:boolean,
    groupId?:string,
    id?:string,
    sign?:string,
    replace?:boolean | CacheExtendReplaceTrigger,
    where?:CacheExtendWhere
}

export type CacheUseRequestExtendClass = CacheExtend & CacheExtendClassParams & CacheDataExtend;

export type CacheUseResponseExtend = CacheDataExtend;

interface CacheExtendReplaceTrigger <T extends keyof CacheExtendParams = keyof CacheExtendParams>{
    ( key:T,newValue:CacheExtendParams[T],oldValue:CacheExtendParams[T]):boolean
}

export type CacheExtendClassParams = {
    [key in keyof CacheExtendParams]:(option:CacheExtendParams[key])=>CacheUseRequestExtendClass;
}

export interface CacheControlClass extends CacheExtendClassParams{

    // 加入回滚
    addRollBack:<T extends keyof CacheExtendParams = keyof CacheExtendParams>(key:T | null,value:CacheExtendParams[T] | CacheExtendParams)=>this;
    // 回滚到最近一次的参数设置
    rollBack:()=>this;
    // 获取兼容参数
    getParams:(data?:CacheExtendParams)=>CacheExtendParams;
    // 是否替换
    triggerReplace:(trigger:boolean | CacheExtendReplaceTrigger,data:CacheExtendParams)=>void;

}

/*
*   default 默认权限
*   noUpdate 禁止更新
*   superset 最高权限
* */
export type CacheRole = 'default' | 'superset' | 'noUpdate';


export interface CacheControlClass {

}

export interface CacheExtendClass {
    // 更新某一条数据
    update:<T=Record<string, any>>(option?:CacheExtendParams)=>CacheExtendClass;
    // 更新此条数据的所有存储类型
    updateAll:<T=Record<string, any>>(option?:CacheExtendParams)=>CacheExtendClass;
    // 更新一个组
    updateGroup:<T=Record<string, any>>(option?:CacheExtendParams)=>CacheExtendClass;
    // 更新此组 所有的存储类型
    updateAllGroup:<T=Record<string, any>>(option?:CacheExtendParams)=>CacheExtendClass;
}
