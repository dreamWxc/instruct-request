import CacheControl from "./cacheControl";
export default class CacheDataExtend extends CacheControl {
    cacheRole;
    cache;
    constructor(options, cacheRole = 'default', cache) {
        super(options);
        this.cacheRole = cacheRole;
        this.cache = cache;
    }
    roles = {
        'noUpdate': {
            'update': false,
            'updateAll': false,
            'updateAllGroup': false,
            'updateGroup': false
        }
    };
    getRole(type) {
        if (this.roles[this.cacheRole]) {
            return this.roles[this.cacheRole][type] !== false;
        }
        else {
            return true;
        }
    }
    // 更新一个组
    updateGroup(data) {
        if (!this.getRole('updateGroup'))
            return;
        let option = this.getParams(data);
        if (option.data === undefined)
            return console.error('update cache fail data is ', option.data, 'but this arg need Object');
        if (!option.groupId)
            return console.error('groupId not use', option.groupId);
        if (!option.option && !option.skip) {
            return this.updateAllGroup(data);
        }
        this.cache.setGroupItem(this.getParamsValue(option, 'groupId'), this.getParamsValue(option, 'data'), this.getParamsValue(option, 'option'));
        return this;
    }
    // 更新所有模式此 key的
    updateAllGroup(data) {
        if (!this.getRole('updateAllGroup'))
            return;
        let option = this.getParams(data);
        if (option.data === undefined)
            return console.error('update cache fail data is ', option.data, 'but this arg need Object');
        this.map(this.cache, option.where, (item) => {
            return this.updateGroup(Object.assign({}, option, {
                option: option.option ? Object.assign({}, option.option, {
                    storage: item
                }) : {
                    storage: item
                }
            }));
        });
        return this;
    }
    // 更新所有模式此 key的
    updateAll(data) {
        if (!this.getRole('updateAll'))
            return;
        let option = this.getParams(data);
        if (option.data === undefined)
            return console.error('update cache fail data is ', option.data, 'but this arg need Object');
        this.map(this.cache, option.where, (item) => {
            return this.update(Object.assign({}, option, {
                option: option.option ? Object.assign({}, option.option, {
                    storage: item
                }) : {
                    storage: item
                }
            }));
        });
        return this;
    }
    // 更新对象
    update(data) {
        if (!this.getRole('update'))
            return;
        let option = this.getParams(data);
        if (option.data === undefined)
            return console.error('update cache fail data is ', option.data, 'but this arg need Object');
        if (!option.option && !option.skip) {
            return this.updateAll(data);
        }
        this.cache.setItem(this.getParamsValue(option, 'sign'), this.getParamsValue(option, 'data'), this.getParamsValue(option, 'option'));
        return this;
    }
    // 删除所有
    deleteAll(data) {
        if (!this.getRole('deleteAll'))
            return;
        let option = this.getParams(data);
        this.map(this.cache, option.where, (item) => {
            return this.delete(Object.assign({}, option, {
                option: option.option ? Object.assign({}, option.option, {
                    storage: item
                }) : {
                    storage: item
                }
            }));
        });
        return this;
    }
    // 删除此对象的缓存
    delete(data) {
        if (!this.getRole('delete'))
            return;
        let option = this.getParams(data);
        if (!option.option && !option.skip)
            return this.deleteAll(data);
        this.cache.removeItem(this.getParamsValue(option, 'sign'), this.getParamsValue(option, 'option'));
        return this;
    }
    // 删除组
    deleteGroup(data) {
        if (!this.getRole('deleteGroup'))
            return;
        let option = this.getParams(data);
        if (!option.option && !option.skip)
            return this.deleteAll(data);
        this.cache.removeGroup(this.getParamsValue(option, 'groupId'), this.getParamsValue(option, 'option'));
        return this;
    }
    // 删除所有模式的组
    deleteAllGroup(data) {
        if (!this.getRole('deleteAllGroup'))
            return;
        let option = this.getParams(data);
        this.map(this.cache, option.where, (item) => {
            return this.deleteGroup(Object.assign({}, option, {
                option: option.option ? Object.assign({}, option.option, {
                    storage: item
                }) : {
                    storage: item
                }
            }));
        });
        return this;
    }
    // 获取缓存
    getData(data) {
        if (!this.getRole('getData'))
            return;
        let option;
        if (typeof data === 'string') {
            option = { sign: data };
        }
        else {
            option = this.getParams(data);
        }
        let resultData = this.cache.getItem(this.getParamsValue(option, 'sign'), this.getParamsValue(option, 'option'));
        return resultData && resultData.data;
    }
    // 获取缓存
    getDataAll(data) {
        if (!this.getRole('getDataAll'))
            return;
        let option;
        if (typeof data === 'string') {
            option = { sign: data };
        }
        else {
            option = this.getParams(data);
        }
        return this.map(this.cache, option.where, (item) => {
            return this.getData(Object.assign({}, option, {
                option: option.option ? Object.assign({}, option.option, {
                    storage: item
                }) : {
                    storage: item
                }
            }));
        });
    }
    // 获取组缓存
    getGroupData(data) {
        if (!this.getRole('getGroupData'))
            return;
        let option;
        if (typeof data === 'string') {
            option = { groupId: data };
        }
        else {
            option = this.getParams(data);
        }
        return this.cache.getGroupItem(this.getParamsValue(option, 'groupId'), this.getParamsValue(option, 'option'));
    }
    // 获取组缓存
    getGroupDataAll(data) {
        if (!this.getRole('getGroupDataAll'))
            return;
        let option;
        if (typeof data === 'string') {
            option = { groupId: data };
        }
        else {
            option = this.getParams(data);
        }
        return this.map(this.cache, option.where, (item) => {
            return this.getDataAll(Object.assign({}, option, {
                option: option.option ? Object.assign({}, option.option, {
                    storage: item
                }) : {
                    storage: item
                }
            }));
        });
    }
}
