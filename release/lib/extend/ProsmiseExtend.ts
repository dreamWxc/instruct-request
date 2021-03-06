import { resolve } from 'path/posix';
import config from '../request/plugins/cache';
import {
    InterFacePromiseExtend,
    PromiseExtendCallback
} from './ProsmiseExtend.d';

export default class PromiseExtend<T,D = unknown> extends Promise<T> implements InterFacePromiseExtend<T,D> {

    static all(data:Array<PromiseExtend<any>>){
        return new PromiseExtend(function(relosve,reject){
            let watchContxt = {
                length: data.length,
                successNumber:undefined,
                failNumber:undefined,
                params:undefined,
                relosve,
                reject,
                callback:function(status:boolean,unique:number,data){

                    let key:string = status ? 'successNumber' : 'failNumber';
                    let reveseKey:string = status ? 'failNumber' : 'successNumber';
                    if(watchContxt[key] === undefined) watchContxt[key] = { length:0 };
                    watchContxt[key][unique] = 1;
                    watchContxt[key].length++;
                    if(watchContxt[reveseKey] && watchContxt[reveseKey][unique]){
                        delete watchContxt[reveseKey][unique];
                        watchContxt[reveseKey].length--;
                    }
                    if(watchContxt.params === undefined) watchContxt.params = [];
                    watchContxt.params[unique] = data;

                    let count = (watchContxt.successNumber && watchContxt.successNumber.length || 0) + (watchContxt.failNumber && watchContxt.failNumber.length || 0)

                    if(count >= watchContxt.length){
                        let trigger = watchContxt.failNumber && watchContxt.failNumber.length > 0 ? reject:relosve;
                        let params = watchContxt.params;
                        watchContxt = null;
                        return trigger(params);
                    }

                }
            };
            return data.map(function(item,index){
                item.then(function(data){
                    return watchContxt && watchContxt.callback(true,index,data);
                }).catch(function(data){
                    return watchContxt &&  watchContxt.callback(false,index,data);
                });
            })

        });
    }

    static race(data:Array<PromiseExtend<any>>){
        return new PromiseExtend(function(relosve,reject){
            let watchContxt = {
                length: data.length,
                status:undefined,
                count:0,
                params:undefined,
                relosve,
                reject,
                callback:function(status:boolean,unique:number,data){

                    if(config.status === undefined) {
                        config.status = status;
                    }

                    if(watchContxt.params === undefined) watchContxt.params = [];
                    watchContxt.params[unique] = data;

                    let count = (watchContxt.params && watchContxt.params.length || 0);

                    if(count >= watchContxt.length){
                        let trigger = config.status ? relosve:reject;
                        let params = watchContxt.params;
                        watchContxt = null;
                        return trigger(params);
                    }

                }
            };
            return data.map(function(item,index){
                item.then(function(data){
                    return watchContxt && watchContxt.callback(true,index,data);
                }).catch(function(data){
                    return watchContxt && watchContxt.callback(false,index,data);
                });
            })

        });
    }

    // ??????
    private triggerTimeCallback:any;

    // ??????
    constructor(executor:PromiseExtendCallback<T,D>){
        super(function(){});
        if(!executor) {
            console.error('no trigger Function,this arg is',executor,'but need typeof is Function');
        } else {
            this.triggerTimeCallback = setTimeout(()=>{
                return executor(
                    this.resolve.bind(this),
                    this.reject.bind(this),
                );
            },0);
        }

    }

    // ?????????????????????
    private resolves:Array<Function> = undefined;

    // ?????????????????????
    private rejects:Array<Function> = undefined;

    // ?????????????????????
    private finallys:Array<Function> = undefined;

    // ????????????????????????
    private subscribe(key:'resolves'|'rejects'|'finallys',callback:Function):number {
        if(this[key] === undefined) this[key] = [];
        // ????????????
        return this[key].push(callback);
    }

    // ??????
    private broadcastSubscribe(key:'resolves'|'rejects',data:any){
        this[key] &&  this.broadcast(key,data);
        return this['finallys'] && this.broadcast('finallys',data);
    }

    // ???????????????
    private broadcast(key:'resolves'|'rejects'|'finallys',data:any){
        let resultData = data;
        this[key].map((item)=> {
            resultData = item(resultData);
        });
    }

    // ?????????????????????
    // @ts-ignore
    public then(onfulfilled?:(data:T)=>void | undefined  | null):PromiseExtend<T,D>{
        this.subscribe('resolves',onfulfilled);
        return this;
    }

    // ?????????????????????
    // @ts-ignore
    public finally(onfulfilled?:Function):PromiseExtend<T,D>{
        this.subscribe('finallys',onfulfilled);
        return this;
    }

    // ?????????????????????
    // @ts-ignore
    public catch(onfulfilled?:(data:D)=>void | undefined  | null):PromiseExtend<T,D> {
        this.subscribe('rejects',onfulfilled);
        return this;
    }

    // ??????????????????
    private resolve(data:any){
        return this.broadcastSubscribe('resolves',data);
    }

    // ?????????????????????
    private reject(data:any) {
        this.broadcastSubscribe('rejects',data);
        return this.done();
    }

    // ??????
    done(){
        // ?????????????????????
        clearTimeout(this.triggerTimeCallback);
        // ??????????????????
        ['resolves','rejects','finallys'].map((item)=>{
            this[item] = undefined;
        });
    }

}

