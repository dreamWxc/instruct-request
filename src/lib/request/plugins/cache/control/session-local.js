import Memory from "./memory";
import encryption from '../../../utils/encryption/encryption';
export default class SessionLocal extends Memory {
    example;
    key = 'X19yZXF1ZXN0X2NhY2hlX2tleV9f';
    constructor(example, storageKey) {
        super();
        this.example = example;
        if (storageKey) {
            this.key = storageKey;
        }
        /* 获取缓存keys */
        try {
            let storage = this.example.getItem(this.key);
            if (storage) {
                this.storageOption = JSON.parse(encryption.decode(storage));
                this.updateExpire();
                this.createGroups();
            }
        }
        catch (e) { }
    }
    // 获取
    // @ts-ignore
    getItem(key, callback) {
        let useId = this.getId(key, undefined);
        if (useId)
            key = useId;
        // 判定 初始化表中 是否包含 此 key
        if (this.keys && this.keys[key] && (!this.data || !this.data[key])) {
            let resultData = this.example.getItem(key);
            /* 获取缓存数据 */
            try {
                if (resultData) {
                    let newResultData = JSON.parse(encryption.decode(resultData));
                    if (newResultData.expire > 0) {
                        newResultData.expire = newResultData.expire - this.getDateTime();
                    }
                    if (newResultData.expire >= 0) {
                        super.setItem(key, newResultData.data, {
                            expire: newResultData.expire
                        });
                        callback && callback(key, newResultData);
                    }
                }
            }
            catch (e) { }
        }
        return super.getItem(key);
    }
    timeObject;
    // 设置
    setItem(key, value, option) {
        let useId = this.getId(key, option);
        if (useId)
            key = useId;
        super.setItem(key, value, option);
        if (this.timeObject)
            clearTimeout(this.timeObject[key]);
        if (!this.timeObject)
            this.timeObject = {};
        this.timeObject[key] = setTimeout(() => {
            this.data[key] && this.example.setItem(key, encryption.encode(JSON.stringify(this.data[key])));
        }, 0);
    }
    setOptionTime;
    // 设置缓存
    updateStorageOption() {
        clearTimeout(this.setOptionTime);
        this.setOptionTime = setTimeout(() => {
            if (this.updateExpire())
                return clearTimeout(this.setOptionTime);
            if (this.storageOption) {
                return this.example.setItem(this.key, encryption.encode(JSON.stringify(this.storageOption)));
            }
            else {
                return this.example.removeItem(this.key);
            }
        }, 0);
    }
    // 删除
    removeItem(key) {
        let useId = this.getId(key, undefined);
        if (useId)
            key = useId;
        super.removeItem(key);
        return this.example.removeItem(key);
    }
    // 清空
    clear() {
        if (this.keys) {
            this.example.removeItem(this.key);
            Object.keys(this.keys).map((item) => {
                return this.example.removeItem(item);
            });
        }
        super.clear();
    }
}
