import { RequestMessageOption,ResponseData,ResponseSuccess,InstructionExitParams } from '../../type';


export type TipMessage = {
    [propName in string | number]: string | TipGetMessage;
} & {
    // 默认提示
    default?: string | TipGetMessage;
};
/*
    使用规则 propName > timeout > default
*/
export interface TipFailCodeMessage extends TipMessage {
    // 超时提示
    timeout?:string | TipGetMessage
}
/*
    使用规则 propName > success > default
*/
export interface TipSuccessCodeMessage extends TipMessage {
    // 成功的提示
    success?:string | TipGetMessage
}
 
export interface TipGetMessage {
    (data:InstructionExitParams,codeType:keyof TipFailCodeMessage,code:number | any):string
}

export interface TipOptionObject extends ResponseSuccess{
    // 提示时长 ms
    duration?:number | ((status:boolean, codeType:keyof TipFailCodeMessage, tip:string, code:number |any, data:InstructionExitParams)=> number | void ),
    // 获取message
    messageKey?:string | TipGetMessage,
    // 是否提示 fail 默认为 true
    fail?:boolean | TipFailCodeMessage,
    // fail的提示类型
    failType?: RequestMessageOption | ((codeType:keyof TipFailCodeMessage,tip:string,code:number |any,data:InstructionExitParams)=> { type: RequestMessageOption,tip:string } | RequestMessageOption | void )
    // 是否提示 常规的 默认为 true
    tip?:boolean | TipSuccessCodeMessage,
    // 常规的提示类型 是否成功根据 responseCode
    tipType?: {success?:RequestMessageOption | false,default?:RequestMessageOption | false} | ((codeType:keyof TipSuccessCodeMessage,tip:string,code:number |any,data:ResponseData)=> { type: RequestMessageOption,tip:string } | RequestMessageOption | void | any ),
}

export type TipPluginOption = boolean | TipOptionObject;
