import Cache from './cache';

export default {

    cache:undefined,

    getCache(){
        if(this.cache === undefined) {
            this.cache = new Cache();
        }

        return this.cache;
    }

}