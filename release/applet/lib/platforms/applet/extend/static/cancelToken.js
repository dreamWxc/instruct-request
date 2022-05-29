export class CancelTarget {
    message;
    constructor(message) {
        this.message = message;
    }
}
export default class CancelToken {
    promise;
    reason;
    constructor(executor) {
        let resolvePromise;
        this.promise = new Promise(function promiseExecutor(resolve) {
            resolvePromise = resolve;
        });
        executor((message) => {
            if (this.reason) {
                // Cancellation has already been requested
                return;
            }
            this.reason = new CancelTarget(message);
            resolvePromise(this.reason);
        });
    }
    source() {
        return CancelToken.source();
    }
    throwIfRequested() {
        throw new Error('Method not implemented.');
    }
    static source() {
        let cancel;
        let token = new CancelToken(function (c) {
            cancel = c;
        });
        return {
            token,
            cancel
        };
    }
}
