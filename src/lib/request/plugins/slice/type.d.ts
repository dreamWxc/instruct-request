import { 
    ResponseSuccess,
    RequestConfigInstruction,
    ResponseData,
    RequestResponse
} from '../../type';

import {
    CacheStorageType,
} from '../cache/type';

import {
    StorageSetOption
} from '../cache/control/control';
import { AxiosError } from 'axios';
import UploadContxt from './slice/uploadContxt';

export {
    CacheStorageType
}

import UploadExtend from './slice/uploadExtend';

export interface SliceRequestExtend {
    // 创建cache对象处理
    slice:(options?:RequestUploadCache)=> UploadExtend,
}

interface RequestTypeMode {
    requestMode?:'upload' | 'request'
}

export interface RequestUploadParams {
    index:number,
    total:number,
    file:Blob,
    size:number,
    hash:string,
    name:string,
    __analysis?:number,
    __merge?:number
}

interface RequestUploadFileSlice {
    // 是否使用分片
    slice?:{
        // 根据size进行分割切片
        size:number,
        // 唯一值生成 最终会进行 md5加密
        unique?:Array<keyof File> | ((file:File)=>string) | string
    }
}

export interface RequestContxtParams {
    // 成功的数量
    success:Record<string,number>,
    // 剩余将被执行的分片
    surplus:Array<number>,
    // 失败的分片
    fail?:Array<number>,
    // 正在执行的分片
    running?:Record<string,number>,
    // 是否使用 storage
    cache?:RequestUploadCache,
    // 是否暂停
    suspend?:boolean,
    // 总数
    total:number,
    // 名称
    name:string,
    // 唯一值
    unique:string,
    // 自定义存储信息
    storage?:Record<string,any>,
    // 分析文件是否纳入进度 (注意，纳入进度后)
    analysis?:number,
    // 合并是否纳入进度
    mergeAnalysis?:number,
    // 暂存内容
    storageContent?:Record<string,any>
}

export interface RequestUploadCache extends StorageSetOption{
    storage: CacheStorageType
}

export interface UploadExtendSpeedParams {

    // 名称
    name:string,
    // 唯一值
    unique:string,
    // 自定义存储信息
    storage?:Record<string,any>,
    // 上传分片数量
    loaded:number,
    // 总数
    total:number,
    // 实际分片数
    relayTotal: number,
    // 分析文件进度
    analysis: number,
    // 合并进度
    mergeAnalysis: number

}


export interface RequestUploadInstructionFile<T=RequestResponse,I=Record<string,any>,D=AxiosError> extends ResponseSuccess{
    // 名称
    name?:string,
    // 如果file存有记录 是否依照记录继续执行
    record?:boolean,
    // 自定义存储信息
    storage?:Record<string,any>,
    // 文件
    file?:Blob,
    // 分割大小
    splitSize?:number,
    // 控制器
    controller?:UploadContxt
    // 唯一值
    unique?:string,
    // 分析文件是否纳入进度 (注意，纳入进度后)
    analysis?:number,
    // 合并进程是否纳入进度统计
    mergeAnalysis?:number,
    // 使用模式
    mode?:'queue' | 'many' | 'all',
    // 是否使用 cache
    cache?:CacheStorageType | RequestUploadCache
    // 设置模式控制 ,多少个一起执行
    manyNumber?:number,
    // 合并，如果需要通知后台合并使用
    merge?:RequestConfigInstruction<T,I,D> & {
        // 使用data 获取的的字段
        replaceData?:{
            [key in string]: keyof RequestUploadParams
        }
    } & RequestTypeMode & I | ((response:ResponseData,params:RequestUploadParams)=> T & RequestConfigInstruction<T,I,D> & RequestTypeMode)
    // 使用data 获取的的字段
    replaceData?:{
        [key in string]: keyof RequestUploadParams
    }
}

export type SlicePluginOption<T = RequestResponse,I = Record<string,any>,D = AxiosError> = RequestUploadInstructionFile<T,I,D>;