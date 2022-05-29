import { CacheStorageExample } from '../../../../request/plugins/cache/type';

export default class Storage implements CacheStorageExample {

    // 设置值
    setItem(key: string, value: string) {
        return new Promise(function (resolve, reject) {
            // @ts-ignore
            return wx.setStorage({
                data: value,
                key,
                success: resolve,
                fail: reject
            });
        })
    }

    // 获取值
    getItem(key: string){
        // @ts-ignore
        return wx.getStorageSync(key);
    }

    // 移除值
    removeItem(key: string){
        return new Promise(function (resolve, reject) {
            // @ts-ignore
            return wx.removeStorage({
                key,
                success: resolve,
                fail: reject
            });
        })
    }

}
