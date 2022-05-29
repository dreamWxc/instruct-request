import { registerPlatForm } from '../../extend/platforms';
class Platforms {
    setTimeout(callback, time) {
        return setTimeout(callback, time);
    }
    clearTimeout(value) {
        return clearTimeout(value);
    }
    FileReader = undefined;
    Blob = undefined;
    error(...data) {
        return console.error(data);
    }
    info(...data) {
        return console.info(data);
    }
}
registerPlatForm(new Platforms());
