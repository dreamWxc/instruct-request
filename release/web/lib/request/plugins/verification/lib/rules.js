// 正则校验
const verificationRegExp = {
    trim: /^\s+$/,
    id: /^([1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
    email: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
    mobile: /^1[0-9]{10}$/
};
const verificationRules = {
    // 鉴定length
    length(option) {
        if (option.value) {
            if (option.value.hasOwnProperty('length')) {
                return option.value.length === option.option.value;
            }
            else {
                if (typeof option.value === 'number') {
                    return option.value === option.option.value;
                }
            }
        }
        return false;
    },
    // 对等
    eq(option, target) {
        // 定义value
        let value;
        let result;
        if (option.option.hasOwnProperty('value')) {
            value = option.option.value;
            result = { verification: true };
        }
        else if (option.option.hasOwnProperty('key') || option.option.hasOwnProperty('index')) {
            result = target.verificationTriggerTarget(option.key, option.option.key, option.option.index, option.arg);
            if (result && result.verification) {
                value = result.value;
            }
        }
        if (result && result.verification) {
            if (option.option.absolutely === false) {
                return option.value == value;
            }
            else {
                return option.value === value;
            }
        }
        else {
            return false;
        }
    },
    // 手机号校验
    mobile(option) {
        if (option.value) {
            return verificationRegExp.mobile.test(option.value.toString());
        }
        return false;
    },
    // 身份证号校验
    idcard(option) {
        let value = option.value;
        let type = typeof value;
        if (value) {
            if (type !== 'string')
                value = value.toString();
            return verificationRegExp.id.test(value);
        }
        return false;
    },
    // 邮箱验证
    email(option) {
        let value = option.value;
        let type = typeof value;
        if (value) {
            if (type !== 'string')
                value = value.toString();
            return verificationRegExp.email.test(value);
        }
        return false;
    },
    // 字符串校验 - 针对校验全是空格 返回 false
    trim(option) {
        if (typeof option.value === 'string') {
            return option.value ? !verificationRegExp.trim.test(option.value) : false;
        }
        else {
            return false;
        }
    },
    // 针对空的校验 - 多增加了校验全是空格
    emptyTrim(option) {
        if (typeof option.value === 'string') {
            return this.trim(option);
        }
        else {
            return this.empty(option);
        }
    },
    // 针对空的校验
    empty(option) {
        let value = option.value;
        if (!value)
            return false;
        let type = typeof value;
        if (type === 'object' || type === 'string') {
            if (type.hasOwnProperty('length')) {
                return type.length > 0;
            }
            else {
                return Object.keys(type).length > 0;
            }
        }
        else if (type === 'boolean') {
            return type;
        }
        else if (type === 'number') {
            return value > 0;
        }
        return false;
    },
};
export default verificationRules;
