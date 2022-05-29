import Request  from "../../src/lib/request";

import Instructions from '../../src/lib/instructions';

import PromiseExtend from "../../src/lib/extend/ProsmiseExtend";

/* 插件模块 */
import CachePlugin from '../../src/lib/request/plugins/cache';
import VerificationPlugin from '../../src/lib/request/plugins/verification';
import TipPlugin from '../../src/lib/request/plugins/tip';
import SlicePlugin from '../../src/lib/request/plugins/slice';
/* 插件模块 */

export {
    Instructions,
    PromiseExtend,
    CachePlugin,
    VerificationPlugin,
    TipPlugin,
    SlicePlugin
}

if (window) {
    CachePlugin.defaultOption.localStorage = window.localStorage;
    CachePlugin.defaultOption.sessionStorage = window.sessionStorage;
}


export default Request;
