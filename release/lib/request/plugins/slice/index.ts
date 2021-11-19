import { RequestPlugin,Request } from '../../index';
import UploadSlice from './slice';

import Cache from '../cache/cache';

import UploadExtend from './slice/uploadExtend';

import {
    SlicePluginOption,
    RequestUploadInstructionFile,
    RequestUploadCache,
    SliceRequestExtend
} from './type';


type SlicePlugin<T=any,I=any,D=any> = RequestPlugin<T,SlicePluginOption<T,I,D>>;

const config = {
    // 扩展名称
    extendName:'slice',
    // 实例对象
    uploadSlice:undefined,
    // 向外界开放
    extend:function(options?:RequestUploadCache){  
        return new UploadExtend(config.uploadSlice.cache,options)
    },
    // 默认的配置
    defaultOption:{
        mode:'queue',
            cache:"memory",
            analysis:10,
            replaceData:{
                'index':'index',
                'total':'total',
                'file':'file',
                'hash':'hash',
                'size':'size',
                'name':'name'
            },
            splitSize: 2 * 1024 * 1024,
            record:true
    } as SlicePluginOption,
    // 安装时触发
    install(target:Request,option?:SlicePluginOption){

        if(this.uploadSlice === undefined) this.uploadSlice = new UploadSlice(target,new Cache('X19maWxlX3NsaWNlX18='));

        // 创建配置
        option = this.createConfig(option,target);

        // 注册代理
        return target.agent('$upload',<T,D>(config)=> {
            if(config.file) {
                return (this.uploadSlice as UploadSlice<T,any,D>).upload<T,D>(config,option);
            } else {
                return target.upload<T,D>(config);
            }
        });


    },
    // 创建配置文件
    createConfig(option:SlicePluginOption,target:Request){

        // 获取系统的配置文件
        let systemConfig = target.getConfig('file') as SlicePluginOption;

        // 获取当前配置
        let resultOption = option;

        // 返回配置
        return Object.assign({},systemConfig,this.defaultOption,resultOption);
    },

    // 注册
    register(target,option){
        return target && target.$use(this,option);
    }

} as SlicePlugin;

export default config;

export { 
    SlicePlugin,
    RequestUploadInstructionFile,
    SliceRequestExtend
}
