
import { RequestConfigInstruction,OutsideRequestObject,RequestResponse,RequestExtend,RequestPlugin } from './type.d';
import {AxiosError} from '../request-config';

interface instructRequest {

    // 创建指令对象
    create<T=RequestResponse,I = Record<string, any>,D=AxiosError<RequestConfigInstruction>>(config:RequestConfigInstruction):OutsideRequestObject<T,I,D>

}

declare const instructRequest: instructRequest;

export default instructRequest;

export {
    RequestConfigInstruction,
    OutsideRequestObject,
    RequestExtend,
    RequestPlugin
}
