# Cache配置
## 基本配置

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

### `repeatNext`
如果请求值和缓存值一样是否还进行回调触发
#### 参数: `Boolean`
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

## Cache类配置

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