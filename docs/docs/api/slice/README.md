# Slice配置
## controller配置
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

## Slice类

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