// 正则校验
const formatRegExp = {
    trim: /^\s*(.*)\s*$/g
};
const format = {
    join(value, option = ',') {
        if (value && value.join) {
            return value.join(option);
        }
        return '';
    },
    trim(value) {
        if (typeof value === 'string')
            return value.replace(formatRegExp.trim, '$1');
        return '';
    }
};
export default format;
