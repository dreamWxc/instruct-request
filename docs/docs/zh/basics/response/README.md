# 结果

## 结果增加字段
::: tip
数据结果上面会被扩展一些自定义字段
:::
#### 对象数据扩展:
``` ts
const responseData = {
    code:200,
    data:[],
    msg:'ok'
};
// 扩展的字段
responseData.__proto__ = {
    // 令牌，唯一值，多半用于插件
    __sgin:string,
    // 是否为成功根据 responseCode 来决定
    isSuccess:boolean
}
```
#### 其他数据扩展:
::: warning
针对非对象数据，将会扩展为对象 使用 data 字段存储
:::
``` ts
const responseData = '12313';
const transfResponseData = {
    data:responseData
};
// 扩展的字段
transfResponseData.__proto__ = {
    // 令牌，唯一值，多半用于插件
    __sgin:string,
    // 是否为成功根据 responseCode 来决定
    isSuccess:boolean
}
```
::: tip 其他结果扩展字段
其他扩展字段将根据使用插件来决定
:::