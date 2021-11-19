import RequestAxios  from "./lib/request";

import axios from 'axios';

import Instructions from './lib/instructions';

import PromiseExtend from "./lib/extend/ProsmiseExtend";

/* 插件模块 */
import CachePlugin from './lib/request/plugins/cache';
import VerificationPlugin from './lib/request/plugins/verification';
import TipPlugin from './lib/request/plugins/tip';
import SlicePlugin from './lib/request/plugins/slice';
/* 插件模块 */

export {
    Instructions,
    PromiseExtend,
    axios,
    CachePlugin,
    VerificationPlugin,
    TipPlugin,
    SlicePlugin
}

export default RequestAxios;