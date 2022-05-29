import Request  from "../../src/lib/request";

import Static from './extend/static/index';

import Instructions from '../../src/lib/instructions';

import PromiseExtend from "../../src/lib/extend/ProsmiseExtend";

import Storage from './extend/storage/index';

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

CachePlugin.defaultOption.localStorage = new Storage();
CachePlugin.defaultOption.sessionStorage = new Storage();

Request.staticRequest = Static;

export default Request;
