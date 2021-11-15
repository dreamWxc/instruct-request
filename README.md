
# instruct-request-axios(指令请求器)

<br />

## 注意:
cache 正常执行时间为 160ms
正常无任何指令的执行时间大概为 4ms
请注意如果您的项目对性能要求极高，请目前不要考虑此插件。
<br />
为什么慢:
<br />
- 采用加密解密(ASE,MD5)，针对数据缓存，唯一值sign令牌 采用了加密（此任务耗时最重）
- 有一些未经优化的判断，因为本插件，粗略的完善，针对校验空字段的时候多出了一些复杂判断多耗时1-3ms
- 配置项共享过重，插件兼容配置项逻辑（本身可能也不会消耗多少性能）
<br />
<br />
其他注意事项:
<br />
- 为了实现then多次触发自定义了一个模拟Promise简单行为的类导致目前没有去兼容await
<br />

## 思想:

让请求前后的处理操作公共化，通过自定义指令来检测需要执行的操作，已便将更多的精力放在逻辑处理中。 比如你想设置请求时携带用户的token 设置是通用且 重复的工作，如果说可以通过配置来完成设置岂不是省时方便，自己写一个 token指令追踪，通过token设置参数，全局或者 局部 来完成 触发规则，比如提示一个成功，提示一个失败，根据不同的code码提示或者根据msg提示，等等这些如果项目越大，写的地方就越多，那是多么恐怖的，后期会面临更换提示框的种种维护困境

<br />

<br />

## 自带捆绑配置
- rest boolean 是否展开 如果展开 直接显示接口返回数据 false 将展示axios默认的数据 默认 true
- message Object 提供的提示对象 info,success,error,warning,loading 回调函数格式 (content:string,duration?:number,onClose?:Function) duration 单位 ms
- responseCode 成功的状态码 如果出现此类状态码 将会被认为是成功的请求
- codeKey 校验的字段
- customCheck 自定义校验 是否为 成功的请求

<br />

## 提供插件
- cache 缓存用于缓存记录接口请求
- verification 用于校验给定格式的数据,通过定义的方式导出
- tip 用于提示接口的返回值，通过给定的 message 进行通知
## 示例

<br />

### javascript使用

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
    // 缓存配置指令
    cache: true | {
        storage:'local' | 'session' | 'memory',
        ...options
    }
}).then((data)=>{
    console.log(data.isSuccess,data.isCache,data.sgin,data.data);
});

```
<br />

### typescript使用

<br />

```
import instructRequest,{CachePlugin} from 'instruct-request-axios';

const request = instructRequest.create<{
    data:any,
    code:number,
    msg:string
},{
    ...指令的接口描述比如 会增加提示
    token:boolean
}>({
    // 默认的请求方式
    method:'POST',
    // 请求前缀
    baseURL:''
});

// 书写token插件
request.$use({
    install(target,option) {
        // 插入 前置 指令 更多细节请阅读开发指令 以及 RequestPlugin 配置
        target.push({
            name: 'token',
            trigger: (config) => {
                if(!config.requestData.data) config.requestData.data = {};
                config.requestData.data.token = '***'
            },
            type:'entry'
        });
    }
},{
    ...option
});

// 注册 cache配置插件
CachePlugin.register(request,{
    ...option
});
// 或者
request.$use(CachePlugin,{
    ...option
});

request.$request<{
    data:Array<{
        id:number,
        name:string
    }>,
    code:number,
    msg:string,
}>({
    // 请求地址
    url:'',
    // 缓存配置指令
    cache: true | {
        storage:'local' | 'session' | 'memory',
        ...options
    },
    // 刚定义的 token 配置 
    token: true
}).then((data)=>{
    console.log(data.isSuccess,data.isCache,data.sgin,data.data);
    console.log(data.code,data.msg,data.data);
});

```
<br />
