import {VerificationUseOption,VerificationOption,VerificationPlugin,VerificationUseKey,VerifictionRequestExtend,VerificationPluginOption} from "./type";

import Verification from './lib/verification';

import {RequestMessageOption} from '../../type';

export default {

    // 扩展名称
    extendName:'verification',
    // 向外界开放
    extend:function(options?:VerificationUseOption){
        return new Verification(options && options.rules,options && options.formats);
    },

    // 默认的配置
    defaultOption:{
        mode:'default',
        tip:true,
        tipKey:'placeholder',
        activeVerification:true
    } as VerificationUseOption,

    // 校验对象
    verification: undefined as Verification,

    install(target,config?:VerificationUseOption) {

        let option:VerificationUseOption = this.createConfig(config);

        target.push({
            name:'verification',
            trigger:(config)=>{
                
                let resultOption:VerificationOption = Object.assign({},{
                    mode: option.mode,
                    useKey: option.useKey,
                    activeVerification: option.activeVerification
                },this.compatible(config.requestData.verification));

                // 如果存在 useKey 触发
                if(resultOption.useKey && config.requestData[resultOption.useKey]) {
                    resultOption.data = config.requestData[resultOption.useKey];
                }

                // 执行校验
                let result = (this.verication as Verification).verification(resultOption);

                // 如果校验不通过
                if(!result.verification) {

                    let resultUseTip = resultOption.tip || option.tip;

                    if(typeof resultUseTip === 'function') {
                        resultUseTip = resultUseTip(result);
                    }

                    if(resultUseTip) {
                        target.message(typeof resultUseTip === 'string' ? resultUseTip :'info',config,{content:result.tip});
                    }
                
                    return config.exit({
                        data:result,
                        status: 500,
                        statusText: result.tip || 'verication error exit',
                        config:undefined,
                        headers:undefined,
                        custom:true
                    },'none',true);
                } else if(resultOption.merge){
                    if(typeof resultOption.merge === 'string') {
                        config.requestData[resultOption.merge as string] = Object.assign({},config.requestData[resultOption.merge],result.value);
                    } else if(typeof resultOption.merge === 'function'){
                        let params = resultOption.merge(result.value);
                        if(params) {
                            for(let key in params) {
                                if(params.hasOwnProperty(key)) {
                                    config.requestData[key] = Object.assign({},config.requestData[key],params[key]);
                                }
                            }
                        }
                    } else if(resultOption.merge){
                        resultOption.merge.map((item)=> {
                            config.requestData[item  as string] = Object.assign({},config.requestData[item],result.value);
                        });
                    }
                }

            },
            type:'entry',
            zIndex:100
        });

    },

    // 创建配置文件
    createConfig(option:VerificationUseOption):VerificationUseOption{
        // 返回配置
        return Object.assign({},this.defaultOption,option);
    },
    // 兼容
    compatible(option:VerificationUseOption):VerificationOption | undefined{

        if (!option) {
            return  undefined;
        }
        let type = typeof option;
        if (type === 'string') {
            return {
                useKey: type as VerificationUseKey 
            };
        } else {
            return option as VerificationOption;
        }

    },

    register<T=Record<string,any>,D=Record<string,any>>(target,option:VerificationUseOption<T,D>={}){
        target && target.$use(this,option);
        this.verication = new Verification<T,D>(option.rules,option.formats);
        return this.verication;
    }

} as VerificationPlugin;


export { VerificationPluginOption,VerifictionRequestExtend,VerificationPlugin,VerificationOption }