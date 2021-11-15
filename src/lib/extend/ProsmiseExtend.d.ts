export interface PromiseExtendCallback<T,D> {
    (resolve:(data:T)=>void,reject:(data:D)=>void):any
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
