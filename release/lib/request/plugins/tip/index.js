export default {
    // 默认的配置
    defaultOption: {
        fail: {
            timeout: '请求超时',
            default: '服务繁忙'
        },
        failType: 'error',
        duration: 3000,
        tip: true,
        tipType: {
            success: 'success',
            default: 'info'
        },
        messageKey: 'msg'
    },
    install(target, config) {
        // 全局配置
        let option = this.createConfig(config, this.defaultOption);
        target.push({
            name: 'tip',
            trigger: (config) => {
                if (config.requestData.tip) {
                    let useOption = this.createConfig(this.compatible(config.requestData.tip), this.compatible(option));
                    let tipType = config.status === 'success' ? 'tip' : 'fail';
                    // 设置允许提示
                    if (useOption[tipType] !== false) {
                        let tip, useTipType, codeType, useCodeStatus;
                        /* 获取codeType */
                        if (config.status === 'success') {
                            useCodeStatus = config.responseRestData && config.responseRestData[target.getConfig('codeKey', config, useOption)];
                            if (target.verificationSuccessful(config.responseData, useOption, config)) {
                                codeType = 'success';
                            }
                        }
                        else {
                            useCodeStatus = config.responseData.status ? config.responseData.status : config.responseData.response && config.responseData.response.status;
                            if (config.responseData && config.responseData.response === undefined) {
                                codeType = 'timeout';
                            }
                        }
                        if (!codeType) {
                            codeType = 'default';
                        }
                        /* 获取codeType */
                        /* 获取提示文本 */
                        let tipMessage = this.getConfig(tipType, useOption);
                        if (tipMessage && typeof tipMessage === 'object') {
                            let tipResult = this.getTipMessage(tipMessage, codeType, useCodeStatus);
                            // 获取提示文本
                            if (tipResult) {
                                tip = tipResult;
                            }
                            else {
                                tip = tipMessage.default;
                            }
                        }
                        else {
                            if (tipType === 'tip') {
                                if (typeof useOption.messageKey === 'function') {
                                    tip = useOption.messageKey(config.responseData, codeType, useCodeStatus);
                                }
                                else {
                                    tip = config.responseRestData && config.responseRestData[useOption.messageKey] || '';
                                }
                            }
                            else {
                                tip = '';
                            }
                        }
                        if (typeof tip === 'function') {
                            tip = tip(config.responseData, codeType, useCodeStatus);
                        }
                        /* 获取提示文本 */
                        /* 获取提示类型以及相应配置 */
                        let tipTypeConfig = this.getConfig(tipType + 'Type', useOption);
                        if (tipTypeConfig) {
                            let tipTypeof = typeof tipTypeConfig;
                            if (tipTypeof === 'string')
                                useTipType = tipTypeConfig;
                            else if (tipTypeof === 'function') {
                                let resultTipConfig = tipTypeConfig(codeType, tip, useCodeStatus, config.responseData);
                                if (resultTipConfig) {
                                    switch (typeof resultTipConfig) {
                                        case 'string':
                                            useTipType = resultTipConfig;
                                            break;
                                        case 'object':
                                            useTipType = resultTipConfig.type, tip = resultTipConfig.tip;
                                            break;
                                    }
                                }
                                if (!useTipType) {
                                    useTipType = typeof option[tipType + 'Type'] === 'string' ? option[tipType + 'Type'] : this.defaultOption[tipType + 'Type'];
                                }
                            }
                            else if (tipTypeof === 'object') {
                                useTipType = tipTypeConfig[codeType];
                            }
                        }
                        /* 获取提示类型以及相应配置 */
                        /* 执行提示 */
                        if (tip && useTipType) {
                            let duration;
                            if (typeof useOption.duration === 'function') {
                                duration = useOption.duration(config.status === 'success', codeType, tip, useCodeStatus, config.responseData);
                            }
                            else {
                                duration = useOption.duration;
                            }
                            // 执行判断是否执行提示
                            return target.message(useTipType, config, {
                                content: tip,
                                duration: duration === undefined ? option.duraction : duration
                            });
                        }
                        /* 执行提示 */
                    }
                }
            },
            type: 'post',
            zIndex: -100
        });
    },
    // 获取提示文本
    getTipMessage(data, codeType, code) {
        return data[code] ? data[code] : data[codeType];
    },
    // 创建配置文件
    createConfig(option, defaultOption) {
        // 返回配置
        return Object.assign({}, defaultOption, option);
    },
    // 获取配置
    getConfig(key, option) {
        if (typeof option[key] === 'boolean') {
            return this.defaultOption[key];
        }
        else {
            return option[key];
        }
    },
    // 兼容
    compatible(option) {
        if (!option || typeof option === 'boolean') {
            return undefined;
        }
        return option;
    },
    // 注册
    register(target, option) {
        return target && target.$use(this, option);
    }
};
