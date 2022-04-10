import Verification from './lib/verification';
export default {
    // 扩展名称
    extendName: 'verification',
    // 向外界开放
    extend: function (options) {
        return new Verification(options && options.rules, options && options.formats);
    },
    // 默认的配置
    defaultOption: {
        mode: 'default',
        tip: true,
        tipKey: 'placeholder',
        activeVerification: true
    },
    // 校验对象
    verification: undefined,
    install(target, config) {
        let option = this.createConfig(config);
        target.push({
            name: 'verification',
            trigger: (config) => {
                let resultOption = Object.assign({}, {
                    mode: option.mode,
                    useKey: option.useKey,
                    activeVerification: option.activeVerification
                }, this.compatible(config.requestData.verification));
                // 如果存在 useKey 触发
                if (resultOption.useKey && config.requestData[resultOption.useKey]) {
                    resultOption.data = config.requestData[resultOption.useKey];
                }
                // 执行校验
                let result = this.verication.verification(resultOption);
                // 如果校验不通过
                if (!result.verification) {
                    let resultUseTip = resultOption.tip || option.tip;
                    if (typeof resultUseTip === 'function') {
                        resultUseTip = resultUseTip(result);
                    }
                    if (resultUseTip) {
                        target.message(typeof resultUseTip === 'string' ? resultUseTip : 'info', config, { content: result.tip });
                    }
                    return config.exit({
                        data: result,
                        status: 500,
                        statusText: result.tip || 'verication error exit',
                        config: undefined,
                        headers: undefined,
                        custom: true
                    }, 'none', true);
                }
                else if (resultOption.merge) {
                    if (typeof resultOption.merge === 'string') {
                        config.requestData[resultOption.merge] = Object.assign({}, config.requestData[resultOption.merge], result.value);
                    }
                    else if (typeof resultOption.merge === 'function') {
                        let params = resultOption.merge(result.value);
                        if (params) {
                            for (let key in params) {
                                if (params.hasOwnProperty(key)) {
                                    config.requestData[key] = Object.assign({}, config.requestData[key], params[key]);
                                }
                            }
                        }
                    }
                    else if (resultOption.merge) {
                        resultOption.merge.map((item) => {
                            config.requestData[item] = Object.assign({}, config.requestData[item], result.value);
                        });
                    }
                }
            },
            type: 'entry',
            zIndex: 100
        });
    },
    // 创建配置文件
    createConfig(option) {
        // 返回配置
        return Object.assign({}, this.defaultOption, option);
    },
    // 兼容
    compatible(option) {
        if (!option) {
            return undefined;
        }
        let type = typeof option;
        if (type === 'string') {
            return {
                useKey: type
            };
        }
        else {
            return option;
        }
    },
    register(target, option = {}) {
        target && target.$use(this, option);
        this.verication = new Verification(option.rules, option.formats);
        return this.verication;
    }
};
