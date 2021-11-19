import { RequestResponse } from '../type';
import { AxiosError } from 'axios';
import {CachePluginOption,CacheOptionObject,CacheResponseExtend,CacheRequestExtend,CachePlugin} from './cache';
import { VerificationPluginOption,VerificationOption,VerifictionRequestExtend,VerificationPlugin } from './verification';
import { TipPluginOption,TipOptionObject,TipPlugin } from './tip';
import { SlicePlugin,RequestUploadInstructionFile,SliceRequestExtend } from './slice';

// 插件指令配置
export interface RequestPluginInstructionObject<T=RequestResponse,I=Record<string,any>,D =AxiosError>{
    // 缓存配置
    cache?:CachePluginOption,
    // 校验配置
    verification?:VerificationPluginOption,
    // 提示
    tip?:TipPluginOption,
    // 分片传输
    file?:RequestUploadInstructionFile<T,I,D>
}

export type ResponsePluginExtendChain = CacheResponseExtend;

export type RequestPluginExtend = CacheRequestExtend & VerifictionRequestExtend & SliceRequestExtend;


export {
    CachePlugin,
    VerificationPlugin,
    TipPlugin,
    SlicePlugin
}

export {
    CacheOptionObject,
    CachePluginOption,
    VerificationPluginOption,
    VerificationOption,
    RequestUploadInstructionFile,
    TipPluginOption,
    TipOptionObject
}