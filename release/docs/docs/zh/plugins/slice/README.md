# 分片传输
项目中或许会存在 `大文件` 上传，单纯的依靠`文件直传`的效率是不高的，且可能出现用户传输中断等问题，为了解决此些问题，提供了此插件用来辅助`$upload`上传，
::: warning
此插件根据浏览器支持`html5`息息相关,里面使用`Blob`,`FileReader`类,如果浏览器不支持此两个类，此插件将默认 仅用一个`分片传输`如果希望不被支持时使用其他模式可以通过 `support` 或者 `supportURL` 来定义不支持时的请求链接
:::

## 请求状态码
兼容了外界的请求状态码的配置,如果不定义则使用外部的请求配置[查看详情](/zh/basics/request/#请求状态码)

## 分片模式
- queue 队列一个一个的传输
- many  多个一起传输
- all   全部一起传输

## 存储(cache)
针对上传过程，可以使用 cache存储,配置参考 [Cache插件](/zh/plugins/cache/),通过对比 `unique` 文件唯一值 来确定是否属于同一文件，并进行采用相应的缓存查看传输进度，从上一次的传输进度继续上传,使用`record`来生声明是否存储记录,或者设置`cache`为空

## 控制器(controller)
通过开放接口创建 controller 用于控制 上传的 暂停和取消,一个控制器可以被多次使用,不能绑定多个请求器,本身作为单独`上下文环境`存在

## 合并(merge)
部分分片传输，针对合并采用单独的接口，此模式作为补偿合并，指定此配置最终的成功回调将以此为主

## 替换参数(replaceData)
因为分片会生成很多的参数配置，需要传输到后端,用于配置相应的命名,(提供的参数如下)
``` ts
{
    index:number,
    total:number,
    file:Blob,
    size:number,
    hash:string,
    name:string,
}
```

## 分片大小(splitSize)
设置以多大分一片单位(byte)


## 自定义存储信息(storage)
因为提供了缓存，并且扩展提供了获取缓存，可以通过此配置来设置自定义存储的信息，来保证逻辑的执行

## 使用
#### 示例:
``` ts
import instructRequest,{SlicePlugin} from './index';

const request = instructRequest.create({
    baseURL:''
});

SlicePlugin.register(request);

const sliceExtend = request.extend('slice')();

document.getElementsByTagName('input')[0].onchange = function(){
    const controller = sliceExtend.createdController();
    request.$upload({
        url:'/file/upload',
        file:{
           file: this.files[0],
           analysis:10,
           controller,
           mergeAnalysis:10,
           mode:'many',
           manyNumber:5,
           merge:{
               url:'/file/merge_chunks'
           },
           cache:'local'
        },
        onUploadProgress:function(progress){
            console.log(Math.round(progress.loaded / progress.total * 100) + '%';);
        }
    }).then((response)=>{
        console.log(response);
    }).catch((response)=>{
        console.log(response);
    })
}
```

## 配置
#### 介绍:
``` ts
interface RequestUploadInstructionFile<T=RequestResponse,I=Record<string,any>,D=AxiosError> extends ResponseSuccess{
    // 名称
    name?:string,
    // 如果不支持提交的地址
    supportURL?:string,
    // 如果不支持 回调
    support?: (requestData:RequestConfigInstruction<T,I,D>)=> void
    // 如果file存有记录 是否依照记录继续执行
    record?:boolean,
    // 自定义存储信息
    storage?:Record<string,any>,
    // 文件
    file?:Blob,
    // 分割大小
    splitSize?:number,
    // 控制器
    controller?:UploadContxt
    // 唯一值
    unique?:string,
    // 分析文件是否纳入进度 (注意，纳入进度后)
    analysis?:number,
    // 合并进程是否纳入进度统计
    mergeAnalysis?:number,
    // 使用模式
    mode?:'queue' | 'many' | 'all',
    // 是否使用 cache
    cache?:CacheStorageType | RequestUploadCache
    // 设置模式控制 ,多少个一起执行
    manyNumber?:number,
    // 合并，如果需要通知后台合并使用
    merge?:RequestConfigInstruction<T,I,D> & {
        // 使用data 获取的的字段
        replaceData?:{
            [key in string]: keyof RequestUploadParams
        }
    } & RequestTypeMode & I | ((response:ResponseData,params:RequestUploadParams)=> T & RequestConfigInstruction<T,I,D> & RequestTypeMode)
    // 使用data 获取的的字段
    replaceData?:{
        [key in string]: keyof RequestUploadParams
    }
}
```

### `name`
名称,如果不提供文件名称
#### 参数: `String`

<br />

### `supportURL`
如果浏览器不支持分片,本身针对不支持分片的浏览器有特殊逻辑可以使用此 配置提交的`URL`
::: warning
即使浏览器不支持分片,正常的分片提交逻辑仍然可以用,只是不能将文件做成分片,后端接收并不会受到影响,正常功能一样用,提供此Api仅是为了针对特殊逻辑
:::
#### 参数: `String`

<br />

### `support`
如果浏览器不支持分片,本身针对不支持分片的浏览器有特殊逻辑,此Api用于补充 `supportURL` 的不足,用户可以修改请求配置,如果同时指定 `supportURL`,`supportURL`的优先级是最高的
#### 参数: `Function`
`Function` 传入参数 `当前的请求配置`

<br />

### `record`
如果file存有记录 是否依照记录继续执行
#### 参数: `Boolean`
<br />

### `storage`
自定义存储信息
#### 参数: `Object`

<br />

### `file`
上传的文件
#### 参数: `Blob`

<br />

### `splitSize`
分片大小(byte)
#### 参数: `Number`

<br />

### `controller`
通过开放接口创建 controller 用于控制 上传的 暂停和取消,一个控制器可以被多次使用,不能绑定多个请求器,本身作为单独`上下文环境`存在
#### 参数: `UploadContxt`

<br />

### `unique`
唯一值，默认不传将通过 `SparkMD5` 加密文件得到,缓存等全部依赖于此配置,非必要不建议自定义
#### 参数: `String`

<br />

### `analysis`
分析文件是否纳入进度,如果不提供`uniqe` 将会存在一些时间 加密文件得到 唯一值,此时间段是否需要进度显示
#### 参数: `Number(0-100)`

<br />

### `mergeAnalysis`
合并进程是否纳入进度统计,如果提供`merge` 将会存在一些时间 进行合并文件,此时间段是否需要进度显示
#### 参数: `Number(0-100)`

### `mode`
提交模式[查看详情](/zh/plugins/slice/#分片模式)
#### 参数 `queue` | `many` | `all`

### `cache`
针对上传过程，可以使用 cache存储,配置参考 [Cache插件](/zh/plugins/cache/),通过对比 `unique` 文件唯一值 来确定是否属于同一文件，并进行采用相应的缓存查看传输进度，从上一次的传输进度继续上传,使用`record`来生声明是否存储记录,或者设置`cache`为空

### `manyNumber`
模式为`many`有效 ,多少个一起执行
#### 参数 `Number`

### `merge`
合并接口 同时 可以支持 配置 `requestMode` 来配置使用哪种请求 `request` | `upload`
#### 参数 `Object` | `Function`
`Object` 请求配置 最终将会合并 `replaceData`
<br />
`Function` 通过函数设置请求配置 传入 `当前请求配置` 和 `当前生成的分片配置` 返回一个新的请求对象

### `replaceData`
因为分片会生成很多的参数配置，需要传输到后端,用于配置相应的命名 [查看详情](/zh/plugins/slice/#替换参数-replacedata)

## 控制器(controller)
``` ts 
{
    // 获取请求的 cancelToken
    getCancelToekn():CancelToken;
    // 取消本次请求
    cancel(message?:string,remove=true):void;
    // 暂停
    pause():void;
    // 播放
    play():void;
}
```
### `getCancelToekn`
获取请求的 cancelToken,用于绑定取消请求, 如果需要和上传文件同时取消可以使用此函数配置

### `cancel`
取消所有绑定`CancelToekn`的请求，上传文件都会被绑定
#### 参数 (message:string,remove:boolean)
message: 取消的介绍文本，将会作为失败的 `statusText`
<br />
remove: 是否删除传输缓存

### `pause`
暂停本次请求,如果处于合并状态，无法暂停

### `play`
继续上传本次请求


## 扩展
因为存在缓存操作，所以提供了缓存的扩展,并且提供了 创建 controller

``` ts
// storage 存储类型
// option  存储的对象配置
{
    // 构造函数 传入配置
    constructor(option?:RequestUploadCache):this;
    // 创建 controller
    createdController():UploadContxt;
    // 获取所有缓存 
    getCaches(storage?:CacheStorageType):Array<UploadExtendSpeedParams>
    // 获取所有缓存 Promise
    getCachesPromise(storage?:CacheStorageType):Promise<Array<UploadExtendSpeedParams>>
    // 获取组
    getCacheGroup(option?:RequestUploadCache):Array<UploadExtendSpeedParams>
    // 获取所有缓存 Promise
    getCachesGroupPromise(option?:RequestUploadCache):Promise<Array<UploadExtendSpeedParams>>
}
// 导出配置
/* 已上传分片进度分析 loaded - analysis */
interface UploadExtendSpeedParams {
    // 名称
    name:string,
    // 唯一值
    unique:string,
    // 自定义存储信息
    storage?:Record<string,any>,
    // 上传分片数量
    loaded:number,
    // 总数
    total:number,
    // 实际分片数
    relayTotal: number,
    // 分析文件进度
    analysis: number,
    // 合并进度
    mergeAnalysis: number
}
```

### `createdController`
创建上下文环境

### `getCaches`
获取所有缓存

### `getCachesPromise`
获取所有缓存(Promise)

### `getCacheGroup`
获取组缓存

### `getCachesGroupPromise`
获取组缓存(Promise)

### 其他
继承了Cache类,支持Cache类的方法，不过无权限进行`update`修改 只能`删除`和`查看` [查看详情](/zh/plugins/cache/#外界扩展)
