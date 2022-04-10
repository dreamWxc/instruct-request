export default class Memory {
    data;
    // 存储配置
    storageOption;
    get keys() {
        if (this.storageOption === undefined)
            this.storageOption = {};
        return this.storageOption.keys;
    }
    set keys(value) {
        if (this.storageOption === undefined)
            this.storageOption = {};
        this.storageOption.keys = value;
        this.updateStorageOption();
    }
    get id() {
        if (this.storageOption === undefined)
            this.storageOption = {};
        return this.storageOption.id;
    }
    set id(value) {
        if (this.storageOption === undefined)
            this.storageOption = {};
        this.storageOption.id = value;
        this.updateStorageOption();
    }
    get expires() {
        if (this.storageOption === undefined)
            this.storageOption = {};
        return this.storageOption.expires;
    }
    set expires(value) {
        if (this.storageOption === undefined)
            this.storageOption = {};
        this.storageOption.expires = value;
        this.updateStorageOption();
    }
    // 更新缓存
    updateStorageOption() { }
    // 校验
    updateExpire() {
        let update = false;
        if (this.storageOption && this.expires) {
            let nowDate = +new Date();
            for (let key in this.expires) {
                if (this.expires.hasOwnProperty(key) && nowDate >= this.expires[key]) {
                    this.removeItem(key);
                    update = true;
                }
            }
        }
        return update;
    }
    // 包含一组key
    groups;
    // 创建group组
    createGroups() {
        if (this.keys === undefined)
            return;
        let groups = undefined;
        for (let key in this.keys) {
            if (this.keys.hasOwnProperty(key)
                &&
                    typeof this.keys[key] !== 'number') {
                if (groups === undefined)
                    groups = {};
                let resultKeys = (typeof this.keys[key] === 'string' ? [this.keys[key]] : this.keys[key]);
                resultKeys.map(function (item) {
                    if (groups[item] === undefined)
                        groups[item] = [item];
                    else
                        groups[item].push(item);
                });
            }
        }
        if (groups) {
            this.groups = groups;
        }
    }
    // 设置key
    setKey(key, option) {
        if (this.keys === undefined)
            this.keys = {};
        let groupId = option.groupId;
        if (this.keys[key] === undefined) {
            this.keys[key] = groupId || 1;
        }
        if (this.id === undefined)
            this.id = {};
        // 存储id
        if (option.id) {
            this.id[option.id] = key;
        }
        // 执行加入组
        if (groupId) {
            if (this.groups === undefined)
                this.groups = {};
            if (this.groups[groupId] === undefined)
                this.groups[groupId] = [key];
            else if (!this.groups[groupId].includes(key))
                this.groups[groupId].push(key);
        }
        if (this.keys[key]) {
            if (typeof this.keys[key] === 'string') {
                this.keys[key] = [this.keys[key], groupId];
            }
            else if (this.keys[key] instanceof Array) {
                this.keys[key].push(groupId);
            }
        }
    }
    // 删除key
    deleteKey(key, callback) {
        if (this.keys === undefined)
            return;
        if (this.id[key])
            key = this.id[key];
        if (this.keys[key]) {
            let typeValue = typeof this.keys[key];
            if (typeValue !== 'number' && this.groups) {
                let valueResult = (typeValue === 'string' ? [this.keys[key]] : this.keys[key]);
                valueResult.map((item) => {
                    if (!this.groups[item])
                        return;
                    if (this.groups[item].length <= 1) {
                        delete this.groups[item];
                    }
                    else {
                        let index = this.groups[item].indexOf(key);
                        if (index >= 0)
                            this.groups[item].splice(index, 1);
                    }
                });
            }
            /* 删除相关缓存 */
            delete this.storageOption.keys[key];
            if (Object.keys(this.keys).length <= 0)
                delete this.storageOption.keys;
            if (this.expires) {
                if (this.expires[key]) {
                    delete this.storageOption.expires[key];
                }
                if (Object.keys(this.expires).length <= 0)
                    delete this.storageOption.expires;
            }
            return callback && callback();
        }
    }
    // 删除组
    deleteGroup(id, callback) {
        if (this.keys === undefined || this.groups === undefined || this.groups[id] === undefined)
            return;
        let resultKeys = this.groups[id];
        delete this.groups[id];
        if (Object.keys(this.groups).length <= 0)
            this.groups = undefined;
        resultKeys.map((item) => {
            if (this.keys[item]) {
                if (this.keys[item] instanceof Array && this.keys[item].length > 1) {
                    let index = this.keys[item].indexOf(id);
                    if (index >= 0)
                        this.keys[item].splice(index, 1);
                }
                else {
                    callback && callback(item);
                    delete this.keys[item];
                    if (this.expires && this.expires[item]) {
                        delete this.expires[item];
                    }
                }
            }
        });
    }
    getItem(key) {
        let useId = this.getId(key, undefined);
        if (useId)
            key = useId;
        if (this.data && this.data[key]) {
            if (this.data[key].expire > 0 && this.getDateTime() > this.data[key].expire) {
                return this.removeItem(key);
            }
            return JSON.parse(this.data[key].data);
        }
        else {
            return;
        }
    }
    // 获取Group缓存
    getGroup(id) {
        if (this.searchGroup(id)) {
            return this.groups[id].map((item) => this.getItem(item));
        }
        else {
            return [];
        }
    }
    setExpire(key, expire) {
        if (key && expire > 0) {
            if (!this.expires)
                this.expires = {};
            if (this.expires[key] !== expire) {
                this.expires[key] = expire;
            }
        }
    }
    // 获取日期
    getExpire(expire, value, key) {
        if (typeof expire === "function") {
            return expire(value, this.data[key] ? this.getItem(key) : undefined, key);
        }
        else {
            return expire;
        }
    }
    // 获取id
    getId(key, option) {
        if (this.id) {
            let useId = undefined;
            if (option && option.id && !key) {
                useId = this.id[option.id];
            }
            if (!useId) {
                useId = this.id[key];
            }
            return useId;
        }
    }
    setItem(key, value, option) {
        if (this.data === undefined)
            this.data = {};
        let useId = this.getId(key, option);
        if (useId)
            key = useId;
        let expire = this.getExpire(option.expire, value, key);
        let useExpire = expire && expire > 0;
        let useExpireTime = useExpire ? this.getDateTime() + expire : 0;
        // 如果缓存配置未变，则设置为上一次的
        if (this.data[key] && this.data[key].beginExpire == expire) {
            useExpireTime = this.data[key].expire;
        }
        this.data[key] = {
            expire: useExpireTime,
            data: typeof value === 'string' ? value : JSON.stringify(value)
        };
        this.setExpire(key, useExpireTime);
        if (useExpire) {
            this.data[key].beginExpire = expire;
        }
        return this.setKey(key, option);
    }
    // 设置组
    setGroup(id, value, option) {
        if (this.searchGroup(id)) {
            this.groups[id].map((item) => {
                if (typeof value === 'function') {
                    let data = this.getItem(item);
                    return this.setItem(item, value({
                        groupId: id,
                        id,
                        expire: option.expire,
                        sign: item,
                        data
                    }), option);
                }
                else {
                    return this.groups[id].map((item) => this.setItem(item, value, option));
                }
            });
        }
    }
    removeItem(key) {
        let useId = this.getId(key, undefined);
        if (useId)
            key = useId;
        return this.deleteKey(key, this.data === undefined ? undefined : () => {
            if (this.data[key]) {
                delete this.data[key];
            }
        });
    }
    removeGroup(id) {
        if (this.data === undefined)
            return;
        return this.deleteGroup(id, (key) => {
            if (this.data[key]) {
                delete this.data[key];
            }
        });
    }
    // 搜索是否存在此 key
    search(key) {
        let useId = this.getId(key, undefined);
        if (useId)
            key = useId;
        return !!(this.data && this.data[key] || this.keys && this.keys[key]);
    }
    // 搜索是否存在此group
    searchGroup(id) {
        return !!(this.groups && this.groups[id]);
    }
    // 清楚所有
    clear() {
        this.storageOption = undefined;
        this.data = undefined;
        this.groups = undefined;
    }
    getDateTime() {
        return +new Date();
    }
}
