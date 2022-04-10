import { CancelTokenSource, CancelTokenStatic,Cancel,CancelToken as CancelTokenExplate} from '../type/type';

export class CancelTarget implements Cancel{
    constructor(public message:string) {}
}


// @ts-ignore
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
        throw new Error('Method not implemented.');
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
