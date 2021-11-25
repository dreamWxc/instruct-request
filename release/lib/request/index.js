import Request from './request';
export { Request };
class OutsideRequest {
    _$request$_;
    constructor(config) {
        // @ts-ignore
        this._$request$_ = new Request(config);
    }
    $all(data, requestConfig) {
        return this._$request$_.all(data, requestConfig);
    }
    /*
    *   请求接口
    *   @param requestConfig 请求接口的配置参数 详细参考 RequestConfigInstruction
    * */
    $request(requestConfig) {
        let agentTarget = this._$request$_.getAgentTarget('$request');
        if (agentTarget) {
            return agentTarget(requestConfig);
        }
        else {
            return this._$request$_.request(requestConfig);
        }
    }
    uploadSlice;
    /*
    *   上传图片
    *   @param requestConfig 请求接口的配置参数 详细参考 RequestConfigInstruction
    */
    $upload(requestConfig) {
        let agentTarget = this._$request$_.getAgentTarget('$upload');
        if (agentTarget) {
            return agentTarget(requestConfig);
        }
        else {
            return this._$request$_.upload(requestConfig);
        }
    }
    /*
    *   注册插件
    *   @param plugin 插件
    *   @param option 插件配置表
    * */
    $use(plugin, option) {
        this._$request$_.use(plugin, option);
        return this;
    }
    /* 向外界扩展 */
    extend(key) {
        return this._$request$_.extendValues[key].trigger;
    }
}
export default {
    // 返回实例
    create(config) {
        return new OutsideRequest(config);
    }
};
