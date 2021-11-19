
# tip(提示插件)

## 用途:

用于提示接口返回或者接口出错自定义的错误描述，让使用时无需关心一些提示的弹出
<br />

<br />

## 配置
```
// 提示类型
export type RequestMessageOption = 'info' | 'error' |'success' | 'warning' |'loading';

// 提示的配置
export type TipMessage = {
    [propName in string | number]: string;
} & {
    // 默认提示
    default?: string;
};

// 错误提示配置
export interface TipFailCodeMessage extends TipMessage {
    // 超时提示
    timeout?:string
}

// 成功的提示配置
export interface TipSuccessCodeMessage extends TipMessage {
    // 成功的提示
    success?:string
}

// 全局通用配置 也可以为插件单独配置
interface ResponseSuccess {
    // 成功的状态码
    responseCode?:Array<any> | undefined,
    /* 注意：此配置仅针对 外层携带建议的标志符 的，如果服务器返回值过于复杂将不支持此配置 */
    // 访问数据内层进行评估的 key值
    codeKey?:string,
    /* 注意：此配置仅针对 外层携带建议的标志符 的，如果服务器返回值过于复杂将不支持此配置 */
    // 自定义校验
    customCheck?:(config:ResponseData)=>boolean
}

// 配置对象
interface TipOptionObject extends ResponseSuccess{
    // 提示时长 ms
    duration?:number | ((status:boolean, codeType:keyof TipFailCodeMessage, tip:string, code:number |any, data:InstructionExitParams)=> number | void ),
    // 获取message
    messageKey?:string | ((data:InstructionExitParams,codeType:keyof TipFailCodeMessage,code:number | any)=>string),
    // 是否提示 fail 默认为 true
    fail?:boolean | TipFailCodeMessage,
    // fail的提示类型
    failType?: RequestMessageOption | ((codeType:keyof TipFailCodeMessage,tip:string,code:number |any,data:InstructionExitParams)=> { type: RequestMessageOption,tip:string } | RequestMessageOption | void )
    // 是否提示 常规的 默认为 true
    tip?:boolean | TipSuccessCodeMessage,
    // 常规的提示类型 是否成功根据 responseCode
    tipType?: {success?:RequestMessageOption,default?:RequestMessageOption} | ((codeType:keyof TipSuccessCodeMessage,tip:string,code:number |any,data:ResponseData)=> { type: RequestMessageOption,tip:string } | RequestMessageOption | void ),
}
```

<br />


### 使用

<br />

```
import instructRequest,{TipPlugin} from 'instruct-request-axios';

const request = instructRequest.create({
    // 默认的请求方式
    method:'POST',
    // 请求前缀
    baseURL:''
});

// 注册 cache配置插件
TipPlugin.register(request,{
    ...option
});
// 或者
request.$use(TipPlugin,{
    ...option
});

request.$request({
    // 请求地址
    url:'',
    // 提示指令
    tip: boolean | TipOptionObject
}).then((data)=>{
    
});
```
<br />
