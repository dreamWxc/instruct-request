import {RequestPluginInstructionObject,ResponsePluginExtendChain,RequestPluginExtend} from './plugins/export';

import {AxiosRequestConfig,AxiosError} from 'axios';

import { InstructionType } from '../instructions';

import Request from "./request";

import PromiseExtend from '../extend/ProsmiseExtend';

export interface ResponseSuccess {
    // 成功的状态码
    responseCode?:Array<any> | undefined,
    /* 注意：此配置仅针对 外层携带建议的标志符 的，如果服务器返回值过于复杂将不支持此配置 */
    // 访问数据内层进行评估的 key值
    codeKey?:string,
    /* 注意：此配置仅针对 外层携带建议的标志符 的，如果服务器返回值过于复杂将不支持此配置 */
    // 自定义校验
    customCheck?:(config:ResponseData,option:ResponseSuccess)=>boolean
}

export type RequestMessageOption = 
'info' |
'error' |
'success' |
'warning' |
'loading';

type RequestMessageObject = {

    [key in RequestMessageOption]?:(content:string,duraction:number,onClose?:Function)=>any;

}

interface RequestMessageConfrim {
    title:string,
    content?:string,
    confirmText?:string,
    confirmColor?:string,
    confirmType?:string,
    cancelText?:string,
    cancelColor?:string,
    cancelType?:string,
    maskClosable?:boolean,
    keyboard?:boolean,
    buttonGroup?:Array<{
        button:string,
        trigger:Function,
        color?:string,
        type?:string
    }>,
    confirm?:<T>()=>void | Promise<T>,
    cancel?:<T>()=>void | Promise<T>,
}

interface RequestMessageOtherObject {
    close?:(unique:any,type:RequestMessageOption | keyof RequestMessageOtherObject)=>any,
    closeAll?:()=>any;
    confirm?:(option:RequestMessageConfrim)=>any
}

interface RequestInstructionObject<T,I,D> extends ResponseSuccess{
    // 是否仅展开 data
    rest?:boolean,
    // message 提示模块 用于针对所有插件的提示工作
    message?:RequestMessageObject & RequestMessageOtherObject

}

type RequestInstruction<T,I,D> = RequestInstructionObject<T,I,D> & Record<string, any>;

interface RequestConfigInstruction<T=any,I=any,D=any> extends AxiosRequestConfig,RequestInstruction<T,I,D>,RequestPluginInstructionObject<T,I,D>{
    
}

type DefaultRequestConfigInstruction = RequestConfigInstruction<any,any,any>

export interface ResponseExtendChain extends ResponsePluginExtendChain{
    readonly __sign:string,
    isSuccess:boolean,
    __isObject?:boolean,
}

export interface RequestExtend extends RequestPluginExtend{}

export type RequestStatus =
    'loading'|
    'success'|
    'fail';

export type ResponseTypeStatus =
    'success'|
    'fail'|
    'none';

export interface ResponseData{
    data: any;
    status: number;
    statusText: string;
    headers: any;
    config: Record<string, any>;
    request?: any;
    response?:ResponseData
}

type UseResponseData = any | Record<string, any>;


export interface InstructionOption {
    // 请求参数配置
    requestData:DefaultRequestConfigInstruction,
    // 当前操作类型 (由系统传入)
    type?: InstructionType,
    // hash值 本次请求的创建的为你 16位 hash 值
    sign:string,
    // 退出 执行后不管后续有无操作皆终止
    exit:InstructionExit,
    // 状态 当前接口请求的状态配置
    status:RequestStatus,
    // 指令
    readonly introduces:DefaultRequestConfigInstruction,
    // 扩展字段用户个人定制处理
    extend?:Record<string, any>
}

export interface InstructionPostOption extends InstructionOption{
    // 返回的参数
    responseData:InstructionExitParams;
    // 最终使用的数据
    responseRestData:UseResponseData
    // 返回给用户使用的 data
    responseResultData:UseResponseData,
    // 扩展字段收容
    responseExtendChain:ResponseExtendChain
}

export type ExitTriggers = {
    [key in ResponseTypeStatus]?: Function
}

interface InstructionExitParams extends ResponseData{
    custom?:boolean,
    cancel?:boolean
}

export interface InstructionExit<T extends InstructionExitParams = InstructionExitParams> {
    // value 返回给外部的值 status 执行为成功或者失败
    (value:T,status:ResponseTypeStatus,end:boolean):void;
    // 执行回调
    triggers:ExitTriggers,
    // 状态
    next:boolean
}

interface RequestPluginRegister <T=any>{
    (target:OutsideRequestObject,option?:T):void;
}

export interface RequestPlugin<T=any,D=any> {
    // 安装
    install:RequestPluginInstall
    // 扩展名称
    extendName?:string;
    // 向外界开放的字段
    extend?:any,
    // 扩展配置项
    extendOption?:Record<string, any>,
    // 注册扩展字段
    registerExtend?:RequestPluginRegisterExtend<T,D>,
    // 自行注册
    register:RequestPluginRegister<D>,
    // 其他字段
    [propName:string]:any
}

export interface RequestPluginExtends {
    trigger:any,
    option?:Record<string, any>
}

interface RequestPluginInstall{
    (target: Request<RequestResponse,AxiosError<DefaultRequestConfigInstruction>>,option:Record<string, any>):void;
}

interface RequestPluginRegisterExtend<T = never,D=never> {
    (responseExtendChain:ResponseExtendChain,option?:T,resultOption?:D,config?:InstructionPostOption):void
}

export interface RequestResponse {
    data:Record<string, any> | Array<Record<string, any>> | number | string | boolean | any,
    code:number,
    msg:string,
    [propName:string]:any
}

export type ReuqestAgentTypeName = '$upload' | '$request';

export interface RequestAgentFunction<T,I,D>{
    (config:DefaultRequestConfigInstruction):PromiseExtend<T,D>
}

export interface OutsideRequestObject<T=RequestResponse,I = Record<string, any>,D=AxiosError<RequestConfigInstruction<T,I,AxiosError>>> {
    $use<T>(plugin:RequestPlugin,option?:T),
    $all<T0=T,T1=T,T2=T,T3=T,T4=T,T5=T,T6=T,T7=T>(data:Array<PromiseExtend<T0 | T1 | T2 | T3 | T4 | T5 | T6 | T7>> | ((config:DefaultRequestConfigInstruction)=> Array<PromiseExtend<T0 | T1 | T2 | T3 | T4 | T5 | T6 | T7>>),requestConfig?:I & RequestConfigInstruction<T,I,D>): PromiseExtend<Array<(T0 | T1 | T2 | T3 | T4 | T5 | T6 | T7) & ResponseExtendChain>,D>
    $request<childT=T,childD=D>(requestConfig:I & RequestConfigInstruction<childT,I,childD>): PromiseExtend<childT & ResponseExtendChain,childD>,
    $upload<childT=T,childD=D>(requestConfig:I & RequestConfigInstruction<childT,I,childD>): PromiseExtend<childT & ResponseExtendChain,childD>,
    extend<T extends keyof RequestExtend>(key:T):RequestExtend[T]
}