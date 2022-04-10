class Platforms {
    setTimeout(callback, time) {
        // @ts-ignore
        return setTimeout(callback, time);
    }
    clearTimeout(value) {
        // @ts-ignore
        return clearTimeout(value);
    }
    // @ts-ignore
    FileReader = FileReader;
    // @ts-ignore
    Blob = Blob;
    error(...data) {
        // @ts-ignore
        return console.error(data);
    }
    info(...data) {
        // @ts-ignore
        return console.info(data);
    }
}
export default new Platforms();
