# 配置
## 基本配置
### rest
数据是否展开,默认axios的数据返回将是 一个 responseData 里面包含请求成功的 `status` `data` `headers` 等配置信息，默认我们最需要的便是 `data` 后台返回的内容 [查看详情](/zh/basics/request/#数据是否展开)
#### 参数: `Boolean`
::: details 示例展示
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
:::
### message
弹窗配置用于请求的弹窗提示等工作，多用于插件 [查看详情](/zh/basics/request/#弹窗配置)
#### 参数: `Object`

<br />

### responseCode
成功的状态码,配置后台返回的状态,配合`codeKey`使用 [查看详情](/zh/basics/request/#请求状态码)
#### 参数: `Array<number>`

<br />

### codeKey
校验后台返回的状态字段,配合`responseCode`使用 [查看详情](/zh/basics/request/#请求状态码)
#### 参数: `String`

<br />

### customCheck
以上不符合需求，自定义设置校验 [查看详情](/zh/basics/request/#请求状态码)
#### 参数: `Function`

<br />

### axios配置
因为使用了axios作为请求底层，支持axios的所有配置 [查看详情](http://www.axios-js.com/zh-cn/docs/index.html#%E8%AF%B7%E6%B1%82%E9%85%8D%E7%BD%AE)
#### 参数: `Object`