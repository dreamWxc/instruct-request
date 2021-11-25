import Instruction,{VerificationPlugin,CachePlugin} from "./index";

const request = Instruction.create({
    baseURL:'http://atest.honorjiahua.com:56462',
    method:'POST'
});

VerificationPlugin.register(request);

CachePlugin.register(request,{
    storage:'local'
});


request.$request({
    url:'/codeBom/list',
    cache:true
}).then((data)=>{
    console.log(data.isCache,data);
});