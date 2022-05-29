import { PlatformsRule,registerPlatForm } from '../../extend/platforms';

class Platforms implements PlatformsRule {

    setTimeout(callback:Function,time?:number){
        return setTimeout(callback,time);
    }

    clearTimeout(value:any){
        return clearTimeout(value);
    }

    FileReader:any=FileReader

    Blob:any = Blob

    error(...data){
        return console.error(data);
    }

    info(...data){
        return console.info(data);
    }
}


registerPlatForm(new Platforms());
