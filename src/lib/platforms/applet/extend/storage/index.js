export default class Storage {
    // 设置值
    setItem(key, value) {
        return new Promise(function (resolve, reject) {
            // @ts-ignore
            return wx.setStorage({
                data: value,
                key,
                success: resolve,
                fail: reject
            });
        });
    }
    // 获取值
    getItem(key) {
        // @ts-ignore
        return wx.getStorageSync(key);
    }
    // 移除值
    removeItem(key) {
        return new Promise(function (resolve, reject) {
            // @ts-ignore
            return wx.removeStorage({
                key,
                success: resolve,
                fail: reject
            });
        });
    }
}
