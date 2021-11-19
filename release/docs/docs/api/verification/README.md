# Verification配置
## 基本配置

### `rules`
自定义校验规则[查看详情](/zh/plugins/verification/#自定义规则-rule)

### `formats`
自定义格式化函数 [查看详情](/zh/plugins/verification/#自定义格式化-format)

### `tip`
是否提示错误消息
#### 参数: `Boolean` | `String`
`Boolean` 是否提示 默认使用 `info`
<br />
`String` 可使用的提示类型[查看详情](/zh/plugins/verification/#可被提示的类型)


### `tipKey`
如果校验提示结果为空 则默认去查找此字段作为提示
#### 参数: `String`
`String` 如果校验提示结果为空 则默认去查找此字段作为提示 默认使用 `placeholder`

### `useKey`
以请求中的哪个字段作为校验数据
#### 参数: `String` 
`String` 作为校验数据的key

### `mode`
校验遇错模式
#### 参数: `default` | `end`
`default` 找到错误 ，自动退出
<br />
`end` 找到错误，继续执行，执行到达终点

<br />

## Verification类

### `createdData`
创建 data 除了增加提示，无任何其他作用

### `createdItem`
创建 单条数据 除了增加提示，无任何其他作用

### `addRules`
增加规则处理

### `addFormats`
添加格式处理

### `verificationTriggerTarget`
获取某一个的校验结果,常规情况无法用到，做规则处理时，如果需要获取到`某一个校验` 可以使用,`eq` 便是使用此 完成的

### `verification`
校验数据，参数和 `verification`的配置一样 [查看详情](/zh/plugins/verification/#配置)
