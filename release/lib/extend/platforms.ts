class Platforms {

    setTimeout(callback:Function,time?:number){
        // @ts-ignore
        return setTimeout(callback,time);
    }

    clearTimeout(value:any){
        // @ts-ignore
        return clearTimeout(value);
    }


    // @ts-ignore
    FileReader = FileReader

    // @ts-ignore
    Blob = Blob

    error(...data){
        // @ts-ignore
        return console.error(data);
    }

    info(...data){
        // @ts-ignore
        return console.info(data);
    }
}

export default new Platforms();
