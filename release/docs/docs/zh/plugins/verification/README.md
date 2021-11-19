# 校验
针对一些数据进行校验，通过则继续执行，不通过则停止执行

## 可被提示的类型
- `info` 普通提示
- `error` 错误提示
- `success` 成功提示
- `warning` 警告提示

## 提供的格式化方法
- `join` 数组join连接 可被配置 `string`
- `trim` 移除左右空格
```ts
[
    {
        beforeFormat:'join',
        format:{
            trigger:'join',
            option:'-'
        }
    },
    {
        beforeFormat:'join',
        format:{
            trigger:'join',
            option:1 // error
        }
    }
]
```

## 校验模式
``` ts 
{
    // 是否为空 不限于`string` 针对`string`不校验空格
    empty: string,
    // 校验手机号 仅校验1开头
    mobile: string,
    // 校验身份证号
    idcard: string,
    // 校验邮箱
    email: string,
    // 字符串，并校验空格 仅限`string`
    trim: string,
    // 是否为空 不限于`string` 针对`string`校验空格
    emptyTrim: string,
    // 长度对比
    length:{
        // 对比值，必须等于 此  value
        value:number,
        // 提示文本
        tip:string,
    },
    // 对等配置 注意 eq如果置顶 index ｜ key  如果此模式未被执行，将优先跳转 需要被对比的模式，校验完成后，再进行 eq对比
    eq:{
        // 提示文本
        tip:string,
        // 比对值 可以不写 通过  key ｜ index 来获取相应的对比
        value?:any,
        // 或者比对当前value中的任意值
        key?:string,
        // index
        index?:number,
        // 是否为绝对相等 默认 true
        absolutely?:boolean
    },
    // 或其他自定义 校验
    [propName]:any
}
```

## 校验数据
``` ts 
{
    // 导出key,不存在此exportKey 默认去取用 key
    exportKey?:string,
    // 默认key
    key?:string,
    // 默认使用值
    value?:any,
    // 如果存在此 将会采用 exportValue
    exportValue?:any,
    // 校验规则 不提供则不进行校验直接取值
    rules?:string | VerificationRulesArg, 
    // 校验后 格式化输出 允许同时格式化其他模块，但不建议这么做
    format?:VerificationFormat | VerificationPresetFormat | VerificationPresetFormatOption<VerificationPresetFormat>,
    // 校验前
    beforeFormat?:VerificationFormat | VerificationPresetFormat | VerificationPresetFormatOption<VerificationPresetFormat>
}
``` 
### `exportKey`
导出索引名称,如果不存在默认使用`key`

### `exportValue`
用于校验的值 如果不存在默认使用`value`

### `key`
导出索引名称

### `value`
用于校验的值

### `rules`
校验规则 不提供则不进行校验
#### 参数: `String` | `Object`
`String` 提示的内容 默认使用`empty`模式
<br />
`Object` [查看详情](/zh/plugins/verification/#校验模式)


### `beforeFormat`
校验前 针对文本的格式化输出
#### 参数: `String` | `Object` | `Function`
`String` 使用的格式化方式，可以是自定义的名称，也可以是插件提供的
<br />
`Object` 使用两个字段 `trigger`,`option` 分别为 使用的格式化方式 和 传入格式化的参数配置
<br />
`Function` 自定义处理 分别传入 `当前值`,`当前key`,`当前对象`,`当前收集的导出数据`

### `format`
校验前 针对文本的格式化输出
#### 参数: `String` | `Object` | `Function`
`String` 使用的格式化方式，可以是自定义的名称，也可以是插件提供的
<br />
`Object` 使用两个字段 `trigger`,`option` 分别为 使用的格式化方式 和 传入格式化的参数配置
<br />
`Function` 自定义处理 分别传入 `当前值`,`当前key`,`当前对象`,`当前收集的导出数据`



## 使用
#### 示例:
``` ts
import instructRequest,{VerificationPlugin} from './index';

const request = instructRequest.create({
    baseURL:'',
    message:{
        info:function(value){
            console.log(value);
        },
        success:function(){}
    }
});

VerificationPlugin.register(request,{
    // 自定义校验规则
    rules:{
        name:function(option){
            return option.value === 'Fighter'
        }
    },
    // 自定义格式化工具
    formats:{
        name:function(value,option=':'){
            return 'username'+option+value;
        }
    }
});

request.$request({
    data:[
        {
            key:'user',
            value:'Figter',
            rules:{
                'emptyTirm':'请输入名称',
                'name':'情输入正确的名称'
            },
            format:{
                trigger:'name',
                option:'->>>'
            }
        },
        {
            key:'password',
            value:'123456',
            plachoder:'请输入密码',
            rules:{
                'emptyTirm':'', // 如果为空默认查找 tipKey 定义的默认key
            }
        },
        {
            key:'confirmPassword',
            value:'12345',
            plachoder:'请输入确认密码',
            rules:{
                'emptyTirm':'',
                'eq':{
                    // 此 key 或者 index 都可以
                    key:'password',
                    index: 1,
                    tip:'两次密码不一致'
                }
            }
        },
        {
            key:'code',
            value:'123',
            plachoder:'请输入验证码',
            rules:{
                'emptyTirm':'',
                'eq':{
                    value:'123456',
                    tip:'验证码不正确'
                }
            }
        }
    ],
    verification:{
        useKey:'data',
        cache:(result)=>{
            console.log('cache',result);
        },
        complete:(result)=>{
            console.log(result);
        },
        merge:'data',
        tipKey:'plachoder'
    }
})
```
## 配置
#### 介绍:
``` ts
{
    // 执行模式 如果存在next 将失效
    mode?: 'default' | 'end',
    // 直接使用 已有字段
    useKey?:VerificationUseKey,
    // 是否提示 
    tip?: boolean | RequestMessageOption | ((result:VerificationResult)=> RequestMessageOption | boolean),
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
    // 如果校验提示结果为空 则默认去查找此字段作为提示 默认使用 placeholder
    tipKey?:string,
}
```

### `mode`
校验遇错模式
#### 参数: `default` | `end`
`default` 找到错误 ，自动退出
<br />
`end` 找到错误，继续执行，执行到达终点

<br />

### `useKey`
以请求中的哪个字段作为校验数据
#### 参数: `String` 
`String` 作为校验数据的key

<br />

### `tip`
是否提示错误消息
#### 参数: `Boolean` | `String` | `Function`
`Boolean` 是否提示 默认使用 `info`
<br />
`String` 可使用的提示类型[查看详情](/zh/plugins/verification/#可被提示的类型)
<br />
`Function` 返回提示类型 `Boolean` | `String` 传入参数 `校验结果集`

<br />

### `data`
校验数据，存在 `useKey` 优先使用 `useKey`
#### 参数: `Array` | `Object`
`Array` 校验数据 [查看详情](/zh/plugins/verification/#校验数据)
<br />
`Object` 校验数据 如果不存在 `key` 或 `exportKey` 则使用 对象的 key 作为导出 [查看详情](/zh/plugins/verification/#校验数据)

<br />

### `item`
单条数据校验
#### 参数: `Object`
`Object` 校验单条数据 [查看详情](/zh/plugins/verification/#校验数据)

<br />

### `next`
是否继续向下执行
#### 参数: `Function`
`Function` 监控执行，根据返回 `boolean` 来决定是否继续向下执行 提供参数 `校验结果集`,`当前校验数据对象`,`收集的数据`

<br />

### `cache`
发生校验错误导致结束
#### 参数: `Function`
`Function` 发生校验错误导致结束 提供参数 `校验结果集`

<br />

### `complete`
校验完成触发，操作完此函数后将会去执行 `merge` 合并结果
#### 参数: `Function`
`Function` 校验完成触发 `校验结果集`, 如果返回新的对象，将会被当作 最新的`收集数据`进行 `merge` 合并结果

<br />

### `merge`
合并结果集
#### 参数: `String` | `Array<String>` | `Function<Object>`
`String` 合并的字段
<br />
`Array<String>` 合并多个字段
<br />
`Function` 返回合并字段 和 合并结果

<br />

### `tipKey`
如果校验提示结果为空 则默认去查找此字段作为提示
#### 参数: `String`
`String` 如果校验提示结果为空 则默认去查找此字段作为提示 默认使用 `placeholder`

## 自定义规则(rule)
``` ts
import instructRequest,{VerificationPlugin} from 'instruct-request-axios';

const request = instructRequest.create({
    baseURL:'',
    message:{
        info:function(value){
            console.log(value);
        },
        success:function(){}
    }
});

VerificationPlugin.register(request,{
    // 自定义校验规则
    rules:{
        name:function(option){
            return option.value === 'Fighter'
        }
    }
});
```
自定义校验函数参数说明
<br />
第一个参数 `Object` 
```ts
{
    //校验配置
    option: T,
    //当下校验的数据
    item:VerificationItem,
    //上下文环境
    arg:VerificationTriggerArg,
    //使用的key
    key:string | number,
    //当下的值
    value:any
}
```
第二个参数 `Verification` 校验类

## 自定义格式化(format)
``` ts
import instructRequest,{VerificationPlugin} from 'instruct-request-axios';

const request = instructRequest.create({
    baseURL:'',
    message:{
        info:function(value){
            console.log(value);
        },
        success:function(){}
    }
});

VerificationPlugin.register(request,{
    // 自定义校验规则
    formats:{
        name:function(value,option=':'){
            return 'username'+option+value;
        }
    }
});
```
自定义格式化函数参数说明
<br />
第一个参数 `any` 当前使用的value
<br />
第二个参数 `Option` 自定义的配置

## 注册返回Verification类
`VerificationPlugin`调用`register`时将会返回 `Verification` 同时 提供 `createdData` 和 `createdItem` 来辅助自定义提示，仅对`typescript` 有效
``` ts
import instructRequest,{VerificationPlugin} from 'instruct-request-axios';

const request = instructRequest.create({
    baseURL:'',
    message:{
        info:function(value){
            console.log(value);
        },
        success:function(){}
    }
});

const verification = VerificationPlugin.register<{
    name:string
},{
    name:string
}>(request,{
    // 自定义校验规则
    rules:{
        name:function(option){
            return option.value === 'Fighter'
        }
    }
    // 自定义校验规则
    formats:{
        name:function(value,option=':'){
            return 'username'+option+value;
        }
    }
});

verification.createData([
    {
        format:'name',
        rules:{
            name:'1'
        }
    },
    {
        format:'name',
        rules:{
            name:1 // error: value must is string
        }
    },
])
```

## Verification类
``` ts
{
    // 创建 data 除了增加提示，无任何其他作用
    createdData(data:Array<VerificationItemTip<T,D>>):Array<VerificationItem>
    // 创建 item 除了增加提示，无任何其他作用
    createdItem(data:VerificationItemTip<T,D>):VerificationItem
    // 增加规则
    addRules<chilT>(rules:{[ key in keyof chilT]:VerificationTriggerFunction<chilT[key]>}):Verification<T,D>
    // 添加格式处理
    addFormats<chilD>(formats:{ [key in keyof chilD]:VerificationBuiltFormat<chilD[key]> }):Verification<T,D>
    // 获取某一个的校验结果
    verificationTriggerTarget<T extends keyof VerificationMode = 'default'>(supperKey:number |string,key:string,index:number,option:VerificationTriggerArg<T>):VerificationResult
    // 校验
    verification<T extends keyof VerificationMode = 'default'>(option:VerificationOption<T>):VerificationMode[T]
}
```

### `createdData`
创建 data 除了增加提示，无任何其他作用

### `createdItem`
创建 单条数据 除了增加提示，无任何其他作用

### `addRules`
增加规则处理

### `addFormats`
添加格式处理

### `verificationTriggerTarget`
获取某一个的校验结果,常规情况无法用到，做规则处理时，如果需要获取到`某一个校验` 可以使用,`eq` 便是使用此 完成的

### `verification`
校验数据，参数和 `verification`的配置一样 [查看详情](/zh/plugins/verification/#配置)

## 外界扩展
`Verification` 同样提供了针对外界的扩展模块，返回一个新的 `Verification` 类
``` ts
import instructRequest,{VerificationPlugin} from 'instruct-request-axios';

const request = instructRequest.create({
    baseURL:'',
    message:{
        info:function(value){
            console.log(value);
        },
        success:function(){}
    }
});

VerificationPlugin.register(request);

request.extend('verification')();
```
