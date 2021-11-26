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
    cache:true,
    verification:{
        data:[{
            label:'name',
            key:'name',
            rules:{
                empty:'请输入名称',
                email:'邮箱格式错误'
            },
            value:'1',
            activeVerification:false
        }]
    }
}).then((data)=>{
    console.log(data.isCache,data);
});