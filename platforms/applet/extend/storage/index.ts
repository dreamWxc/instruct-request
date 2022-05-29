import { CacheStorageExample } from '../../../../src/lib/request/plugins/cache/type.d.ts';

export default class Storage implements CacheStorageExample {


    // 设置值
    setItem(key: string, value: string) {
        return new Promise(function (resolve, reject) {
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
        return wx.getStorageSync(key);
    }

    // 移除值
    removeItem(key: string){
        return new Promise(function (resolve, reject) {
            return wx.removeStorage({
                key,
                success: resolve,
                fail: reject
            });
        })
    }

}
