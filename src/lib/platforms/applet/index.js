import Request from "../../request";
import Static from './extend/static/index';
import Instructions from '../../instructions';
import PromiseExtend from "../../extend/ProsmiseExtend";
import Storage from './extend/storage/index';
// 绑定环境变量
import "./platforms";
/* 插件模块 */
import { CachePlugin, VerificationPlugin, TipPlugin, SlicePlugin } from '../../../index';
/* 插件模块 */
export { Instructions, PromiseExtend, CachePlugin, VerificationPlugin, TipPlugin, SlicePlugin };
CachePlugin.defaultOption.localStorage = Storage;
Request.staticRequest = Static;
export default Request;
