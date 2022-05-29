// 绑定环境变量
import "./platforms";
import Request from "../../request";
import Instructions from '../../instructions';
import PromiseExtend from "../../extend/ProsmiseExtend";
/* 插件模块 */
import { CachePlugin, VerificationPlugin, TipPlugin, SlicePlugin } from '../../../index';
/* 插件模块 */
export { Instructions, PromiseExtend, CachePlugin, VerificationPlugin, TipPlugin, SlicePlugin };
CachePlugin.defaultOption.localStorage = localStorage;
CachePlugin.defaultOption.sessionStorage = sessionStorage;
export default Request;
