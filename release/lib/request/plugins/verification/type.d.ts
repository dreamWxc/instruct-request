import {
    VerificationClassOption,
    VerificationTriggerFunction,
    VerificationBuiltFormat,
    VerificationMode
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
    // 是否提示 默认为 false 如果为 true 默认为 info
    tip?: boolean | RequestMessageOption
}

export interface VerificationPlugin extends RequestPlugin<any,VerificationUseOption>{
    register:<T=Record<string,any>,D=Record<string,any>>(target:OutsideRequestObject,option?:VerificationUseOption<T,D>)=>Verification<T,D>
}

export type VerificationUseKey = keyof AxiosRequestConfig;

export interface VerificationOption<T extends keyof VerificationMode = 'default'> extends VerificationClassOption<VerificationMode[T]>{
    // 执行模式 如果存在next 将失效
    mode?: T,
    // 直接使用 已有字段
    useKey?:VerificationUseKey,
    // 是否提示 
    tip?: boolean | RequestMessageOption
}

export type VerificationPluginOption<T extends keyof VerificationMode = 'default'> = VerificationUseKey | VerificationOption<T>;

// 向外界开放
export interface VerifictionRequestExtend {
    // 创建verificaion对象处理
    verification:<T=Record<string,any>,D=Record<string,any>>(options?:VerificationExtendOption<T,D>)=> Verification<T,D>,
}