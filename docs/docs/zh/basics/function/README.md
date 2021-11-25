# 方法

## 创建请求对象
`create` 创建请求实例基本配置,配置基本参考 `axios`

## 请求实例

### `$request`
执行单个普通请求,配置参考`插件`和`axios`
``` ts
request.$request({
    url:'',
    ...option
}).then(()=>{}).catch(()=>{});
```

### `$upload`
上传文件请求,配置参考`插件`和`axios`
``` ts
request.$upload({
    url:'',
    ...option
}).then(()=>{}).catch(()=>{});
```

### `$all`
执行多个请求，同时共用一套基本配置,并执行各自的单独配置
``` ts
request.$all([
    request.$request({
    url:'',
    ...option
}),
request.$request({
    url:'',
    data:data.data,
    ...option
})],{
    ...option
}).then(()=>{}).catch(()=>{});
// 或者
request.$all((data)=>{
    return [
        request.$request({
            url:'',
            data:data.data,
            ...option
        }),
        request.$request({
            url:'',
            data:data.data,
            ...option
        })
    ]
},{
    url:'',
    data:{},
    ...option
}).then(()=>{}).catch(()=>{});
```