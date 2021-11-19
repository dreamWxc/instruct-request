# 配置

## axios
使用的axios 将会被初始导出
#### 使用说明:
``` ts
import {axios} from 'instruct-request-axios';
```

## 请求状态码
::: tip
配置状态码用于帮助请求器来断定是否为成功，部分插件只有成功时才会执行一些操作
:::
#### 全局配置:
``` ts
import InstructRequestAxios from 'instruct-request-axios';
// 创建实例
const request = InstructRequestAxios.create({
    responseCode:[200],
    codeKey:'code'
});
// 如此便会认为 responseCode.includes(response.data.code) 为成功的请求
```
#### 如果上方需求无法满足您的需求可以使用自定义:
``` ts
import InstructRequestAxios from 'instruct-request-axios';
// 创建实例
const request = InstructRequestAxios.create({
    responseCode:[200],
    customCheck:function(data,option){
        return option.responseCode.includes(data.data.autoKey); 
    }
});
// 如此便会根据校验的结果来断定
```
#### 局部配置:
``` ts
import InstructRequestAxios from 'instruct-request-axios';
// 创建实例
const request = InstructRequestAxios.create({
    responseCode:[200],
    codeKey:'code'
});
// 执行请求 如此局部将会替换全局的配置 自定义校验同理
request.$request({
    responseCode:[1],
    codeKey:'status'
});
```

## 数据是否展开
::: tip
默认axios的数据返回将是 一个 responseData 里面包含请求成功的 `status` `data` `headers` 等配置信息，默认我们最需要的便是 `data` 后台返回的内容
:::
### 配置字段 rest 默认为true
#### 不展开的数据格式:
``` ts
{
    status:200,
    headers:{},
    data:{
        code:200,
        msg:'成功',
        data:[]
    },
    ...option
}
```
#### 展开的数据格式:
``` ts
{
    code:200,
    msg:'成功',
    data:[]
}
```
## 弹窗配置
::: tip
弹窗配置用于请求的弹窗提示等工作，多用于插件
:::
#### 配置:
``` ts
import InstructRequestAxios from 'instruct-request-axios';
// 创建实例
const request = InstructRequestAxios.create({
    message:{
        // 正常提示
        info:function(content:string,duration?:number,onClose?:Function){

        },
        // 成功提示
        success:function(content:string,duration?:number,onClose?:Function){
            
        },
        // 错误的提示
        error:function(content:string,duration?:number,onClose?:Function){
            
        },
        // 警告的提示
        warning:function(content:string,duration?:number,onClose?:Function){
            
        },
        // 加载
        loading:function(content:string,duration?:number,onClose?:Function){
            
        },
        // 关闭以上的提示
        close:function(unqiue:any,type:string){

        },
        // 关闭所有
        closeAll:function(){

        },
        // 确认弹窗
        confirm:function(option:RequestMessageConfrim) {

        }
    }
});
// 确认消息弹窗配置
interface RequestMessageConfrim {
    // 标题
    title:string,
    // 内容
    content?:string,
    // 确认文本
    confirmText?:string,
    // 确认颜色
    confirmColor?:string,
    // 确认类型
    confirmType?:string,
    // 取消文本
    cancelText?:string,
    // 取消颜色
    cancelColor?:string,
    // 取消类型
    cancelType?:string,
    // 点击其他位置是否可以关闭
    maskClosable?:boolean,
    // 使用esc 是否可以关闭
    keyboard?:boolean,
    // 自定义按钮组
    buttonGroup?:Array<{
        button:string,
        trigger:Function,
        color?:string,
        type?:string
    }>,
    // 点击确认触发
    confirm?:<T>()=>void | Promise<T>,
    // 点击取消触发
    cancel?:<T>()=>void | Promise<T>,
}
```