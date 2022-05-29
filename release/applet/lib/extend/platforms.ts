interface PlatformsRule {

    setTimeout(callback:Function,time?:number);

    clearTimeout(value:any);

    FileReader?:any;

    Blob?:any;

    error:Function;

    info:Function;
}

export { PlatformsRule };

let platform:{
    platform:PlatformsRule | any
} = {
    platform:{}
};

export function registerPlatForm(targetPlatform:PlatformsRule){
    platform.platform = targetPlatform;
}

export default platform;
