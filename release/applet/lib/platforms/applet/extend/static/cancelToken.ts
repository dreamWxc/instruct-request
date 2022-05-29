import { CancelTokenSource, CancelTokenStatic,Cancel } from '../type/type';

export class CancelTarget implements Cancel{
    constructor(public message:string) {}
}


export default class CancelToken implements CancelTokenStatic {

    promise: Promise<Cancel>;
    reason?: Cancel;

    constructor(executor) {

        let resolvePromise;
        this.promise = new Promise(function promiseExecutor(resolve) {
            resolvePromise = resolve;
        });

        executor( (message)=>{
            if (this.reason) {
                // Cancellation has already been requested
                return;
            }

            this.reason = new CancelTarget(message);
            resolvePromise(this.reason);
        })
    }

    source(): CancelTokenSource {
        return  CancelToken.source()
    }

    throwIfRequested(): void {
        throw new Error('Method not implemented.');
    }

    static source(): CancelTokenSource {
        let cancel;
        let token = new CancelToken(function (c) {
            cancel = c;
        });
        return  {
            token,
            cancel
        }
    }

}

