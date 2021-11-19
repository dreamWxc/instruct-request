import {
    RequestConfigInstruction,
    InstructionPostOption,
    ResponseData,
    RequestResponse
} from '../../type';

import {
    RequestUploadInstructionFile,
    RequestUploadParams,
    RequestContxtParams,
    CacheStorageType,
    RequestUploadCache
} from './type';


import Request from '../../request';

import PromiseExtend from "../../../extend/ProsmiseExtend";

import SparkMD5 from 'spark-md5';
import Cache from '../cache/cache';
import UploadContxt from './slice/uploadContxt';
import UploadExtend from './slice/uploadExtend';

export default class UploadSlice<T,I,D> extends UploadExtend{

    constructor(private request:Request<T,D>,cache:Cache) {
        super(cache);
    }

    // 是否有可以执行
    static jurisdiction:boolean = !!(FileReader && Blob);

    // @ts-ignore
    blobSlice=File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;

    // 触发upload
    triggerUpload<childT = T,childD = D>(config:InstructionPostOption,requestConfig:I & RequestConfigInstruction<childT,I,childD>,option?:RequestUploadInstructionFile<any>,uploadContxt?:UploadContxt){
        

        if(!uploadContxt || !uploadContxt.storageContent || !uploadContxt.unique) {

            // @ts-ignore
            let fileOption:RequestUploadInstructionFile<T,I,D> = Object.assign({},option,requestConfig.file);

            let resultUploadContxt = uploadContxt || fileOption.controller;

            if(resultUploadContxt.__unique) return;

            let uploadConfig:RequestUploadParams = this.createConfig(fileOption);

            if(fileOption.merge && fileOption.mergeAnalysis) {
                uploadConfig.__merge = UploadSlice.getAddSpeedNumber(fileOption.mergeAnalysis,uploadConfig.total,fileOption);
            }

            if(fileOption.controller) {
                fileOption.controller.setParams({
                    storageContent:{
                        requestConfig,
                        config,
                        uploadConfig,
                        fileOption,
                        option
                    }
                })
            };

            
            if(resultUploadContxt) {
                resultUploadContxt.__unique = true;
            }

            this.unique(fileOption,uploadConfig,config,resultUploadContxt).then((hash)=>{
                if(resultUploadContxt) {
                    resultUploadContxt.__unique = false;
                }
                return this.triggerUnique({
                    hash,
                    config,
                    requestConfig,
                    uploadConfig,
                    fileOption
                });
            }).catch((response)=>{
                if(resultUploadContxt) {
                    resultUploadContxt.__unique = false;
                }
                config.responseData = response;
                config.status = "fail";
                return this.request.triggerPost(config,function (){
                    config = null;
                });
            });
        } else {
            let { fileOption,uploadConfig } = uploadContxt.storageContent;
            return this.triggerUnique({
                hash: uploadContxt.unique,
                config,
                requestConfig,
                uploadConfig,
                fileOption,
                uploadContxt
            });
        }        
    }

    // 触发
    triggerUnique<childT = T,childD = D>({
        hash,
        config,
        requestConfig,
        uploadConfig,
        fileOption,
        uploadContxt
    }:{
        hash:string,
        config:InstructionPostOption,
        requestConfig:I & RequestConfigInstruction<childT,I,childD>,
        uploadConfig:RequestUploadParams,
        fileOption?:RequestUploadInstructionFile<T,I,D>,
        uploadContxt?:UploadContxt
    }){
        uploadConfig.hash = hash;

        let onUploadProgress = config.requestData.onUploadProgress;

        // 如果不存在uploadContxt 触发
        if(!uploadContxt || !uploadContxt.storageContent || !uploadContxt.surplus) {

            uploadContxt = uploadContxt || fileOption.controller;

            let cache = this.getCacheParams(fileOption.cache);
            let storageContxt:RequestContxtParams;
            if(fileOption.cache) {
                let resutlStorageContxt = this.cache.getItem(hash,cache);
                if(resutlStorageContxt && resutlStorageContxt.data) {
                    storageContxt = resutlStorageContxt.data as unknown as RequestContxtParams;
                }
            }
            // 创建基本配置
            let contxt:RequestContxtParams = {
                unique:hash,
                storage: fileOption.storage,
                analysis:uploadConfig.__analysis,
                mergeAnalysis: uploadConfig.__merge,
                total: uploadConfig.total,
                cache,
                success:undefined,
                name: uploadConfig.name,
                surplus:undefined,
                storageContent:{
                    requestConfig,
                    config,
                    uploadConfig,
                    fileOption
                }
            }
    
            if(storageContxt) {
                let surplus = storageContxt.surplus;
                if(storageContxt.fail){
                    surplus.push(...storageContxt.fail);
                }
                contxt.success = storageContxt.success;
                contxt.surplus = surplus;
                contxt.name = uploadConfig.name || storageContxt.name;

                if(uploadContxt) {
                    uploadContxt.setParams(contxt);
                } else {
                    uploadContxt = new UploadContxt(contxt);
                }
                
            } else {
                let surplus = [];
                for(let i=uploadConfig.total - 1;i>=0;i--) { surplus.push(i) }
    
                contxt.surplus=surplus;
                if(uploadContxt) {
                    uploadContxt.setParams(contxt);
                } else {
                    uploadContxt = new UploadContxt(contxt);
                }
                uploadContxt.setStorage(hash,this.cache);
            }
    
        }
        
        if(uploadContxt.suspend) return;

        if(config && onUploadProgress) {
            UploadSlice.onUploadProgress(undefined,uploadConfig,uploadContxt,onUploadProgress);
        }

        // 根据模式获取开启管道数量
        let number = 0;
        switch(fileOption.mode){
            case 'all': number = uploadConfig.total;break;
            case 'many': number = fileOption.manyNumber || 1;break;
            default: number = 1;break;
        }

        if(uploadContxt.surplus.length < number) {
            number = uploadContxt.surplus.length;
        }

        const callback = (response)=> {

            // 如果为暂停 停止执行此操作
            if(uploadContxt.suspend) return;
            
            // 触发完成
            if(config && onUploadProgress) {
                UploadSlice.onUploadProgress(undefined,uploadConfig,uploadContxt,onUploadProgress);
            }

            if(fileOption.merge){
                let object = this.getRequestObject(fileOption,response,uploadConfig);
                let rule = !!(uploadConfig.__merge && onUploadProgress);
                if(rule) {
                    let toSotrageOnUploadProgress = object.onUploadProgress;
                    object.onUploadProgress = function(progress){
                        UploadSlice.mergeUploadProgress(progress,uploadConfig,onUploadProgress);
                        return toSotrageOnUploadProgress && toSotrageOnUploadProgress(progress);
                    };
                }

                this.request['$'+(object.requestMode || 'request')](object).then((response)=>{
                    // 如果可以执行
                    rule && UploadSlice.mergeUploadProgress(undefined,uploadConfig,onUploadProgress,true);
                    // 删除暂存
                    uploadContxt.removeStorage(uploadConfig.hash,this.cache);
                    return this.request.setSuccessResponseData(response,config);
                }).catch((response)=>{
                    config.responseData = response;
                    config.status = "fail";
                }).finally(()=>{
                    uploadContxt.clear();
                    return this.request.triggerPost(config,function (){
                        config = null;
                    });
                });;
            } else {
                // 删除暂存
                uploadContxt.removeStorage(uploadConfig.hash,this.cache);
                this.request.setSuccessResponseData(response,config);
                uploadContxt.clear();
                return this.request.triggerPost(config,function (){
                    config = null;
                });
            }

        };

        if(number > 0) {

            if(uploadContxt.running) {
                Object.keys(uploadContxt.running).map((item)=>{
                    if(uploadContxt.running[item] && uploadContxt.running[item]<1) {
                        number -=1;
                    }
                });
            }
            // 执行管道
            for(let i=0;i<number;i++) {
                this.queue({
                    fileOption,
                    uploadContxt,
                    config,
                    uploadConfig,
                    callback
                });
            }
        } else {
            return callback && callback({});
        }
    }


    upload<childT = T,childD = D>(requestConfig:I & RequestConfigInstruction<childT,I,childD>,option?:RequestUploadInstructionFile<any>):PromiseExtend<childT,childD> {

        let promiseExtend =  new PromiseExtend<childT,childD>((resolve,reject)=>{

            if(!UploadSlice.jurisdiction) return reject(undefined);

            // 创建配置文件
            let config = this.request.createFront(requestConfig,{
                "success":resolve,
                "fail":reject
            }) as InstructionPostOption;

            if(config) {

                return this.triggerUpload<childT,childD>(config,requestConfig,option);

            } else {
                promiseExtend = null;
                config = null;
            }
        });

        return promiseExtend;

    }

    // 合并上传进度控制
    static mergeUploadProgress(progress,uploadConfig:RequestUploadParams,onUploadProgress,success?:boolean){
        let speed = 0;
        if(progress){
            let speed = progress.loaded / progress.total;
            speed = speed > 1 ? 1 : speed;
        }

        return onUploadProgress(UploadExtend.getSpeedParams({
            loaded: uploadConfig.total + (uploadConfig.__merge * speed),
            total:uploadConfig.total,
            analysis:true,
            mergeAnalysis:success
        },uploadConfig));
        
    }

    // 获取
    protected getCacheParams(cache:CacheStorageType | RequestUploadCache):RequestUploadCache{
        if(typeof cache === 'string') {
            return {
                storage: cache
            };
        } else {
            return cache;
        }
    }

    // 请求 merge
    protected getRequestObject(fileOption,response,uploadConfig){

        if(typeof fileOption.merge === 'function') {
            return fileOption.merge(response,uploadConfig);
        } else {
            // 合并data 
            let replaceData = fileOption.merge.replaceData || fileOption.replaceData;
            if(replaceData) {
                fileOption.merge.data = Object.assign({},fileOption.merge.data,this.repleace({},replaceData,uploadConfig,['file']));
            }
            return fileOption.merge;
        }

    }

    // 执行队列
    protected queue({
        uploadContxt,
        fileOption,
        config,
        uploadConfig,
        callback
    }:{
        fileOption:RequestUploadInstructionFile<T,I,D>,
        uploadContxt:UploadContxt,
        config:InstructionPostOption,
        uploadConfig:RequestUploadParams,
        callback:(response)=>void
    }){

        // 如果处于暂停状态,暂停执行
        if(uploadContxt.suspend || uploadContxt.end) return;

        let index = uploadContxt.getNextSlice();

        if(index === undefined) return;

        // 创建使用配置
        let resultUploadConfig:RequestUploadParams ={
            ...uploadConfig,
            file: this.slice(fileOption,index,uploadConfig),
            index
        }

        if(uploadContxt.running === undefined) {
            uploadContxt.running = {};
        }
        // 注入进入running状态
        uploadContxt.running[index] = 0;

        // 合并data 
        let replaceData = fileOption.replaceData;
        if(replaceData) {
            config.requestData.data = this.repleace(config.introduces.data,replaceData,resultUploadConfig);
        }

        let onUploadProgress = config.requestData.onUploadProgress;
        let useUploadProgress;
        if(onUploadProgress) {
            useUploadProgress = (params)=>{
                return UploadSlice.onUploadProgress(params,resultUploadConfig,uploadContxt,onUploadProgress);
            };
        }

        return this.request.upload<ResponseData,ResponseData>(Object.assign({},config.requestData,{rest:false,onUploadProgress:useUploadProgress})).then((response)=>{
                // 如果仍然存在分片触发
                if(this.request.verificationSuccessful(response,fileOption,config)) {
                    uploadContxt.setSuccessSlice(resultUploadConfig.index);
                    if(uploadContxt._surplus.length > 0){ 
                        return this.queue({
                            uploadContxt,
                            fileOption,
                            config,
                            uploadConfig,
                            callback
                        });
                     }else {
                        // 如果不处于暂停,执行暂停
                        if(!uploadContxt.end) {
                            uploadContxt.over();
                        }
        
                        if(uploadContxt.end && uploadContxt.surplus.length > 0) {
                            return;
                        } else {
                            return callback && callback(response);
                        }
                    }
                    
                    
                } else {
                    uploadContxt.addFail(resultUploadConfig.index);
                    this.request.setSuccessResponseData(response,config);
                    return this.request.triggerPost(config,function (){
                        config = null;
                    });
                }
             
        }).catch((response)=>{
            uploadContxt.addFail(resultUploadConfig.index);
            config.responseData = response;
            config.status = "fail";
            return this.request.triggerPost(config,function (){
                config = null;
            });
        }).finally(()=>{
            if(!uploadContxt.end) {
                // 执行记录
                return uploadContxt.setStorage(resultUploadConfig.hash,this.cache);
            }
        });

    }

    // 上传进度控制
    static onUploadProgress(progress,resultUploadConfig:RequestUploadParams,uploadContxt:UploadContxt,onUploadProgress){
        
        return setTimeout(function(){

            if(progress && uploadContxt.running[resultUploadConfig.index] !== null){
                // 获取当前进度
                if(!uploadContxt.success || !uploadContxt.success[resultUploadConfig.index]) {
                    let speed = progress.loaded / progress.total;
                    speed = speed > 1 ? 1 : speed;
                    uploadContxt.running[resultUploadConfig.index] = speed;
                }
            }

            // 如果处于暂停状态停止执行
            if(uploadContxt.suspend || uploadContxt.end) return;

            let loaded;

            if(uploadContxt.running) {
                loaded = Object.keys(uploadContxt.running).reduce((value,key)=> {
                    if(uploadContxt.running[key] !== null && (!uploadContxt.success || !uploadContxt.success[key])) {
                        return (uploadContxt.running[key] || 0) + value
                    }
                    return value;
                },uploadContxt.success ? uploadContxt.success.length : 0);
            } else {
                loaded = uploadContxt.success.length;
            }
            
            
            return onUploadProgress(UploadExtend.getSpeedParams({
                loaded: loaded > resultUploadConfig.total ? resultUploadConfig.total : loaded,
                total:resultUploadConfig.total,
                analysis:true
            },resultUploadConfig));
        });
        
    }

    // 替换
    repleace(data:Record<string,any>={},replaceData:{
        [key in string]: keyof RequestUploadParams
    },resultUploadConfig:RequestUploadParams,noIncludes?:Array<string>){

        for(let key in replaceData) {
            if(replaceData.hasOwnProperty(key)) {
                if(!noIncludes || !noIncludes.includes(key)) {
                    data[key] = resultUploadConfig[replaceData[key]]
                }
            }
        }

        return data;
    }

    // 创建配置
    createConfig(fileOption:RequestUploadInstructionFile<T,I,D>):RequestUploadParams{
        return  {
            index:0,
            total: Math.ceil(fileOption.file.size / fileOption.splitSize),
            size: fileOption.file.size,
            file: fileOption.file,
            name: fileOption.name || (fileOption.file as File).name,
            hash:''
        };
    }

    // 获取增加 % 数量
    static getAddSpeedNumber(number:number,total:number,fileOption:any){
        
        let speed = 100 - (fileOption.analysis || 0) - (fileOption.mergeAnalysis || 0);

        speed = speed < 0 ? 0 : speed;

        return total / speed * number;

    }

    // 获取唯一值
    unique(fileOption:RequestUploadInstructionFile<T,I,D>,config:RequestUploadParams,requestConfig?:InstructionPostOption,uploadContxt?:UploadContxt):Promise<string>{
        return new Promise<string>((relove,reject)=> {

            if(fileOption.analysis) {
                config.__analysis = UploadSlice.getAddSpeedNumber(fileOption.analysis,config.total,fileOption);
            }
            if(fileOption.unique) {

                if((uploadContxt && !uploadContxt.suspend) && requestConfig && requestConfig.requestData.onUploadProgress && config.__analysis) {
                    requestConfig.requestData.onUploadProgress(UploadExtend.getSpeedParams({
                        loaded: config.__analysis,
                        total: config.total + config.__analysis,
                    },config));                    
                }
                if(uploadContxt) {
                    uploadContxt.setParams({unique:fileOption.unique});
                }
                return relove(fileOption.unique);
            } else {
                let fileReader = new FileReader();
                let spark = new SparkMD5.ArrayBuffer();
            
                let currentChunk = config.index;

                fileReader.onload = function (e) {
                    spark.append(e.target.result);
                    currentChunk++;

                    if((uploadContxt && !uploadContxt.suspend) && requestConfig && requestConfig.requestData.onUploadProgress && config.__analysis) {
                        requestConfig.requestData.onUploadProgress(UploadExtend.getSpeedParams({
                            loaded: config.__analysis * (currentChunk / config.total),
                            total: config.total + config.__analysis
                        },config));
                    }

                    if (currentChunk < config.total) {
                        return loadNext();
                    } else {

                        let hash = spark.end();

                        if(uploadContxt) {
                            uploadContxt.setParams({unique:hash});
                        }
                        return relove(hash);
                    }
                };
                fileReader.onerror = reject;
                const loadNext =()=>{
                    return fileReader.readAsArrayBuffer(this.slice(fileOption,currentChunk,config));
                }
                loadNext();
            }

        })
    }

    slice(fileOption,index:number,config:RequestUploadParams){
        let start = index * fileOption.splitSize,
        end = ((start + fileOption.splitSize) >= config.size) ? config.size : start + fileOption.splitSize;
        return this.blobSlice.call(fileOption.file,start,end);
    }

}