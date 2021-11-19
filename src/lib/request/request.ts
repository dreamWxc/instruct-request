import {AxiosError, AxiosInstance, default as axios} from 'axios';

import {
    RequestConfigInstruction,
    ResponseData,
    RequestPlugin,
    InstructionPostOption,
    ResponseSuccess,
    InstructionOption,
    ExitTriggers,
    InstructionExit,
    ResponseTypeStatus,
    RequestResponse,
    RequestPluginExtends,
    RequestMessageOption,
    RequestAgentFunction,
    ReuqestAgentTypeName,
    DefaultRequestConfigInstruction
} from './type.d';

import Instructions, {
    InstructionType,
    InstructionConfigObject,
    InstructionConfig,
    InstructionTriggerType
} from '../instructions/index';

import SparkMD5 from "spark-md5";

import PromiseExtend from "../extend/ProsmiseExtend";

let signObject = {};
['url','data','headers','method','responseCode','codeKey','rest','params','responseType','xsrfCookieName','xsrfHeaderName','maxContentLength','maxBodyLength','maxRedirects','socketPath','httpAgent','httpsAgent','cancelToken','baseURL','auth','timeoutErrorMessage'].map((item)=>{
    signObject[item] = 1;
});

export default class Request<warpT=RequestResponse,warpD=AxiosError<DefaultRequestConfigInstruction>,warpE extends DefaultRequestConfigInstruction=DefaultRequestConfigInstruction> extends Instructions{

    protected defaultConfig:RequestConfigInstruction<warpT,warpD,warpE>= {
        responseCode:[200],
        codeKey:'code',
        rest:true
    }

    public message(key:RequestMessageOption,requestConfig:InstructionPostOption,option:string | {content:string,duration?:number,onClose?:Function}){

        let config = this.getConfig('message',requestConfig);

        let triggerFunction = config && config[key] || this.config.message && this.config.message[key];

        // 如果存在触发函数
        if(triggerFunction) {
            if(typeof option === 'string') option = {content:option};

            return triggerFunction(option.content,option.duration,option.onClose);
        }
    }

    // @ts-ignore
    public push(instruction:InstructionConfig<InstructionPostOption>,name:string='default',triggerType?:InstructionTriggerType,zIndex:number =0):InstructionConfigObject<InstructionPostOption>{
        return  super.push<InstructionPostOption>(instruction, name, triggerType, zIndex);
    }

    // 默认的配置器
    protected config:RequestConfigInstruction<warpT,warpE,warpD>

    // 接口请求器
    public $request:AxiosInstance;

    // 创建配置文件
    constructor(config:RequestConfigInstruction<warpT,warpE,warpD>) {
        super();
        // 创建配置文件
        if (config) {
            // 创建配置文件
            config = Object.assign({},this.defaultConfig,config);
        } else {
            // @ts-ignore
            config = Object.assign({},this.defaultConfig);
        }
        // 创建请求对象
        this.$request = axios.create(config);
        // 存储配置文件
        this.config = config;
    }
    // 签名列表
    protected signObject:Record<string, number> = signObject;
    // 创建签名
    protected sign(requestConfig:DefaultRequestConfigInstruction):string{
        let keys  = Object.keys(requestConfig);
        let sign = '';
        for (let i=0,count=keys.length;i<count;i++) {

            if (this.signObject[keys[i]] && requestConfig[keys[i]] !== undefined) {
                let type = typeof requestConfig[keys[i]];
                if (type === 'object') {
                    try {
                        sign += JSON.stringify(requestConfig[keys[i]]);
                    } catch (e) {
                        sign += requestConfig[keys[i]];
                    }
                } else if (type === 'string') {
                    sign += type;
                } else {
                    sign += requestConfig[keys[i]]
                }
            }
        }

        return  SparkMD5.hash(sign);
    }
    // 执行指令
    public createFront(requestConfig:DefaultRequestConfigInstruction,triggers:ExitTriggers,callback?:Function):InstructionOption | void{

        // 创建退出函数
        const exit: InstructionExit = <InstructionExit<ResponseData>>function (value, status = "none", end: boolean = true) {

            if (!exit.next) return;
            if (status === "none") {
                console.info('request exit:', value);
                end = true;
            }
            let trigger = exit.triggers[status];
            if (end) {
                exit.triggers = null;
                exit.next = false;
            }

            return trigger && trigger(value);
        };
        exit.triggers = triggers;
        exit.next = true;

        // 创建配置指令
        let config:InstructionOption = {
            exit: exit,
            // @ts-ignore
            requestData: requestConfig,
            sign: "",
            status: "loading",
            // @ts-ignore
            introduces: requestConfig
        }

        // 执行入口设置
        if (this.triggerInstruction<InstructionOption>(this.agentSearch(config,"entry"),config)) {

            callback && callback();

            config = Object.assign(config,{
                introduces:Object.assign({},config.introduces),
                sign:this.sign(config.requestData)
            });
            // 返回执行
            if (this.triggerInstruction<InstructionOption>(this.agentSearch(config,"front"),config)) {
                return config;
            }
        }

    }
    // 执行搜索代理
    protected agentSearch<T extends InstructionOption>(config:T,type:InstructionType = "front"):Array<InstructionConfigObject>{
        config.type = type;
        return this.search(config.introduces,config,type);
    }
    // 执行
    protected triggerInstruction<T extends InstructionOption>(data: Array<InstructionConfigObject>, option: T): boolean {
        let resultOption = option;
        option = Object.assign({},option);
        for (let i=0,count=data.length;i<count;i++) {
            data[i].trigger(option);
            if (!option.exit.next) {
                return false;
            }
        }

        resultOption.extend = option.extend;
        return true;

    }
    // 执行后续
    public triggerPost(config:InstructionPostOption,callback?:Function,end:boolean=true){
        // 执行后置处理
        if (this.triggerInstruction<InstructionPostOption>(this.agentSearch(
            config,
            "post"
        ),config)) {
            let status:ResponseTypeStatus = config.status === "success" ? "success" : "fail"

            if(status === 'fail' && config.responseData.constructor && config.responseData.constructor.name === 'Cancel') {
                config.responseData = {
                    data:null,
                    status: 500,
                    statusText: (config.responseData as any).message,
                    config:undefined,
                    headers:undefined,
                    custom:true,
                    cancel:true
                };
            }
            // 执行相应的处理
            if (this.triggerInstruction<InstructionPostOption>(this.agentSearch(
                config,
                status
            ),config)) {
                let exit = config.exit;
                let responseData = this.getSuccessDataMode(config);
                delete config.extend;
                config = null;
                return exit(responseData,status,end);
            }
        }

        return  callback && callback();
    }

    // 如果为成功执行设置数据
    getSuccessDataMode(config:InstructionPostOption){

        if (config.status !== 'success') return config.responseResultData || config.responseData;

        let responseData = config.responseResultData;

        let ResponseData = function (obj:any,isObject:boolean) {
            if (isObject) {
                for (let key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        this[key] = obj[key];
                    }
                }
            } else {
                this.data = obj;
            }
        };

        let isObject = responseData && typeof responseData === 'object' && !(responseData instanceof Array);

        if (isObject) config.responseExtendChain.__isObject = isObject;

        ResponseData.prototype = config.responseExtendChain;
        responseData = new ResponseData(responseData,isObject);

        return responseData;

    }

    // 请求
    request<T=warpT,D=warpD>(requestConfig:DefaultRequestConfigInstruction):PromiseExtend<T,D>{

        let promiseExtend = new PromiseExtend<T,D>( (resolve, reject)=> {

            // 创建配置文件
            let config = this.createFront(requestConfig,{
                "success":resolve,
                "fail":reject
            }) as InstructionPostOption;

            if (config) {
                return this.$request(config.requestData).then((response)=>{
                    return this.setSuccessResponseData(response,config);
                }).catch((response)=>{
                    config.responseData = response;
                    config.status = "fail";
                }).finally(()=>{
                    return this.triggerPost(config,function (){
                        promiseExtend = null;
                        config = null;
                    });
                });
            } else {
                promiseExtend = null;
                config = null;
            }
        });

        return promiseExtend;

    }

    // 上传文件
    upload<T=warpT,D=warpD>(requestConfig:DefaultRequestConfigInstruction):PromiseExtend<T,D>{

        let promiseExtend = new PromiseExtend<T,D>( (resolve, reject)=> {

            // 创建配置文件
            let config = this.createFront(requestConfig,{
                "success":resolve,
                "fail":reject
            }) as InstructionPostOption;

            if (config) {
                return this.$request({
                    ...requestConfig,
                    data:function() {
                        if(requestConfig.data) {
                            let formData = new FormData();
                            for(let key in requestConfig.data) {
                                if(requestConfig.data.hasOwnProperty(key)) {
                                    formData.append(key,requestConfig.data[key]);
                                }
                            }
                            return formData;
                        } else {
                            return undefined;
                        }
                    }(),
                    headers:{
                        'content-type':'multiple/form-data',
                        ...(requestConfig.headers || {})
                    }
                }).then((response)=>{
                    this.setSuccessResponseData(response,config);
                }).catch((response)=>{
                    config.responseData = response;
                    config.status = "fail";
                }).finally(()=>{
                    return this.triggerPost(config,function (){
                        promiseExtend = null;
                        config = null;
                    });
                });
            } else {
                promiseExtend = null;
                config = null;
            }
        });

        return promiseExtend;
    }

    // 代理表
    agentData:{[key in ReuqestAgentTypeName]?:RequestAgentFunction<any,any,any>};

    // 获取代表
    getAgentTarget<T,I,D>(name:ReuqestAgentTypeName):RequestAgentFunction<T,I,D>{
        if(!this.agentData) return;
        return this.agentData[name];
    }

    // 代理
    agent<T extends warpT=warpT,D extends warpD = warpD>(name:ReuqestAgentTypeName,target:RequestAgentFunction<T,any,D>){
        if(this.agentData === undefined) this.agentData={};
        this.agentData[name] = target;
    }

    // 安装插件
    use<T>(plugin:RequestPlugin,option?:T){
        plugin.install(this as any,option);
        plugin.extendName && plugin.extend && this.insertExtend(plugin);
        return this;
    }

    // 插入
    insertExtend(plugin:RequestPlugin){
        if (plugin.extendName && plugin.extend) {
            if (!this.extendValues) this.extendValues = {};
            this.extendValues[plugin.extendName] = {
                trigger:plugin.extend,
                option:plugin.extendOption
            };
        }
    }

    // 扩展开放属性
    extendValues:Record<string, RequestPluginExtends>;

    // 获取配置
    getConfig<T extends keyof warpE>(key:T,config?:InstructionPostOption,option?:{[key in T]?:warpE[T]}):warpE[T] | void{

        if(option && option[key]){ return  option[key] }
        if (config && config.introduces.hasOwnProperty(key)) return  config.introduces[key as keyof DefaultRequestConfigInstruction];
        if (this.config.hasOwnProperty(key)) {
            return this.config[key as keyof DefaultRequestConfigInstruction];
        } else {
            return;
        }
    }

    // 注册扩展模块
    registerExtend<T=any,D=any>(that:RequestPlugin,config:InstructionPostOption,option?:T,resultOption?:D){
        return that.registerExtend && that.registerExtend(config.responseExtendChain,option,resultOption,config);
    }

    // 获取扩展配置
    getExtend<T>(that:RequestPlugin,config:InstructionPostOption):T | undefined {

        if (config.extend) {
            return config.extend[that.extendName];
        }

        return  undefined;

    }

    // 设置扩展配置
    setExtend<T>(that:RequestPlugin,value:T,config:InstructionPostOption){
        if (!config.extend) config.extend = {};
        config.extend[that.extendName] = value;
    }

    // 开放函数 校验是否为 成功
    verificationSuccessful(response:ResponseData,option:ResponseSuccess,config:InstructionPostOption):boolean{

        // 获取校验函数
        let customCheck = option.customCheck || this.getConfig('customCheck',config);

        if (customCheck) {
            return customCheck(response,option);
        } else {

            if (!response.data) return false;

            // 获取成功状态码
            let responseCode = option.hasOwnProperty('responseCode') ? option.responseCode : this.getConfig('responseCode',config);
            // 获取 codeKey
            let codeKey = option.codeKey || this.getConfig('codeKey',config);

            
            if(codeKey) {
                // 返回执行结果
                if (!responseCode || (responseCode as Array<any>).length <= 0) return true;
                try {
                    return (responseCode as Array<any>).includes(response.data[codeKey]);
                } catch (e) {
                    return  false;
                }
            } else {
                return false;
            }

        }

    }

    // 设置成功的数据
    setSuccessResponseData(response:ResponseData,config:InstructionPostOption){
        config.status = 'success';
        config.responseData = response;
        config.responseRestData = response.data;

        config.responseExtendChain = {
            __sign:config.sign,
            isSuccess: this.verificationSuccessful(response, Object.assign({},this.config,config.requestData),config)
        };
        // 是否展开
        let rest = this.getConfig('rest',config);

        if (rest) {
            config.responseResultData = response.data;
        } else {
            config.responseResultData = response;
        }

    }

}
