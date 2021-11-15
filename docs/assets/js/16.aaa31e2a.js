(window.webpackJsonp=window.webpackJsonp||[]).push([[16],{397:function(t,s,a){"use strict";a.r(s);var e=a(51),n=Object(e.a)({},(function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("h1",{attrs:{id:"提示"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#提示"}},[t._v("#")]),t._v(" 提示")]),t._v(" "),a("p",[t._v("用于提示接口返回或者接口出错自定义的错误描述，让使用时无需关心一些提示的弹出")]),t._v(" "),a("div",{staticClass:"custom-block tip"},[a("p",{staticClass:"custom-block-title"},[t._v("提示")]),t._v(" "),a("p",[t._v("支持"),a("code",[t._v("请求状态码")]),t._v("的配置，如果不设置将自动去使用全局")])]),t._v(" "),a("h2",{attrs:{id:"可被提示的类型"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#可被提示的类型"}},[t._v("#")]),t._v(" 可被提示的类型")]),t._v(" "),a("ul",[a("li",[a("code",[t._v("info")]),t._v(" 普通提示")]),t._v(" "),a("li",[a("code",[t._v("error")]),t._v(" 错误提示")]),t._v(" "),a("li",[a("code",[t._v("success")]),t._v(" 成功提示")]),t._v(" "),a("li",[a("code",[t._v("warning")]),t._v(" 警告提示")])]),t._v(" "),a("h2",{attrs:{id:"使用"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#使用"}},[t._v("#")]),t._v(" 使用")]),t._v(" "),a("h4",{attrs:{id:"示例"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#示例"}},[t._v("#")]),t._v(" 示例:")]),t._v(" "),a("div",{staticClass:"language-ts extra-class"},[a("pre",{pre:!0,attrs:{class:"language-ts"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" instructRequest"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("TipPlugin"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'instruct-request-axios'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" request "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" instructRequest"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("create")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    baseURL"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("''")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    message"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token function-variable function"}},[t._v("error")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("function")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token function-variable function"}},[t._v("success")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("function")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token function-variable function"}},[t._v("warring")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("function")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\nTipPlugin"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("register")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("request"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\nrequest"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("$request")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    tip"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),a("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("true")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("|")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        fail"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),a("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("true")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n        failType"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"error"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n        tip"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),a("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("true")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n        tipType"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n            success"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"success"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n            "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("default")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"warring"')]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("then")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("data"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),a("h2",{attrs:{id:"配置"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#配置"}},[t._v("#")]),t._v(" 配置")]),t._v(" "),a("h4",{attrs:{id:"介绍"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#介绍"}},[t._v("#")]),t._v(" 介绍:")]),t._v(" "),a("div",{staticClass:"language-ts extra-class"},[a("pre",{pre:!0,attrs:{class:"language-ts"}},[a("code",[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 提示时长 ms")]),t._v("\n    duration"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("?")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),a("span",{pre:!0,attrs:{class:"token builtin"}},[t._v("number")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("|")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("status"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),a("span",{pre:!0,attrs:{class:"token builtin"}},[t._v("boolean")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" codeType"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("keyof")]),t._v(" TipFailCodeMessage"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" tip"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),a("span",{pre:!0,attrs:{class:"token builtin"}},[t._v("string")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" code"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),a("span",{pre:!0,attrs:{class:"token builtin"}},[t._v("number")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("|")]),a("span",{pre:!0,attrs:{class:"token builtin"}},[t._v("any")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("data"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v("InstructionExitParams"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token builtin"}},[t._v("number")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("|")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("void")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 获取message")]),t._v("\n    messageKey"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("?")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),a("span",{pre:!0,attrs:{class:"token builtin"}},[t._v("string")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("|")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("data"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v("InstructionExitParams"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("codeType"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("keyof")]),t._v(" TipFailCodeMessage"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("code"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),a("span",{pre:!0,attrs:{class:"token builtin"}},[t._v("number")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("|")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token builtin"}},[t._v("any")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),a("span",{pre:!0,attrs:{class:"token builtin"}},[t._v("string")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 是否提示 fail 默认为 true")]),t._v("\n    fail"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("?")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),a("span",{pre:!0,attrs:{class:"token builtin"}},[t._v("boolean")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("|")]),t._v(" TipFailCodeMessage"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// fail的提示类型")]),t._v("\n    failType"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("?")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" RequestMessageOption "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("|")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("codeType"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("keyof")]),t._v(" TipFailCodeMessage"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("tip"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),a("span",{pre:!0,attrs:{class:"token builtin"}},[t._v("string")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("code"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),a("span",{pre:!0,attrs:{class:"token builtin"}},[t._v("number")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("|")]),a("span",{pre:!0,attrs:{class:"token builtin"}},[t._v("any")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("data"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v("InstructionExitParams"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" type"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" RequestMessageOption"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("tip"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),a("span",{pre:!0,attrs:{class:"token builtin"}},[t._v("string")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("|")]),t._v(" RequestMessageOption "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("|")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("void")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 是否提示 常规的 默认为 true")]),t._v("\n    tip"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("?")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),a("span",{pre:!0,attrs:{class:"token builtin"}},[t._v("boolean")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("|")]),t._v(" TipSuccessCodeMessage"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 常规的提示类型 是否成功根据 responseCode")]),t._v("\n    tipType"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("?")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("success"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("?")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v("RequestMessageOption "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("|")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("false")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("default")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("?")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v("RequestMessageOption "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("|")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("false")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("|")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("codeType"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("keyof")]),t._v(" TipSuccessCodeMessage"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("tip"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),a("span",{pre:!0,attrs:{class:"token builtin"}},[t._v("string")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("code"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),a("span",{pre:!0,attrs:{class:"token builtin"}},[t._v("number")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("|")]),a("span",{pre:!0,attrs:{class:"token builtin"}},[t._v("any")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("data"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v("ResponseData"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" type"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" RequestMessageOption"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("tip"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),a("span",{pre:!0,attrs:{class:"token builtin"}},[t._v("string")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("|")]),t._v(" RequestMessageOption "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("|")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("void")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),a("h3",{attrs:{id:"duration"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#duration"}},[t._v("#")]),t._v(" "),a("code",[t._v("duration")])]),t._v(" "),a("p",[t._v("提示时长 "),a("code",[t._v("ms")])]),t._v(" "),a("h4",{attrs:{id:"参数-number-function"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#参数-number-function"}},[t._v("#")]),t._v(" 参数: "),a("code",[t._v("Number")]),t._v(" | "),a("code",[t._v("Function")])]),t._v(" "),a("p",[a("code",[t._v("number")]),t._v(" 提示时长\n"),a("br"),t._v(" "),a("code",[t._v("Function")]),t._v(" 获取提示时长函数,分别传入 "),a("code",[t._v("是否成功")]),t._v(" , "),a("code",[t._v("提示类型")]),t._v(" , "),a("code",[t._v("提示文本")]),t._v(" , "),a("code",[t._v("状态码")]),t._v(" , "),a("code",[t._v("返回内容")])]),t._v(" "),a("h3",{attrs:{id:"messagekey"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#messagekey"}},[t._v("#")]),t._v(" "),a("code",[t._v("messageKey")])]),t._v(" "),a("p",[t._v("如何获取到默认的提示文本")]),t._v(" "),a("h4",{attrs:{id:"参数-string-function"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#参数-string-function"}},[t._v("#")]),t._v(" 参数: "),a("code",[t._v("String")]),t._v(" | "),a("code",[t._v("Function")])]),t._v(" "),a("p",[a("code",[t._v("String")]),t._v(" 默认的提示文本的key\n"),a("br"),t._v(" "),a("code",[t._v("Function")]),t._v(" 获取默认的提示文本 分别传入 "),a("code",[t._v("返回内容")]),t._v(","),a("code",[t._v("提示类型")]),t._v(","),a("code",[t._v("状态码")])]),t._v(" "),a("h3",{attrs:{id:"fail"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#fail"}},[t._v("#")]),t._v(" "),a("code",[t._v("fail")])]),t._v(" "),a("p",[t._v("是否提示错误消息")]),t._v(" "),a("h4",{attrs:{id:"参数-boolean-object"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#参数-boolean-object"}},[t._v("#")]),t._v(" 参数: "),a("code",[t._v("Boolean")]),t._v(" | "),a("code",[t._v("Object")])]),t._v(" "),a("p",[a("code",[t._v("Boolean")]),t._v(" 是否提示错误消息\n"),a("br"),t._v(" "),a("code",[t._v("Object")]),t._v(" 根据设置 "),a("code",[t._v("key")]),t._v(" 使用 "),a("code",[t._v("code")]),t._v(" 状态码进行匹配，同时增加了 "),a("code",[t._v("timeout")]),t._v(" 和 "),a("code",[t._v("default")]),t._v(" 两个key 来匹配 "),a("code",[t._v("请求超时")]),t._v(" 和 "),a("code",[t._v("未匹配的提示")])]),t._v(" "),a("h4",{attrs:{id:"注意-obejct-里面的-key-value-数据格式同-messagekey-一致"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#注意-obejct-里面的-key-value-数据格式同-messagekey-一致"}},[t._v("#")]),t._v(" 注意: "),a("code",[t._v("Obejct")]),t._v(" 里面的 "),a("code",[t._v("key")]),t._v(" : "),a("code",[t._v("value")]),t._v(" 数据格式同 "),a("code",[t._v("messageKey")]),t._v(" 一致")]),t._v(" "),a("br"),t._v(" "),a("h3",{attrs:{id:"failtype"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#failtype"}},[t._v("#")]),t._v(" "),a("code",[t._v("failType")])]),t._v(" "),a("p",[t._v("提示的类型")]),t._v(" "),a("h4",{attrs:{id:"参数-string-function-2"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#参数-string-function-2"}},[t._v("#")]),t._v(" 参数: "),a("code",[t._v("String")]),t._v(" | "),a("code",[t._v("Function")])]),t._v(" "),a("p",[a("code",[t._v("String")]),t._v(" 提示类型:"),a("code",[t._v("info")]),t._v(" | "),a("code",[t._v("error")]),t._v(" | "),a("code",[t._v("success")]),t._v(" | "),a("code",[t._v("warning")]),t._v(" "),a("br"),t._v(" "),a("code",[t._v("Function")]),t._v(" 获取提示类型 分别传入 "),a("code",[t._v("提示类型")]),t._v(","),a("code",[t._v("提示文本")]),t._v(","),a("code",[t._v("状态码")]),t._v(","),a("code",[t._v("返回内容")])]),t._v(" "),a("br"),t._v(" "),a("h3",{attrs:{id:"tip"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#tip"}},[t._v("#")]),t._v(" "),a("code",[t._v("tip")])]),t._v(" "),a("p",[t._v("是否提示消息")]),t._v(" "),a("h4",{attrs:{id:"参数-boolean-object-2"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#参数-boolean-object-2"}},[t._v("#")]),t._v(" 参数: "),a("code",[t._v("Boolean")]),t._v(" | "),a("code",[t._v("Object")])]),t._v(" "),a("p",[a("code",[t._v("Boolean")]),t._v(" 是否提示消息\n"),a("br"),t._v(" "),a("code",[t._v("Object")]),t._v(" 根据设置 "),a("code",[t._v("key")]),t._v(" 使用 "),a("code",[t._v("code")]),t._v(" 状态码进行匹配，同时增加了 "),a("code",[t._v("success")]),t._v(" 和 "),a("code",[t._v("default")]),t._v(" 两个key 来匹配 "),a("code",[t._v("成功请求")]),t._v(" 和 "),a("code",[t._v("未匹配的提示")])]),t._v(" "),a("h4",{attrs:{id:"注意-obejct-里面的-key-value-数据格式同-messagekey-一致-2"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#注意-obejct-里面的-key-value-数据格式同-messagekey-一致-2"}},[t._v("#")]),t._v(" 注意: "),a("code",[t._v("Obejct")]),t._v(" 里面的 "),a("code",[t._v("key")]),t._v(" : "),a("code",[t._v("value")]),t._v(" 数据格式同 "),a("code",[t._v("messageKey")]),t._v(" 一致")]),t._v(" "),a("br"),t._v(" "),a("h3",{attrs:{id:"tiptype"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#tiptype"}},[t._v("#")]),t._v(" "),a("code",[t._v("tipType")])]),t._v(" "),a("p",[t._v("提示的类型")]),t._v(" "),a("h4",{attrs:{id:"参数-obejct-function"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#参数-obejct-function"}},[t._v("#")]),t._v(" 参数: "),a("code",[t._v("Obejct")]),t._v(" | "),a("code",[t._v("Function")])]),t._v(" "),a("p",[a("code",[t._v("Object")]),t._v(" 分为 "),a("code",[t._v("success")]),t._v(" 成功的提示状态 和 "),a("code",[t._v("default")]),t._v(" 失败的提示状态 提示类型:"),a("code",[t._v("info")]),t._v(" | "),a("code",[t._v("error")]),t._v(" | "),a("code",[t._v("success")]),t._v(" | "),a("code",[t._v("warning")]),t._v(" | "),a("code",[t._v("boolean:false")]),t._v(" "),a("br"),t._v(" "),a("code",[t._v("Function")]),t._v(" 获取提示类型 分别传入 "),a("code",[t._v("提示类型")]),t._v(","),a("code",[t._v("提示文本")]),t._v(","),a("code",[t._v("状态码")]),t._v(","),a("code",[t._v("返回内容")]),t._v(" 返回值 可以为 "),a("code",[t._v("info")]),t._v(" | "),a("code",[t._v("error")]),t._v(" | "),a("code",[t._v("success")]),t._v(" | "),a("code",[t._v("warning")]),t._v(" | "),a("code",[t._v("{type:'info' | 'error' | 'success' | 'warning',tip:string}")]),t._v(" | "),a("code",[t._v("false")]),t._v(" | "),a("code",[t._v("undefiend")]),t._v(" "),a("code",[t._v("等类型")])]),t._v(" "),a("h4",{attrs:{id:"注意-如果返回不为真的数据-或者不被匹配的提示-将不会进行提示"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#注意-如果返回不为真的数据-或者不被匹配的提示-将不会进行提示"}},[t._v("#")]),t._v(" 注意: 如果返回不为真的数据，或者不被匹配的提示，将不会进行提示")])])}),[],!1,null,null,null);s.default=n.exports}}]);