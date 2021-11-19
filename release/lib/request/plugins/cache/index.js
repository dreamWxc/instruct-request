import CacheDataExtend from './extend/cacheDataExtend';
import CacheExtend from './extend/cacheExtend';
import Single from './single';
const config = {
    // 扩展名称
    extendName: 'cache',
    // 缓存类型
    cache: undefined,
    // 向外界开放
    extend: function (options) {
        if (!config.cache) {
            config.createCache();
        }
        return new CacheExtend(options, this.cache);
    },
    // 默认的配置
    defaultOption: {
        // 默认缓存类型为 session
        storage: 'memory',
        // 默认首次加载更新值
        first: true
    },
    // 创建cache对象
    createCache() {
        this.cache = Single.getCache();
    },
    // 安装时触发
    install(target, option) {
        // 创建配置
        option = this.createConfig(option, target);
        // 插入 前置 指令
        target.push({
            name: 'cache',
            trigger: (config) => {
                if (!this.cache) {
                    this.createCache();
                }
                let resultOption = option;
                if (config.requestData.cache) {
                    resultOption = Object.assign({}, resultOption, this.compatible(config.requestData.cache, option));
                }
                return this.trigger(config, resultOption, target);
            },
            type: 'front',
            zIndex: 100
        });
        // 插入 后置 指令
        target.push({
            name: 'cache',
            trigger: (config) => {
                let resultOption = option;
                if (config.requestData.cache) {
                    resultOption = Object.assign({}, resultOption, this.compatible(config.requestData.cache, option));
                }
                let resultCache = target.getExtend(this, config);
                // 执行注册扩展
                target.registerExtend(this, config, resultCache, resultOption);
                // 鉴定状态是否成功
                if ((!resultCache || !resultCache.useCache) && target.verificationSuccessful(config.responseData, resultOption, config)) {
                    // 存入缓存
                    return this.cache.setItem(config.sign, config.responseRestData, resultOption);
                }
            },
            type: 'success',
            zIndex: -100
        });
    },
    // 创建配置文件
    createConfig(option, target) {
        // 获取系统的配置文件
        let systemConfig = this.compatible(target.getConfig('cache'));
        // 获取当前配置
        let resultOption = this.compatible(option);
        // 返回配置
        return Object.assign({}, systemConfig, this.defaultOption, resultOption);
    },
    // 兼容
    compatible(option, defaultOption) {
        if (!option) {
            return undefined;
        }
        let type = typeof option;
        if (type === 'string' || type === 'boolean') {
            return {
                storage: type === 'boolean' ? ((defaultOption ? defaultOption.storage : undefined) || 'session') : option
            };
        }
        else {
            return option;
        }
    },
    // 触发获取缓存
    trigger: function (config, option, target) {
        /*
        *   where 条件是否满足 则使用缓存
        * */
        if (!option.hasOwnProperty('option')
            ||
                typeof option.where === 'boolean' ?
            option.where !== false
            :
                option.where(config)) {
            // 获取数据结果
            let resultData = this.cache.getItem(config.sign, option);
            // 如果允许被执行触发
            if (resultData && (!option.hasWhere || option.hasWhere(config, resultData))) {
                // 判断是否需要更新
                let update = resultData.first;
                if (option.hasOwnProperty('update')) {
                    if (typeof option.update === 'boolean') {
                        update = option.update;
                    }
                    else {
                        update = option.update(config, resultData);
                    }
                }
                target.setSuccessResponseData({
                    data: option.handle ? option.handle(resultData) : resultData.data,
                    status: 200,
                    statusText: 'ok',
                    headers: null,
                    config: config.requestData
                }, config);
                // 设置向下通知
                target.setExtend(this, {
                    // 当前使用的属于cache
                    useCache: true
                }, config);
                return target.triggerPost(config, undefined, !update);
            }
        }
    },
    // 注册扩展
    registerExtend(responseExtendChain, option, resultOption) {
        // 当前是否拥有缓存
        let isCache = option ? option.useCache : false;
        if (isCache)
            responseExtendChain.isCache = option ? option.useCache : false;
        responseExtendChain.cache = function () {
            if (!config.cache) {
                config.createCache();
            }
            return new CacheDataExtend({
                data: { ...this },
                sign: this.__sign,
                option: resultOption
            }, 'default', config.cache);
        };
    },
    // 注册
    register(target, option) {
        return target && target.$use(this, option);
    }
};
export default config;
