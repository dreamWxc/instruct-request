import {AxiosError} from 'axios';

import Request from './request';

import UploadSlice from './plugins/slice/slice';

import { RequestConfigInstruction,OutsideRequestObject,RequestResponse,ResponseData,RequestPlugin,InstructionPostOption,ResponseSuccess,InstructionOption,ExitTriggers,InstructionExit,ResponseTypeStatus,ResponseExtendChain,RequestExtend,RequestMessageOption } from './type.d';
export { RequestConfigInstruction,RequestResponse,ResponseData,RequestPlugin,InstructionPostOption,ResponseSuccess,InstructionOption,ExitTriggers,InstructionExit,ResponseTypeStatus,ResponseExtendChain,RequestExtend,RequestMessageOption }

export {
    Request
}

class OutsideRequest <T = RequestResponse,I = Record<string,any>,D = AxiosError<RequestConfigInstruction<T,I,AxiosError>>> implements OutsideRequestObject<T,I,D>{

    private _$request$_:Request<T,D>;

    constructor(config:RequestConfigInstruction<T,I,D>) {
        // @ts-ignore
        this._$request$_ = new Request<T,D,I & RequestConfigInstruction<T,I,D>>(config);
    }

    /*
    *   请求接口
    *   @param requestConfig 请求接口的配置参数 详细参考 RequestConfigInstruction
    * */
    $request<childT=T,childD=D>(requestConfig:I & RequestConfigInstruction<childT,I,childD>){
        
        let agentTarget = this._$request$_.getAgentTarget<childT & ResponseExtendChain,I & RequestConfigInstruction<childT,I,childD>,childD>('$request');
        if(agentTarget) {
            return agentTarget(requestConfig);
        } else {
            return this._$request$_.request<childT & ResponseExtendChain,childD>(requestConfig);
        }
    }

    private uploadSlice:UploadSlice<T,I,D>;

    /* 
    *   上传图片
    *   @param requestConfig 请求接口的配置参数 详细参考 RequestConfigInstruction
    */
    $upload<childT = T,childD = D>(requestConfig:I & RequestConfigInstruction<childT,I,childD>){
        let agentTarget = this._$request$_.getAgentTarget<childT & ResponseExtendChain,I & RequestConfigInstruction<childT,I,childD>,childD>('$upload');
        if(agentTarget) {
            return agentTarget(requestConfig);
        } else {
            return this._$request$_.upload<childT & ResponseExtendChain,childD>(requestConfig);
        }
    }

    /*
    *   注册插件
    *   @param plugin 插件
    *   @param option 插件配置表
    * */
    $use<T>(plugin:RequestPlugin,option?:T){
        this._$request$_.use(plugin,option);
        return this;
    }

    /* 向外界扩展 */
    extend<T extends keyof RequestExtend>(key:T):RequestExtend[T]{
        return this._$request$_.extendValues[key].trigger;
    }

}

export default {

    // 返回实例
    create<T=RequestResponse,I = Record<string, any>,D = AxiosError<RequestConfigInstruction<T,I,AxiosError>> >(config:RequestConfigInstruction<T,I,D>):OutsideRequestObject<T,I,D>{
        return new OutsideRequest<T,I,D>(config);
    }

}
