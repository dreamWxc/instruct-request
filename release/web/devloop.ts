import Instruction,{VerificationPlugin,CachePlugin} from "./index";

import axios from 'axios';

const request = Instruction.create<{
    name:string
}>({
    baseURL:'http://atest.honorjiahua.com:56462',
    method:'POST'
},axios);

VerificationPlugin.register(request);

request.$use({
    extendName: 'mode',

    defaultOption:{
        'address':{
            requestConfig:{
                baseURL:'https://apis.map.qq.com/',
            },
            mergeData:{
                data:{
                    key:'123'
                }
            }
        }
    },

    install(target) {

        target.push({
            name:this.extendName,
            trigger:(request)=>{
                let optionData = this.defaultOption[request.introduces.mode];

                request.requestData = Object.assign({},optionData.requestConfig,request.requestData);
                // @ts-ignore
                console.log(request);
                optionData.mergeData && Object.keys(optionData.mergeData).map((item)=>{
                    if(typeof optionData.mergeData[item] === 'object'){
                        request.requestData[item] = Object.assign({},optionData.mergeData[item],request.requestData[item])
                    } else {
                        request.requestData[item] = request.requestData[item] === undefined ? optionData.mergeData[item] : request.requestData[item];
                    }
                });

            },
            where: (request) => !!this.defaultOption[request.introduces.mode],
            triggerType: 'has',
            type: "entry"
        });

    },

    register(request){
        return request.$use(this);
    }
});

VerificationPlugin.register(request);

CachePlugin.register(request,{
    storage:'local',
    // @ts-ignore
    sessionStorage:window.sessionStorage,
    // @ts-ignore
    localStorage:window.localStorage
});


request.$request({
    url:'/codeBom/list',
    mode:'address',
    cache:true,
    // verification:{
    //     data:[{
    //         label:'name',
    //         key:'name',
    //         rules:{
    //             empty:'请输入名称',
    //             email:'邮箱格式错误'
    //         },
    //         value:'1',
    //         activeVerification:false
    //     }]
    // }
}).then((data)=>{
    // @ts-ignore
    console.log(data.isCache,data);
});
