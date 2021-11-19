/*
    验证类
*/

import { VerificationTrigger,VerificationItemTip,VerificationPresetFormatTrigger,VerificationPresetFormatOption,VerificationTriggerFunction,VerificationMode,VerificationBuiltFormat,VerificationItem,VerificationRulesArg,VerificationTriggerRetrun,VerificationResult,VerificationTriggerArg } from './type';

import {
    VerificationOption
} from '../type';

import verificationRules from './rules';
import format from './format';


class Verification <T=Record<string,any>,D=Record<string,any>>{

    constructor(rules?:{[ key in keyof T]:VerificationTriggerFunction<T[key]>},formats?:{ [key in keyof D]:VerificationBuiltFormat<D[key]> }){
        formats && this.addFormats(formats);
        rules && this.addRules<T>(rules);
    }

    // 校验规则
    protected verificationRules:VerificationTrigger=Object.assign({},verificationRules);

    // 格式处理
    protected format:VerificationPresetFormatTrigger =Object.assign({},format)

    // 创建 data 除了增加提示，无任何其他作用
    createdData(data:Array<VerificationItemTip<T,D>>):Array<VerificationItem>{
        return data as Array<VerificationItem>;
    }

    // 创建 item 除了增加提示，无任何其他作用
    createdItem(data:VerificationItemTip<T,D>):VerificationItem{
        return data as VerificationItem;
    }


    // 增加规则
    addRules<chilT>(rules:{[ key in keyof chilT]:VerificationTriggerFunction<chilT[key]>}):Verification<T,D>{
        Object.keys(rules).map((item)=> {
            if(item && typeof rules[item] === 'function') {
                this.verificationRules[item] = rules[item];
            }
        });
        return this;
    }

    // 添加格式处理
    addFormats<chilD>(formats:{ [key in keyof chilD]:VerificationBuiltFormat<chilD[key]> }):Verification<T,D>{
        Object.keys(formats).map((item)=> {
            if(item && typeof formats[item] === 'function') {
                this.format[item] = formats[item];
            }
        });
        return this;
    }

    // 获取某一个的校验结果
    verificationTriggerTarget<T extends keyof VerificationMode = 'default'>(supperKey:number |string,key:string,index:number,option:VerificationTriggerArg<T>):VerificationResult{

        let unique:number|string;
        if(key !== undefined) {
            // 查找是否存在校验过的记录
            if(option.relativeResult && option.relativeResult[key]) {
                return option.result[key] ? option.result[key].result : undefined;
            } else {
                // 进行校验查找
                Verification.map(option,(useUnqiue,useItem)=>{
                    let useKey = Verification.getExportKey(useItem,key);
                    if(useKey === key) {
                        unique = useUnqiue;
                        return false;
                    }
                },option.index + 1);
            }
        } else if(index !== undefined){
            // 进行校验查找
            Verification.map(option,(useUnqiue)=>{
                unique = useUnqiue;
                return false;
            },index);

            if(option.hasResult && option.hasResult[unique]) {
                return option.result[option.hasResult[unique]] ? option.result[option.hasResult[unique]].result : undefined;
            }
        }

        if(unique !== undefined){
            option.look = supperKey;
            let result = this.verificationTrigger(unique,option);

            return result.result ? result.result : undefined;
        }

    }

    // 校验
    verification<T extends keyof VerificationMode = 'default'>(option:VerificationOption<T>):VerificationMode[T]{

        let triggerArg:VerificationTriggerArg<T> = {
            data: !option.data && option.item ? [option.item] : option.data,
            hasResult:undefined,
            relativeResult:undefined,
            resultOrder:undefined,
            resultValues:undefined,
            result:undefined,
            resultFail:undefined,
            option:option,
            look:undefined,
            index:undefined
        };
        
        Verification.map(triggerArg,(key,item,index)=>{

            triggerArg.index = index;

            let result:VerificationTriggerRetrun =  this.verificationTrigger<T>(key,triggerArg);
            // 获取校验结果
            if(result && result.result){
                // 校验是否可以继续执行
                if(option.next) {
                    return option.next(result.result,item,triggerArg.resultValues);
                }
                // 返回是否继续执行
                return Verification.checkVerificationtNext(result.result.verification,option.mode);
            }
        });
    
        let endResult = Verification.returnVerificationResult<T>(triggerArg);

       
        // 执行回调函数
        if(triggerArg.resultFail) {
            triggerArg.option.cache && triggerArg.option.cache(endResult);
        } else {
            if(triggerArg.option.complete) {
               let result = triggerArg.option.complete(endResult);
               if(result) endResult = result;
            }            
        }

        return endResult;

    }

    // 校验一条
    protected verificationTrigger<T extends keyof VerificationMode = 'default'>(key:number|string,option:VerificationTriggerArg<T>):VerificationTriggerRetrun{
    
        // 如果被校验过了 直接返回
        if(option.hasResult && option.hasResult[key]) {
            return option.result[option.hasResult[key]];
        }

        // 如果目前的key上锁停止向下执行
        if(option.look === key) return undefined;

        let item = option.data[key];

        // 获取校验规则
        let rules:VerificationRulesArg = Verification.createRules<T>(option.data[key],option.option);
        
        let result = undefined;

        // 如果存在校验规则触发
        if(rules) {
            let resultRules:Array<VerificationResult> = undefined;
            let value = this.getValue(option.data[key],option.data[key].value,'beforeFormat',Verification.getExportKey(option.data[key],key),option);
            let resultBoolean = true;
            
            for(let ruleKey in rules) {
                
                if(rules.hasOwnProperty(ruleKey) && this.verificationRules[ruleKey]) {
                    
                    let result = this.verificationRules[ruleKey]({
                        arg:option,
                        key:key,
                        item:option.data[key],
                        value: value,
                        option:rules[ruleKey]
                    },this);

                    if(!result) {
                        if(resultBoolean){
                            resultBoolean = result;
                        }
                        // 添加校验规则
                        if(resultRules === undefined) resultRules = [];
                        resultRules.push({
                            verification:result,
                            item,
                            ruleKey:ruleKey as keyof VerificationRulesArg,
                            tip: Verification.getTips(rules[ruleKey],item[option.option.tipKey])
                        });

                    }

                    
                    // 查看是否继续执行
                    if(!Verification.checkResultNext(result,option.option.mode)) break;
                }
            }
            
            if(resultRules || resultBoolean) {
                result = {
                    resultFails:resultRules || [],
                    result:  resultBoolean ? {
                        verification:true,
                        value: this.getValue(item,value,'format',Verification.getExportKey(item,key),option)
                    }:resultRules ? resultRules[0] :undefined
                }
            }

        }

        // 执行保存相关内容
        Verification.preservation<T>(key,result,option);
        return result;
        

    }

    // 根据校验规则，查看 是否继续执行rules 校验
    static checkResultNext(result:boolean,mode:keyof VerificationMode):boolean{
        switch(mode) {
            default : return result;
        }
    }

    // 获取 value
    getValue<T extends keyof VerificationItem='beforeFormat',D extends keyof VerificationMode = 'default'>(item:VerificationItem,value:any,type:T,useKey:string,option:VerificationTriggerArg<D>):any {

        let resultFormat:VerificationItem[T] = item[type];

        if(typeof resultFormat === 'function') {
            let resultValue = resultFormat(value,useKey,item,option.resultValues);
            return resultValue === undefined ? value : resultValue
        } else if(resultFormat) {
            if(typeof resultFormat === 'string') resultFormat = {trigger:resultFormat};
            let resultUseFormat:VerificationPresetFormatOption<any> = resultFormat;
            if(this.format[resultUseFormat.trigger]) {
                let resultValue =  this.format[resultUseFormat.trigger](value,resultUseFormat.option);

                return resultValue === undefined ? value : resultValue
            };
        }

        return value;
    }

    // 获取 tips
    static getTips(option:string | {tip:string},defaultTip:string):string{
        return (option && typeof option === 'object' ? option.tip : option as string) || defaultTip || ''
    }

    // 根据规则返回校验结果
    static returnVerificationResult<T extends keyof VerificationMode = 'default'>(option:VerificationTriggerArg<T>):VerificationMode[T]{

        switch(option.option.mode) {
            case 'end': return {
                verification: option.resultFail ? false : true,
                result:option.resultOrder.map((item)=> {
                    return option.result[item].result;
                }),
                value: option.resultFail ? undefined :option.resultValues,
                item:undefined
            };
            case 'default': return option.resultFail ? option.resultFail[0].result : { verification:true,value:option.resultValues,item:undefined };
        }

    }

    // 根据校验规则，查看 是否继续执行rules 校验
    static checkVerificationtNext(result:boolean,mode:keyof VerificationMode){
        switch(mode) {
            case 'end': return true;
            default : return result;
        }
    }

    // 上锁
    static Lock<T extends keyof VerificationMode = 'default'>(key:number | string,option:VerificationTriggerArg<T>){
        option.look = key;
    }

    // 获取key
    static getExportKey(item:VerificationItem,key:number | string):string{
        return item.exportKey || item.key || (key.toString());
    }

    // 保存内容
    static preservation<T extends keyof VerificationMode = 'default'>(key:string | number,result:VerificationTriggerRetrun,triggerArg:VerificationTriggerArg<T>){


        if(triggerArg.look) {
            triggerArg.look = undefined;
        }

        // 获取item
        let item:VerificationItem = triggerArg.data[key];

        // 获取导出key
        let exportKey:string = Verification.getExportKey(item,key);

        // 注入相关参数
        if(triggerArg.hasResult === undefined){ triggerArg.hasResult = {} };
        // 注入相关校验结果
        triggerArg.hasResult[key] = exportKey;

        // 注入相关参数
        if(triggerArg.relativeResult === undefined){ triggerArg.relativeResult = {} };
        // 注入相关校验结果
        triggerArg.relativeResult[exportKey] = key;

        // 增加注入结果集
        if(result) {
            if(triggerArg.result === undefined) triggerArg.result = {};
            triggerArg.result[exportKey] = result;
    
            // 增加排序
            if(triggerArg.resultOrder === undefined) triggerArg.resultOrder = [exportKey];
            else if(!triggerArg.resultOrder.includes(exportKey)) triggerArg.resultOrder.push(exportKey);
    
            // 注入结果
            if(result.result){

                if(result.result.verification) {
                    if(triggerArg.resultValues === undefined) triggerArg.resultValues = {};
                
                    triggerArg.resultValues[exportKey] =result.result.value;
                } else {
                    if(triggerArg.resultFail === undefined) triggerArg.resultFail = [result];
                    else triggerArg.resultFail.push(result);
                }
                
                
            }
        }
        


    }

    // 获取校验规则
    static createRules<T extends keyof VerificationMode = 'default'>(item:VerificationItem,option?:VerificationOption<T>):VerificationRulesArg{
        if('rules' in item) {
            if(typeof item.rules === 'string') {
                let ruleTip:string = item.rules ? item.rules : item[option && option.tipKey || 'placeholder'];
                if(ruleTip && typeof ruleTip === 'string') return {emptyTrim:ruleTip};

            } else {
                return item.rules;
            }
        }
    }

    // 循环执行校验结果
    static map<T extends keyof VerificationMode = 'default'>(option:VerificationTriggerArg<T>,callback:(key:number | string,item:VerificationItem,index:number)=>boolean | void,initIndex:number=0) {

        if(option.data) {
            if(!Array.isArray(option.data) && option.keys === undefined) option.keys = Object.keys(option.data);
            let isArray = !option.keys;
            let data = isArray ? option.data : option.keys ;
            // 如果未数组触发
            for(let i=initIndex,count=data.length;i<count;i++) {
                if(callback(isArray ? i : data[i],isArray ? data[i] : option.data[data[i]],i) === false) break;
            }
        }

    }

}

export default Verification;