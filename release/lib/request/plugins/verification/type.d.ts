import {
    VerificationClassOption,
    VerificationTriggerFunction,
    VerificationBuiltFormat,
    VerificationMode,
    VerificationResult,
    VerificationItem
} from './lib/type';

import Verification from './lib/verification';

import {AxiosRequestConfig} from 'axios';

import { RequestPlugin,RequestMessageOption } from '../../index';

import { OutsideRequestObject } from '../../type';

export interface VerificationExtendOption <T=Record<string,any>,D=Record<string,any>>{
    rules?:{[ key in keyof T]:VerificationTriggerFunction<T[key]>},
    formats?:{ [key in keyof D]:VerificationBuiltFormat<D[key]> },
}

export interface VerificationUseOption<T=Record<string,any>,D=Record<string,any>> extends VerificationExtendOption<T,D>{
    mode?: keyof VerificationMode,
    useKey?:VerificationUseKey,
    // 默认的提示key
    tipKey?:string,
    // 是否提示 false 为不提示 如果为 true 默认为 info
    tip?: boolean | RequestMessageOption,
    // 是否为激活校验, 如果不设置为激活校验，则仅有值时才校验
    activeVerification?:boolean,
}

export interface VerificationPlugin extends RequestPlugin<any,VerificationUseOption>{
    register:<T=Record<string,any>,D=Record<string,any>>(target:OutsideRequestObject,option?:VerificationUseOption<T,D>)=>Verification<T,D>
}

export type VerificationUseKey = keyof AxiosRequestConfig;

export interface VerificationOption<T extends keyof VerificationMode = keyof VerificationMode> extends VerificationClassOption<VerificationMode[T]>{
    // 执行模式 如果存在next 将失效
    mode?: T,
    // 直接使用 已有字段
    useKey?:VerificationUseKey,
    // 是否提示 
    tip?: boolean | RequestMessageOption | ((result:VerificationResult)=> RequestMessageOption | boolean)
}

export type VerificationPluginOption<T extends keyof VerificationMode = keyof VerificationMode> = VerificationUseKey | VerificationOption<T>;

// 向外界开放
export interface VerifictionRequestExtend {
    // 创建verificaion对象处理
    verification:<T=Record<string,any>,D=Record<string,any>>(options?:VerificationExtendOption<T,D>)=> Verification<T,D>,
}