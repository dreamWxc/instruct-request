export type PromiseExtendCallback<T,D> = (resolve:PromiseExtendCallbackTarget<T>,reject:PromiseExtendCallbackTarget<D>)=> any;


interface PromiseExtendCallbackTarget<T> {
    (data?:T):any
}

export interface InterFacePromiseExtend<T,D> {

    // 成功的回调
    then(onfulfilled?:((data:T)=>void) | undefined | null):InterFacePromiseExtend<T,D>;

    // 失败的回调
    catch(onfulfilled?:(data:D)=>void | undefined | null):InterFacePromiseExtend<T,D>;

    // 完成的回调
    finally(onfulfilled:Function):InterFacePromiseExtend<T,D>

}


declare var PromiseExtend: PromiseConstructor;
