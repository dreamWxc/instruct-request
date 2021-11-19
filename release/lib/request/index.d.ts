
import { RequestConfigInstruction,OutsideRequestObject,RequestResponse } from './type.d';
import {AxiosError, AxiosStatic} from 'axios';

interface instructRequest {

    // 创建指令对象
    create<T=RequestResponse,I = Record<string, any>,D=AxiosError<RequestConfigInstruction>>(config:RequestConfigInstruction):OutsideRequestObject<T,I,D>

    // axios 原对象
    axios:AxiosStatic

}

declare const instructRequest: instructRequest;

export default instructRequest;

export {
    RequestConfigInstruction
}