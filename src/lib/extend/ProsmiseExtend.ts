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

    // 获取
    private triggerTimeCallback:any;

    // 构造
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

    // 成功的事件收集
    private resolves:Array<Function> = undefined;

    // 失败的事件收集
    private rejects:Array<Function> = undefined;

    // 完成的事件收集
    private finallys:Array<Function> = undefined;

    // 创建订阅收集机制
    private subscribe(key:'resolves'|'rejects'|'finallys',callback:Function):number {
        if(this[key] === undefined) this[key] = [];
        // 执行收集
        return this[key].push(callback);
    }

    // 广播
    private broadcastSubscribe(key:'resolves'|'rejects',data:any){
        this[key] &&  this.broadcast(key,data);
        return this['finallys'] && this.broadcast('finallys',data);
    }

    // 广播执行器
    private broadcast(key:'resolves'|'rejects'|'finallys',data:any){
        let resultData = data;
        this[key].map((item)=> {
            resultData = item(resultData);
        });
    }

    // 成功的开放函数
    // @ts-ignore
    public then(onfulfilled?:(data:T)=>void | undefined  | null):PromiseExtend<T,D>{
        this.subscribe('resolves',onfulfilled);
        return this;
    }

    // 完成的开放函数
    // @ts-ignore
    public finally(onfulfilled?:Function):PromiseExtend<T,D>{
        this.subscribe('finallys',onfulfilled);
        return this;
    }

    // 失败的开放函数
    // @ts-ignore
    public catch(onfulfilled?:(data:D)=>void | undefined  | null):PromiseExtend<T,D> {
        this.subscribe('rejects',onfulfilled);
        return this;
    }

    // 构造成功函数
    private resolve(data:any){
        return this.broadcastSubscribe('resolves',data);
    }

    // 失败的构造函数
    private reject(data:any) {
        this.broadcastSubscribe('rejects',data);
        return this.done();
    }

    // 完成
    done(){
        // 清除计数器操作
        clearTimeout(this.triggerTimeCallback);
        // 清空所有回调
        ['resolves','rejects','finallys'].map((item)=>{
            this[item] = undefined;
        });
    }

}

