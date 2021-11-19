# 入门

## 引入模块
#### 示例：
``` js
import InstructRequestAxios from 'instruct-request-axios';
// 创建实例, @params option 参考 基础配置
const request = InstructRequestAxios.create({
    ...option
});
// 使用请求
request.$request({
    ...option
}).then(()=>{}).catch(()=>{});
```
## 使用插件
#### 示例：
``` js
import InstructRequestAxios,{ CachePlugin } from 'instruct-request-axios';
// 创建实例, @params option 参考 基础配置
const request = InstructRequestAxios.create({
    ...option
});
// 注册插件
CachePlugin.register(request,{...option})
/* 
   或者(唯一不同的即使提示的问题，插件本身的注册，可以提供良好的提示)
   而request.$use 则不能，因为它是针对多插件的，无法具体得知应该提示什么
*/
request.$use({...option});
// 使用请求
request.$request({
    ...option
}).then(()=>{}).catch(()=>{});
// 上传图片
request.$upload({
    ...option
}).then(()=>{}).catch(()=>{});
```

## 自定义插件
#### 示例：
``` js
import InstructRequestAxios from 'instruct-request-axios';
// 创建实例, @params option 参考 基础配置
const request = InstructRequestAxios.create({
    ...option
});
request.$use({
    // 被初始化加载时触发
    install(target,config){
        target.push({
            // 扩展的名称 允许重名定义
            name:'',
            // 触发 @param request 本次请求的上下文环境
            trigger:function(request){},
            // 什么样会触发，默认 has ，has代表指定配置才能被搜索到 skip 代表，有无配置皆可以搜索到
            triggerType:'has' | 'skip',
            // 被搜索到可不可以被触发
            where:function(data){
                return true | false;
            },
            // 生命周期，再生命周期的什么时候
            /*
                'entry' 进入时，此时未进行生成 sign 令牌，一般多用于初始化参数，比如设置用户token ，修改请求头等
                'front' 请求前 此时生成sign 令牌，后续再添加的参数将不会被统计到sign中，此处多用于开启一些请求前的操作
                'post'  结束时 
                'success' 成功时
                'fail'  失败时
            */
            type:'front',
            // 执行顺序 默认0 ,建议 最大 100 至 -100，模块自身插件，皆遵守于此 ，值越大执行越靠前，值越小执行越靠后
            zIndex:1
        })
    },
    register(target,option){
        return target.$use(option)
    },
    // 更多配置参考自定义插件
    ...option
});
```
## 使用插件扩展
#### 示例:
``` js
import InstructRequestAxios,{ CachePlugin } from 'instruct-request-axios';
// 创建实例, @params option 参考 基础配置
const request = InstructRequestAxios.create({
    ...option
});
// 注册插件
CachePlugin.register(request,{...option});
// 获取扩展
const cache = request.extend('cache')([option]);
// 可以使用 此插件的扩展功能(例如)
request({
    ...option,
    cache:{
        groupId:'now'
    }
});
// 执行删除缓存操作 更多请看关于插件文档
cache.groupId('now').delete();
```