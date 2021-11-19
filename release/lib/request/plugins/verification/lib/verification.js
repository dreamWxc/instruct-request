/*
    验证类
*/
import verificationRules from './rules';
import format from './format';
class Verification {
    constructor(rules, formats) {
        formats && this.addFormats(formats);
        rules && this.addRules(rules);
    }
    // 校验规则
    verificationRules = Object.assign({}, verificationRules);
    // 格式处理
    format = Object.assign({}, format);
    // 创建 data 除了增加提示，无任何其他作用
    createdData(data) {
        return data;
    }
    // 创建 item 除了增加提示，无任何其他作用
    createdItem(data) {
        return data;
    }
    // 增加规则
    addRules(rules) {
        Object.keys(rules).map((item) => {
            if (item && typeof rules[item] === 'function') {
                this.verificationRules[item] = rules[item];
            }
        });
        return this;
    }
    // 添加格式处理
    addFormats(formats) {
        Object.keys(formats).map((item) => {
            if (item && typeof formats[item] === 'function') {
                this.format[item] = formats[item];
            }
        });
        return this;
    }
    // 获取某一个的校验结果
    verificationTriggerTarget(supperKey, key, index, option) {
        let unique;
        if (key !== undefined) {
            // 查找是否存在校验过的记录
            if (option.relativeResult && option.relativeResult[key]) {
                return option.result[key] ? option.result[key].result : undefined;
            }
            else {
                // 进行校验查找
                Verification.map(option, (useUnqiue, useItem) => {
                    let useKey = Verification.getExportKey(useItem, key);
                    if (useKey === key) {
                        unique = useUnqiue;
                        return false;
                    }
                }, option.index + 1);
            }
        }
        else if (index !== undefined) {
            // 进行校验查找
            Verification.map(option, (useUnqiue) => {
                unique = useUnqiue;
                return false;
            }, index);
            if (option.hasResult && option.hasResult[unique]) {
                return option.result[option.hasResult[unique]] ? option.result[option.hasResult[unique]].result : undefined;
            }
        }
        if (unique !== undefined) {
            option.look = supperKey;
            let result = this.verificationTrigger(unique, option);
            return result.result ? result.result : undefined;
        }
    }
    // 校验
    verification(option) {
        let triggerArg = {
            data: !option.data && option.item ? [option.item] : option.data,
            hasResult: undefined,
            relativeResult: undefined,
            resultOrder: undefined,
            resultValues: undefined,
            result: undefined,
            resultFail: undefined,
            option: option,
            look: undefined,
            index: undefined
        };
        Verification.map(triggerArg, (key, item, index) => {
            triggerArg.index = index;
            let result = this.verificationTrigger(key, triggerArg);
            // 获取校验结果
            if (result && result.result) {
                // 校验是否可以继续执行
                if (option.next) {
                    return option.next(result.result, item, triggerArg.resultValues);
                }
                // 返回是否继续执行
                return Verification.checkVerificationtNext(result.result.verification, option.mode);
            }
        });
        let endResult = Verification.returnVerificationResult(triggerArg);
        // 执行回调函数
        if (triggerArg.resultFail) {
            triggerArg.option.cache && triggerArg.option.cache(endResult);
        }
        else {
            if (triggerArg.option.complete) {
                let result = triggerArg.option.complete(endResult);
                if (result)
                    endResult = result;
            }
        }
        return endResult;
    }
    // 校验一条
    verificationTrigger(key, option) {
        // 如果被校验过了 直接返回
        if (option.hasResult && option.hasResult[key]) {
            return option.result[option.hasResult[key]];
        }
        // 如果目前的key上锁停止向下执行
        if (option.look === key)
            return undefined;
        let item = option.data[key];
        // 获取校验规则
        let rules = Verification.createRules(option.data[key], option.option);
        let result = undefined;
        // 如果存在校验规则触发
        if (rules) {
            let resultRules = undefined;
            let value = this.getValue(option.data[key], option.data[key].value, 'beforeFormat', Verification.getExportKey(option.data[key], key), option);
            let resultBoolean = true;
            for (let ruleKey in rules) {
                if (rules.hasOwnProperty(ruleKey) && this.verificationRules[ruleKey]) {
                    let result = this.verificationRules[ruleKey]({
                        arg: option,
                        key: key,
                        item: option.data[key],
                        value: value,
                        option: rules[ruleKey]
                    }, this);
                    if (!result) {
                        if (resultBoolean) {
                            resultBoolean = result;
                        }
                        // 添加校验规则
                        if (resultRules === undefined)
                            resultRules = [];
                        resultRules.push({
                            verification: result,
                            item,
                            ruleKey: ruleKey,
                            tip: Verification.getTips(rules[ruleKey], item[option.option.tipKey])
                        });
                    }
                    // 查看是否继续执行
                    if (!Verification.checkResultNext(result, option.option.mode))
                        break;
                }
            }
            if (resultRules || resultBoolean) {
                result = {
                    resultFails: resultRules || [],
                    result: resultBoolean ? {
                        verification: true,
                        value: this.getValue(item, value, 'format', Verification.getExportKey(item, key), option)
                    } : resultRules ? resultRules[0] : undefined
                };
            }
        }
        // 执行保存相关内容
        Verification.preservation(key, result, option);
        return result;
    }
    // 根据校验规则，查看 是否继续执行rules 校验
    static checkResultNext(result, mode) {
        switch (mode) {
            default: return result;
        }
    }
    // 获取 value
    getValue(item, value, type, useKey, option) {
        let resultFormat = item[type];
        if (typeof resultFormat === 'function') {
            let resultValue = resultFormat(value, useKey, item, option.resultValues);
            return resultValue === undefined ? value : resultValue;
        }
        else if (resultFormat) {
            if (typeof resultFormat === 'string')
                resultFormat = { trigger: resultFormat };
            let resultUseFormat = resultFormat;
            if (this.format[resultUseFormat.trigger]) {
                let resultValue = this.format[resultUseFormat.trigger](value, resultUseFormat.option);
                return resultValue === undefined ? value : resultValue;
            }
            ;
        }
        return value;
    }
    // 获取 tips
    static getTips(option, defaultTip) {
        return (option && typeof option === 'object' ? option.tip : option) || defaultTip || '';
    }
    // 根据规则返回校验结果
    static returnVerificationResult(option) {
        switch (option.option.mode) {
            case 'end': return {
                verification: option.resultFail ? false : true,
                result: option.resultOrder.map((item) => {
                    return option.result[item].result;
                }),
                value: option.resultFail ? undefined : option.resultValues,
                item: undefined
            };
            case 'default': return option.resultFail ? option.resultFail[0].result : { verification: true, value: option.resultValues, item: undefined };
        }
    }
    // 根据校验规则，查看 是否继续执行rules 校验
    static checkVerificationtNext(result, mode) {
        switch (mode) {
            case 'end': return true;
            default: return result;
        }
    }
    // 上锁
    static Lock(key, option) {
        option.look = key;
    }
    // 获取key
    static getExportKey(item, key) {
        return item.exportKey || item.key || (key.toString());
    }
    // 保存内容
    static preservation(key, result, triggerArg) {
        if (triggerArg.look) {
            triggerArg.look = undefined;
        }
        // 获取item
        let item = triggerArg.data[key];
        // 获取导出key
        let exportKey = Verification.getExportKey(item, key);
        // 注入相关参数
        if (triggerArg.hasResult === undefined) {
            triggerArg.hasResult = {};
        }
        ;
        // 注入相关校验结果
        triggerArg.hasResult[key] = exportKey;
        // 注入相关参数
        if (triggerArg.relativeResult === undefined) {
            triggerArg.relativeResult = {};
        }
        ;
        // 注入相关校验结果
        triggerArg.relativeResult[exportKey] = key;
        // 增加注入结果集
        if (result) {
            if (triggerArg.result === undefined)
                triggerArg.result = {};
            triggerArg.result[exportKey] = result;
            // 增加排序
            if (triggerArg.resultOrder === undefined)
                triggerArg.resultOrder = [exportKey];
            else if (!triggerArg.resultOrder.includes(exportKey))
                triggerArg.resultOrder.push(exportKey);
            // 注入结果
            if (result.result) {
                if (result.result.verification) {
                    if (triggerArg.resultValues === undefined)
                        triggerArg.resultValues = {};
                    triggerArg.resultValues[exportKey] = result.result.value;
                }
                else {
                    if (triggerArg.resultFail === undefined)
                        triggerArg.resultFail = [result];
                    else
                        triggerArg.resultFail.push(result);
                }
            }
        }
    }
    // 获取校验规则
    static createRules(item, option) {
        if ('rules' in item) {
            if (typeof item.rules === 'string') {
                let ruleTip = item.rules ? item.rules : item[option && option.tipKey || 'placeholder'];
                if (ruleTip && typeof ruleTip === 'string')
                    return { emptyTrim: ruleTip };
            }
            else {
                return item.rules;
            }
        }
    }
    // 循环执行校验结果
    static map(option, callback, initIndex = 0) {
        if (option.data) {
            if (!Array.isArray(option.data) && option.keys === undefined)
                option.keys = Object.keys(option.data);
            let isArray = !option.keys;
            let data = isArray ? option.data : option.keys;
            // 如果未数组触发
            for (let i = initIndex, count = data.length; i < count; i++) {
                if (callback(isArray ? i : data[i], isArray ? data[i] : option.data[data[i]], i) === false)
                    break;
            }
        }
    }
}
export default Verification;
