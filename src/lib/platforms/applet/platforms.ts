import { PlatformsRule,registerPlatForm } from '../../extend/platforms';

class Platforms implements PlatformsRule {

    setTimeout(callback:Function,time?:number){
        return setTimeout(callback,time);
    }

    clearTimeout(value:any){
        return clearTimeout(value);
    }

    FileReader:any=undefined

    Blob:any = undefined

    error(...data){
        return console.error(data);
    }

    info(...data){
        return console.info(data);
    }
}


registerPlatForm(new Platforms());
