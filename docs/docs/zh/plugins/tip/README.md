# 提示
用于提示接口返回或者接口出错自定义的错误描述，让使用时无需关心一些提示的弹出

::: tip
支持`请求状态码`的配置，如果不设置将自动去使用全局
:::

## 可被提示的类型
- `info` 普通提示
- `error` 错误提示
- `success` 成功提示
- `warning` 警告提示

## 使用
#### 示例:
``` ts
import instructRequest,{TipPlugin} from 'instruct-request-axios';

const request = instructRequest.create({
    baseURL:'',
    message:{
        error:function(){},
        success:function(){},
        warring:function(){}
    }
});

TipPlugin.register(request);

request.$request({
    tip:true | {
        fail:true,
        failType:"error",
        tip:true,
        tipType:{
            success:"success",
            default:"warring"
        }
    }
}).then((data)=>{

});
```
## 配置
#### 介绍:
``` ts
{
    // 提示时长 ms
    duration?:number | ((status:boolean, codeType:keyof TipFailCodeMessage, tip:string, code:number |any,data:InstructionExitParams)=> number | void ),
    // 获取message
    messageKey?:string | ((data:InstructionExitParams,codeType:keyof TipFailCodeMessage,code:number | any)=>string),,
    // 是否提示 fail 默认为 true
    fail?:boolean | TipFailCodeMessage,
    // fail的提示类型
    failType?: RequestMessageOption | ((codeType:keyof TipFailCodeMessage,tip:string,code:number |any,data:InstructionExitParams)=> { type: RequestMessageOption,tip:string } | RequestMessageOption | void )
    // 是否提示 常规的 默认为 true
    tip?:boolean | TipSuccessCodeMessage,
    // 常规的提示类型 是否成功根据 responseCode
    tipType?: {success?:RequestMessageOption | false,default?:RequestMessageOption | false} | ((codeType:keyof TipSuccessCodeMessage,tip:string,code:number |any,data:ResponseData)=> { type: RequestMessageOption,tip:string } | RequestMessageOption | void ),
}
```

### `duration`
提示时长 `ms`
#### 参数: `Number` | `Function`
`number` 提示时长
<br />
`Function` 获取提示时长函数,分别传入 `是否成功` , `提示类型` , `提示文本` , `状态码` , `返回内容`

### `messageKey`
如何获取到默认的提示文本
#### 参数: `String` | `Function`
`String` 默认的提示文本的key
<br />
`Function` 获取默认的提示文本 分别传入 `返回内容`,`提示类型`,`状态码`

### `fail`
是否提示错误消息
#### 参数: `Boolean` | `Object`
`Boolean` 是否提示错误消息
<br />
`Object` 根据设置 `key` 使用 `code` 状态码进行匹配，同时增加了 `timeout` 和 `default` 两个key 来匹配 `请求超时` 和 `未匹配的提示`

#### 注意: `Obejct` 里面的 `key` : `value` 数据格式同 `messageKey` 一致 

<br />

### `failType`
提示的类型
#### 参数: `String` | `Function`
`String` 提示类型:`info` | `error` | `success` | `warning` 
<br />
`Function` 获取提示类型 分别传入 `提示类型`,`提示文本`,`状态码`,`返回内容`

<br />

### `tip`
是否提示消息
#### 参数: `Boolean` | `Object`
`Boolean` 是否提示消息
<br />
`Object` 根据设置 `key` 使用 `code` 状态码进行匹配，同时增加了 `success` 和 `default` 两个key 来匹配 `成功请求` 和 `未匹配的提示`

#### 注意: `Obejct` 里面的 `key` : `value` 数据格式同 `messageKey` 一致 

<br />

### `tipType`
提示的类型
#### 参数: `Obejct` | `Function`
`Object` 分为 `success` 成功的提示状态 和 `default` 失败的提示状态 提示类型:`info` | `error` | `success` | `warning` | `boolean:false` 
<br />
`Function` 获取提示类型 分别传入 `提示类型`,`提示文本`,`状态码`,`返回内容` 返回值 可以为 `info` | `error` | `success` | `warning` | `{type:'info' | 'error' | 'success' | 'warning',tip:string}` | `false` | `undefiend` `等类型` 

#### 注意: 如果返回不为真的数据，或者不被匹配的提示，将不会进行提示
