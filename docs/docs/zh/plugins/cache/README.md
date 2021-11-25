# 缓存
用于针对接口数据的缓存，像一些基本信息，展示类，配置类信息进行提速展示，将一些不常变化的数据，根据存储类型，进行存储
::: tip
支持`请求状态码`的配置，如果不设置将自动去使用全局
:::

## 可被使用的存储类型
- `session` 对应 `sessionStorage` 用于类似session 如果活跃超过规定时间自动释放，如果处于活跃状态缓存一直存在
- `local`   对应 `localStorage`   本地长缓存
- `memory`  对应 `内存`            存储在内存中，如果页面被刷新，将会被清理掉

## 触发规则
请求时，如果存在缓存将直接执行并继续请求等待接口请求成功后再次执行，可以通过`repeatNext`配置`缓存数据`和`返回数据`一致时是否触发，默认是不触发
<br />
触发规则: `接口请求`->`查询缓存`->`如果存在则执行回调`->`如果存在update或first继续执行请求逻辑`->`设置缓存`->`请求成功,配置repeatNext为true直接触发回调 或 repeatNext为false对比，不想等便触发`

## 扩展结果字段
#### 介绍:
``` ts
{
    // 是否为缓存
    isCache:boolean;
    // 创建缓存对象 对当前的缓存进行修改，删除等操作
    cache:Function;
}
```


## 外界扩展
cache 向外开放了扩展，用于针对缓存的操作，虽然我们提供了针对请求结果的字段扩展，但这再繁杂的逻辑处理中还远远不够，`外界扩展` 和 `结果扩展`使用的 类是同一个，唯一不同的是 `扩展结果` 被定义好了参数，直接绑定了相关数据，更新时将会更加的简洁

``` ts
interface Cache {
    getData(data?:string | CacheExtendParams):ResponseData;
    getDataAll(data?:string | CacheExtendParams):Array<ResponseData>;
    getGroupData(data?:string | CacheExtendParams):Array<ResponseData>;
    getGroupDataAll(data?:string | CacheExtendParams):Array<ResponseData>;
    update<T=Record<string, any>>(data?:CacheExtendParams<T>):Cache
    updateGroup<T=Record<string, any>>(data?:CacheExtendParams<T>):Cache
    updateAll<T=Record<string, any>>(data?:CacheExtendParams<T>):Cache
    updateAllGroup<T=Record<string, any>>(data?:CacheExtendParams<T>):Cache
    delete<T=Record<string, any>>(data?:CacheExtendParams<T>):Cache
    deleteGroup<T=Record<string, any>>(data?:CacheExtendParams<T>):Cache
    deleteAll<T=Record<string, any>>(data?:CacheExtendParams<T>):Cache
    deleteAllGroup<T=Record<string, any>>(data?:CacheExtendParams<T>):Cache
    clear(storage:CacheStorageType):Cache
    clearAll(data?:CacheExtendParams):Cache
    rollBack():Cache,
    // 所有参数都可以被链式单独配置， 优先级 为 函数参数 -> 链式参数 -> 类初始化参数
    [key in keyof CacheExtendParams]:CacheExtendParams[key]
}

// 公共配置
interface CacheExtendParams<T=Record<string, any>>{
    data?:<T>(localData:CacheExtendParams,globalData:CacheExtendParams):T | T | any,
    dataTrigger?:<T>(data:{
        sign:string,
        data:T,
        expire:number| StorageGetExpire<T>,
        groupId:string,
        id?:string
    }):T,
    option?:CacheOptionObject,
    skip?:boolean,
    groupId?:string,
    id?:string,
    sign?:string,
    replace?:boolean | CacheExtendReplaceTrigger,
    where?:Array<'memory' | 'local' | 'session'> | CacheExtendWhereTrigger
}
```

### `getData`
获取某个平台缓存 如果为`string` 则为 `sign`

### `getDataAll`
获取所有平台此缓存 如果为`string` 则为 `sign`

### `getGroupData`
获取某平台组的缓存 如果为`string` 则为 `sign`

### `getGroupDataAll`
获取所有平台 组的缓存 如果为`string` 则为 `sign`

### `update`
更新缓存

### `updateGroup`
更新组缓存

### `updateAll`
更新平台缓存

### `updateAllGroup`
更新全平台缓存组

### `delete`
删除缓存

### `deleteGroup`
删除组缓存

### `deleteAll`
删除全平台缓存

### `deleteAllGroup`
删除全平台缓存组

### `clear`
清楚某平台缓存

### `clearAll`
清楚所有平台缓存

### `rollBack`
回滚 如果参数发生变化，可以通过此函数回滚到，上一次发生变化的时候，仅作为链式结尾有效

### `data`
更新的data数据

#### 参数: `any` | `Function`
`any` 则为直接被更新的数据
<br />
`Function` 通过函数获取 传入参数分别为 `当前配置` 和 `全局配置`

### `dataTrigger`
如果不存在 `data` 则使用 此字段获取 差别主要是`执行函数`参数差别

#### 参数: `Function`
`Function` 通过函数获取 传入参数为 `当前的基础配置`

### `option`
缓存的配置 一般从此处获取到更新 `平台` 同底部`配置`一致

#### 参数: `Object`
`Object` 参考 `cache` 配置

### `skip`
如果不存在指定平台 默认 更新全部平台

#### 参数: `Boolean`
`boolean` 是否更新全平台

### `groupId`
组id

#### 参数: `String`
`string` 组id

### `id`
唯一id

#### 参数: `String`
`string` 唯一id

### `sign`
令牌

#### 参数: `String`
`string` 令牌

### `replace`
是否替换配置,此配置优先于回滚

#### 参数: `Boolean` | `Function`
`Boolean` 是否替换配置
`Function` 参数分别为 `替换的key` 和 `新值` 和 `旧值`

### `where`
更新全平台的逻辑限制，比如可以通过指定 `['local','session']` 更新某些平台

#### 参数: `Array` | `Function`
`Array` 更新的平台列表
`Function` 是否更新此平台，作为 参数为 `平台类型` 返回 `Boolean`

#### 示例:
``` ts
import instructRequest,{CachePlugin} from 'instruct-request-axios';

const request = instructRequest.create({
    baseURL:''
});

CachePlugin.register(request,{
    storage:'session',
    first:true
});
request.$request({
    cache: {
        id:'name',
        groupId:'useName'
    }
})
request.$request({
    cache: {
        id:'name1',
        groupId:'useName'
    }
});

const cache = request.extend('cache')({
    ...option, // 初始化配置可不设置
});

// 更新name缓存
cache.id('name').data({
    data:'123',
    msg:'123',
    code:200
}).update();

// 更新组缓存
cache.groupId('useName').data({
    data:'123',
    msg:'123',
    code:200
}).updateGroup();

// 删除缓存
cache.id('name').data({
    data:'123',
    msg:'123',
    code:200
}).delete();

// 回滚配置介绍
cache.id('name').data({
    data:'123',
    msg:'123',
    code:200
});
// 以上配置会被记住 可以直接使用 update
cache.update();

// 什么时候用回滚，例如
cache.id('name').data({
    data:'123',
    msg:'123',
    code:200
});

cache.id('name1').data({
    data:'1235',
    msg:'1235',
    code:200
}).update().rollBack();

// 此时会更新 name 因为 定义配置之后，结尾使用 rollBack 将会回滚到上一次的配置
cache.update();
```


## 使用
#### 示例:
``` ts
import instructRequest,{CachePlugin} from 'instruct-request-axios';

const request = instructRequest.create({
    baseURL:''
});

CachePlugin.register(request,{
    storage:'session',
    first:true
});

request.$request({
    cache: 'memory' | 'local' | 'session' | {
        storage:'local',
        first:false
    }
}).then((data)=>{
    if(data.isCache) {
        // 修改数据
        data.msg = '更新缓存';
        data.data = [{use:1}];
        // 更新缓存
        data.cache().update();
        // 自定义数据更新缓存
        let useData = {
            status:0,
            data:123,
            msg:'123'
        }
        data.cache().update({
            data: useData
        });
        // 或者
        data.cache().data(useData).update();
        // 删除缓存
        data.cache().delete();

        // 也可以使用 扩展类
        cache.sign(data.__sign).data(data).update();
        // 可能你会发现 这两句话很像 其实 结果扩展 仅仅是将配置设置好了， 如此便可以直接更新
        data.cache().update();
        
    }
});

const cache = request.extend('cache')();
```

## 配置
#### 介绍:
``` ts
{
    update: boolean | (config:InstructionOption,result:CacheReturnResult):boolean,
    first:boolean,
    storage:'memory' | 'local' | 'session',
    where:boolean | (config:InstructionOption):boolean,
    hasWhere?:(config:InstructionOption,result:CacheReturnResult)=> boolean,
    handle?:(cache:CacheReturnResult)=> any,
    expire?:number | StorageGetExpire<T>,
    groupId?:string,
    id?:string,
    responseCode?:Array<any> | undefined,
    codeKey?:string,
    customCheck?:(config:ResponseData,option:ResponseSuccess)=>boolean
    repeatNext?:boolean
}
// 执行上下文
interface InstructionOption {
    // 请求参数配置
    requestData:RequestConfigInstruction,
    // 当前操作类型 (由系统传入)
    type?: InstructionType,
    // hash值 本次请求的创建的为你 16位 hash 值
    sign:string,
    // 状态 当前接口请求的状态配置
    status:RequestStatus
}
// 成功状态
interface ResponseSuccess {
    // 成功的状态码
    responseCode?:Array<any> | undefined,
    /* 注意：此配置仅针对 外层携带建议的标志符 的，如果服务器返回值过于复杂将不支持此配置 */
    // 访问数据内层进行评估的 key值
    codeKey?:string,
    /* 注意：此配置仅针对 外层携带建议的标志符 的，如果服务器返回值过于复杂将不支持此配置 */
    // 自定义校验
    customCheck?:(config:ResponseData,option:ResponseSuccess)=>boolean
}
// 缓存结果
interface CacheReturnResult {
    // 是否为首次获取
    first:boolean,
    // 数据
    data:ResponseData
}
```

### `update`
是否更新，如果更新将会 继续去执行请求，并进行读取缓存 如果指定 `where` 则会优先执行 `where`
#### 参数: `Boolean` | `Function`
`boolean` 很好理解，就是是否更新，`false` 将不会触发更新 `true` 将会触发更新
<br />
`Function` 则为提供函数，当进行判断是否更新时将会执行此函数,分别传入 `执行上下文` 和 `缓存结果`

### `first`
是否首次执行更新 所谓首次格式为 此缓存刚被首次读取 如果指定 `update` 优先使用 `update`，经常被用于首次进入更新缓存的操作
#### 参数: `Boolean`
<br />

### `storage`
存储类型 如果设置的 缓存类型不支持 默认 将自动转为 `memory`

#### 参数: `memory` | `local` | `session`
<br />

### `where`
是否使用缓存 自定义 获取缓存前执行

#### 参数: `Boolean` | `Function`

`boolean` 很好理解，就是是否使用，`false` 将不使用 `true` 将会使用
<br />
`Function` 则为提供函数，当进行判断是否使用时将会执行此函数,传入 `执行上下文` 进行判断

### `hasWhere`
是否使用缓存 自定义 获取完成缓存后执行,同 `where` 一个效果，仅是执行时机不同，并且为`Function` 时 将多一个`缓存结果`参数

### `handle`
获取到缓存后的处理 返回值将作为新的数据返回出去

#### 参数: `Function`
`Function`  提供函数处理获得到的缓存，并将结果返回

### `expire`
过期时间 单位为`ms` 小于 0 或者不传入 会被认为按照 `模式` 的 `生命周期`

#### 参数: `Number` | `Function`
`number` 则为距离当下多久过期 比如 `10 * 1000` 则为 `10s`
`Function` 通过函数获取 传入参数分别为 `将要存储data` 和 `被替换存储data` 和 `sign唯一令牌`

### `groupId`
`组id` 可以通过 `组id` 进行删除多个缓存,可以应用在多个请求，或者同一个请求，有多种不同的参数上

#### 参数: `String`

<br />

### `id`
`唯一id` 和 `组id`不一样，此`id`仅会存储一个 如果`id`相同会相互替换,且同一个请求多种不同的参数也被认为属于多个 如果需要存储多个建议使用 `groupId`

#### 参数: `String`

<br />

### `repeatNext`
如果请求值和缓存值一样是否还进行回调触发
#### 参数: `Boolean`
<br />