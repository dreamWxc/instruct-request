import {
    RequestContxtParams,
    RequestUploadCache
} from '../type';

import Cache from '../../cache/cache';

import slicePlugin from '../index';

export default class UploadContxt implements RequestContxtParams{

    // 成功的数量
    success:Record<string,number>;
    // 剩余将被执行的分片
    surplus:Array<number>;
    // 失败的分片
    fail?:Array<number>;
    // 正在执行的分片
    running?:Record<string,number>;
    //使用的缓存类型
    cache:RequestUploadCache;
    // 是否暂停
    suspend:boolean = false;
    // 是否结束
    end:boolean = false;
    // 名称
    name:string;
    // 唯一值
    unique:string;
    // 分析文件是否纳入进度
    analysis?:number
    // 合并是否纳入进度配置
    mergeAnalysis?:number
    // 总共分片数量
    total:number;

    // 自定义存储信息
    stroage:Record<string,any>

    // 系统暂存信息
    storageContent:Record<string,any>

    // 存储
    _surplus:Array<number>

    // 定义获取 unique中
    __unique:boolean

    constructor(data?:{[key in keyof RequestContxtParams]?:RequestContxtParams[key]}){
        this.setParams(data);
    }

    clear(){
        this.storageContent = undefined;
        this.fail = undefined;
        this.end = false;
        this.suspend = false;
    }

    setParams(data?:{[key in keyof RequestContxtParams]?:RequestContxtParams[key]}){
        if(data) {
            for(let key in data) {
                this[key] = data[key];
            }
        }
        if(this.surplus) {
            // 存储 
            this._surplus = [...this.surplus];
        }
    }

    // 控制结束
    over(){
        if(!this.end)  this.end = true;
    }

    // 暂停
    pause(){
        if(this.storageContent) {
            if(!this.suspend && !this.end) {
                this.suspend = true;
            }
        } else {
            return console.error('no running upload');
        }
        
    }

    // 继续
    play(){
        if(this.suspend) {
            this.suspend = false;
            if(this.storageContent) {
                let {
                    requestConfig,
                    config,
                    fileOption
                } = this.storageContent || {};
                return slicePlugin.uploadSlice.triggerUpload(config,requestConfig,fileOption,this);
            } else {
                return console.error('no running upload');
            }
        }
    }

    // 设置成功
    setSuccessSlice(index:number){
        if(this.success === undefined) {
            this.success = {
                length:0
            }
        }
        this.success.length++;
        this.success[index] =  1;
        this.operationSurplus(index);
        if(this.running && this.running[index] !== undefined) {
            delete this.running[index];
        }
    }

    getNextSlice(){
        return this._surplus.pop();
    }

     // 注入失败
    addFail(index:number){
        this.operationSurplus(index);
        if(this.running && this.running[index] !== undefined) {
            this.running[index] = null;
        }
        if(this.fail === undefined) {
            this.fail = [index];
        } else {
            if(!this.fail.includes(index)) {
                return this.fail.push(index);
            }
        }
    }

    // 执行操作剩余数量
    operationSurplus(index:number){
        let resultIndex = this.surplus.indexOf(index);
        if(resultIndex >= 0) {
            return this.surplus.splice(resultIndex,1);
        }
    }

    // 执行存储
    setStorage(hash:string,cache:Cache){
        if(this.cache) {
            return cache.setItem(hash,{
                success: this.success,
                surplus:this.surplus,
                running: this.running,
                total: this.total,
                fail: this.fail,
                name: this.name,
                unqiue: this.unique,
                storage: this.stroage,
                analysis: this.analysis,
                mergeAnalysis: this.mergeAnalysis
            },this.cache)
        }
    }

    // 删除缓存
    removeStorage(hash:string,cache:Cache){
        if(this.cache) {
            return cache.removeItem(hash,this.cache);
        }
        
    }

}