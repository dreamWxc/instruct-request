import {
    VerificationOption
} from '../type';

import Verification from './verification';

import {AxiosRequestConfig} from 'axios';

type VerificationStringRules =
    'empty' |
    'mobile'|
    'idcard' |
    'email'|
    'trim' |
    'emptyTrim'

interface VerificationRules {

    length?:{
        // 不超过多少value
        value:number,
        // 提示文本
        tip:string,
    }

    // 对等配置 注意 eq如果置顶 index ｜ key  如果此模式未被执行，将优先跳转 需要被对比的模式，校验完成后，再进行 eq对比
    eq?:{
        // 提示文本
        tip:string,
        // 比对值
        value?:any,
        // 或者比对当前value中的任意值
        key?:string,
        // index
        index?:number,
        // 是否为绝对相等 默认 true
        absolutely?:boolean
    }
}

type VerificationRulesStringObject = {
    [key in VerificationStringRules]?: string
}

type VerificationRulesArg = VerificationRulesStringObject & VerificationRules | Record<string,any>;

export interface VerificationTriggerFunction<T> {
    (option:{
        option: T,
        item:VerificationItem,
        arg:VerificationTriggerArg,
        key:string | number,
        value:any
    },target:Verification):boolean
}

export type VerificationTrigger = {
    [key in keyof VerificationRulesArg]?:VerificationTriggerFunction<VerificationRulesArg[key]>
}

export type VerificationStringRulesKeys = keyof VerificationRulesArg;

interface VerificationResult<T=any> {
    // 校验结果
    verification?:boolean,
    // 提示 校验结果为false时才存在
    tip?:string,
    // 校验的key 校验结果为false时才存在
    ruleKey?:keyof VerificationRulesArg,
    // 结果，当校验成功会存在此字段
    value?:T,
    // 结果，当校验成功会存在此字段
    key?:string,
    // 当前校验的item 如果为全部结果集，则没有
    item:VerificationItem
}

interface VerificationEndResult extends VerificationResult {
    value?:Record<string,any> | any
}

interface VerificationEndMayResult extends VerificationResult {
    result?:Array<VerificationEndResult>
}

interface VerificationFormat <T=any>{
    (value:T,key:string,option:VerificationItem,data:Record<string, any>):T
}

export interface VerificationBuiltFormat <T>{
    (value:any,option:T):any
}

export interface VerificationPresetFormatData {
    join:string,
    trim:void
}

// type VerificationPresetFormatData = 
// 'join'|
// 'trim';

export type VerificationPresetFormatTrigger = {
    [key in keyof VerificationPresetFormatData]:VerificationBuiltFormat<VerificationPresetFormatData[key]>
}

type VerificationPresetFormat = string & keyof VerificationPresetFormatTrigger;

export interface VerificationPresetFormatOption<T extends keyof VerificationPresetFormatData>{
    trigger:T | string,
    option: VerificationPresetFormatData[T] | any
}

interface VerificationItemField<T=any> {
    // 导出key,不存在此exportKey 默认去取用 key
    exportKey?:string,
    // 默认key
    key?:string,
    // 默认使用值
    value?:T,
    // 如果存在此key 将会采用 exportValue
    exportValue?:T,
    // 其他字段
    [propName:string]:any
}

interface VerificationItem<T=any> extends VerificationItemField<T>{
    // 校验规则 不提供则不进行校验直接取值
    rules?:string | VerificationRulesArg, 
    // 校验后 格式化输出 允许同时格式化其他模块，但不建议这么做
    format?:VerificationFormat | VerificationPresetFormat | VerificationPresetFormatOption<VerificationPresetFormat>,
    // 校验前
    beforeFormat?:VerificationFormat | VerificationPresetFormat | VerificationPresetFormatOption<VerificationPresetFormat>
}

export interface VerificationMode {
    /*
    *   默认执行模式 ，找到错误 ，自动退出
    * */
    default:VerificationEndResult,
    /*
    *   默认执行模式 找到错误，继续执行，执行到达终点
    * */
    end:VerificationEndMayResult
}

interface VerificationMerge {
    (data:Record<string,any>):Record<keyof AxiosRequestConfig,any>
}

export interface VerificationClassOption<T=VerificationResult,D extends VerificationItem = VerificationItem> {
    // 校验数据
    data?:Array<D> | Record<string, D>,

    // 校验数据单条
    item?: D,

    // 监控执行，根据返回 boolean 来决定是否继续向下执行
    next?:(result:VerificationResult,option:VerificationItem,data:Record<string, any>)=>boolean | void

    // 终点 发生校验错误
    cache?:(result:T)=>void

    // 结束函数，如果校验完成，将会自动去合并 data
    complete?:(result:T)=>T | void,

    // 合并字段 去合并 为Array 则全部都去合并 如果为function 根据返回的字段 和值 去 合并
    merge?:keyof AxiosRequestConfig | Array<keyof AxiosRequestConfig> | VerificationMerge,

    // 如果单纯的校验 不为空 rules指定 string '' 则默认去查找此字段作为提示 默认使用 placeholder
    tipKey?:string,
}

type key = number | string;

export interface VerificationTriggerArg<T extends keyof VerificationMode='default'> {
    data:Array<VerificationItem> | Record<string, VerificationItem>,
    // 循环的keys
    keys?:Array<string>,
    // 鉴定是否校验结果集
    hasResult:Record<number | string,string>,
    // 相对存储
    relativeResult: Record<string,number | string>,
    // 当前收容结果集
    resultValues:Record<string,any>,
    // 当前校验
    result:Record<number | string,VerificationTriggerRetrun>,
    // 存储失败的校验结果
    resultFail:Array<VerificationTriggerRetrun>
    // 排序
    resultOrder:Array<number | string>,
    // 相应的配置
    option: VerificationOption<T>,
    // 锁
    look:number | string,
    // 当前的index
    index:number
}



export interface VerificationTriggerRetrun {
    resultFails?:Array<VerificationResult>,
    result?: VerificationResult
}


type VerificationOutsideFormatOption<D> = {
    trigger:keyof D,
    option: D[keyof D]
}

type VerificationFormatParams<D> = VerificationPresetFormat 

// 提示
export interface VerificationItemTip<T=Record<string,any>,D=Record<string,any>> extends VerificationItemField{

    rules?:string | VerificationRulesArg & T,

    format?: VerificationFormat | VerificationPresetFormat | keyof D | VerificationOutsideFormatOption<D & VerificationPresetFormatData>,

    beforeFormat?:VerificationFormat | VerificationPresetFormat | keyof D | VerificationOutsideFormatOption<D & VerificationPresetFormatData>

}