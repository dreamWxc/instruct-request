
# cache(缓存插件)

## 用途:
用于缓存接口数据，针对不必要重复加载的数据，或者首次加载进行提升速度
<br />
应用场景：
- 信息属于展示类，首次出现的时候先应用缓存，同时请求接口，接口请求成功后再次执行接口请求完成逻辑并同时更新缓存，此带来的体验会好一些
- 缓存config等不常变的接口，设置 一周更新一次，用于降低一些不必要的请求，同时加快请求速度
- 缓存本页面的请求，当页面释放跟随页面释放缓存，参考 groupId
- 提交结果缓存，针对不同的参数会生成不同sign，如果校验失败，结果被缓存，再次点击将自动提取相应缓存，给用户，防止用户狂点请求，页面释放或者组件释放 一起释放掉 参考 groupId
<br />

<br />

## 常见问题
- 问: config变化了但是设置的时间还没有失效该怎么办
- 答: 建议配合后端设置缓存校验，首次启动的时候，获取完 config 和后端的缓存校验进行校验，查看是否需要修改，可能感觉此缓存还不如不加，或者 采用 过期时间为一天 或者 如果有则采用 sessionStorage 存储
- 答: 或者后台设置缓存统一管理，前端获取到相应清除记录进行匹配清除
    
<br />

## 配置
<br />

```
// 获取过期时间
interface StorageGetExpire<T=any> {
    (nowData:T | undefined,oldData:T | undefined,key:string):number
}

// 缓存的基本配置
interface StorageSetOption<T=any> {
    expire?:number | StorageGetExpire<T>,
    // 组id 可以通过组id进行删除多个缓存
    groupId?:string,
    /*
    *   唯一id 和 组id不一样，此id仅会存储一个 如果id相同会相互替换 如果需要存储多个建议使用 groupId
    *   多个比如 请求不同的参数 也被认定为 多个
    *   使用id操作缓存 sign 会被自动映射
    * */
    id?:string
}

// 是否进行缓存 默认继承 最高层配置
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

// 判断是否更新函数
interface CacheUpdateTrigger {
    (config:InstructionOption,result:CacheReturnResult):boolean
}

// 是否使用缓存函数
interface CacheWhereTrigger {
    (config:InstructionOption):boolean
}

// 缓存获取到的结果
interface CacheReturnResult {
    // 是否为首次获取
    first:boolean,
    // 数据
    data:ResponseData
}

// 采用的缓存类型
type CacheStorageType ='memory' | 'local' | 'session'

// 缓存配置对象
interface CacheOptionObject extends ResponseSuccess,StorageSetOption {
    // 是否更新，如果处于更新将会 继续去执行请求，并优先进行设置缓存 如果指定 where 则会优先执行 where
    update?:boolean | CacheUpdateTrigger;
    // 是否首次执行更新 所谓首次格式为 此缓存刚被读取 如果指定 update 优先使用update
    first?:boolean;
    // 存储类型 如果设置的 缓存类型不支持 默认 将自动转为 `memory`
    storage?: CacheStorageType;
    // 是否使用缓存 自定义 获取缓存前执行
    where?:boolean | CacheWhereTrigger;
    // 是否使用缓存 自定义 获取完成缓存后执行
    hasWhere?:(config:InstructionOption,result:CacheReturnResult)=> boolean;
    // 获取到缓存后的处理 返回值将作为新的数据返回出去
    handle?:(cache:CacheReturnResult)=> any;
}
```

<br />


### 使用

<br />

```
import instructRequest,{CachePlugin} from 'instruct-request-axios';

const request = instructRequest.create({
    // 默认的请求方式
    method:'POST',
    // 请求前缀
    baseURL:''
});

// 注册 cache配置插件
CachePlugin.register(request,{
    ...option
});
// 或者
request.$use(CachePlugin,{
    ...option
});

request.$request({
    // 请求地址
    url:'',
    // 提示指令
    cache: CacheStorageType | CacheOptionObject | boolean
}).then((data)=>{
    
});
```
<br />

### 缓存更新
```

// 数据获取
interface CacheExtendTrigger<T> {
    (localData:CacheExtendParams,globalData:CacheExtendParams):T
}

// 更新缓存回调参数
interface CacheUpdateTriggerParams<T=any> {
    sign:string,
    data:T,
    expire:number| StorageGetExpire<T>,
    groupId:string,
    id?:string
}

// 更新缓存回调
interface CacheUpdateTrigger<T=any> {
    (data:CacheUpdateTriggerParams<T>):T
}

interface CacheExtendReplaceTrigger <T extends keyof CacheExtendParams = keyof CacheExtendParams>{
    ( key:T,newValue:CacheExtendParams[T],oldValue:CacheExtendParams[T]):boolean
}

// 获取此缓存类型是否更新
interface CacheExtendWhereTrigger {
    (item:CacheStorageType):boolean
}

// 更新缓存类型
type CacheExtendWhere = Array<CacheStorageType> | CacheExtendWhereTrigger;

// 公共配置 （此配置常规不需要操作其他的缓存的暂时用不到）
interface CacheExtendParams<T=Record<string, any>>{
    // 被更新的data
    data?:CacheExtendTrigger<T> | T | any,
    // 如果不存在 data 则使用 此字段获取 差别主要是 参数差别
    dataTrigger?:CacheUpdateTrigger,
    // 缓存的配置
    option?:CacheOptionObject,
    // 如果不存在指定平台 默认 更新全部平台
    skip?:boolean,
    // 组id
    groupId?:string,
    // id
    id?:string,
    // 令牌
    sign?:string,
    // 是否替换配置
    replace?:boolean | CacheExtendReplaceTrigger,
    // 更新缓存类型
    where?:CacheExtendWhere
}

interface Cache {
    // 更新缓存
    update<T=Record<string, any>>(data?:CacheExtendParams<T>)
    // 更新组缓存
    updateGroup<T=Record<string, any>>(data?:CacheExtendParams<T>)
    // 更新全缓存类型
    updateAll<T=Record<string, any>>(data?:CacheExtendParams<T>)
    // 更新全缓存类型组
    updateAllGroup<T=Record<string, any>>(data?:CacheExtendParams<T>)
    // 删除缓存
    delete<T=Record<string, any>>(data?:CacheExtendParams<T>)
    // 删除组缓存
    deleteGroup<T=Record<string, any>>(data?:CacheExtendParams<T>)
    // 删除全缓存类型
    deleteAll<T=Record<string, any>>(data?:CacheExtendParams<T>)
    // 删除全缓存类型组
    deleteAllGroup<T=Record<string, any>>(data?:CacheExtendParams<T>)
}

request.$request({
    // 请求地址
    url:'',
    // 提示指令
    cache: CacheStorageType | CacheOptionObject | boolean
}).then((data)=>{
    data.msg = '更新缓存';
    // 获取缓存对象 并执行更新
    data.cache().update();
});

interface CacheExtend extends Cache {
    // 可以将配置链式化
    [key in keyof CacheExtendParams]: (CacheExtendParams[key]): CacheExtend
    // 回滚参数到上一次完成的配置参数
    rollBack: Function
}

// 请求外更新
request.extend('cache')(option?).update({
    id?:'',
    data:{},
    groupId?'',
    sign:''
}); 或者
request.extend('cache')(option?).id('').data({}).update();

```
