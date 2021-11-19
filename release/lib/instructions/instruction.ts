import {
    InstructionConfig,
    InstructionType,
    InstructionTriggerType,
    InstructionConfigObject,
    InstructionContainer
} from './type.d';

export {
    InstructionConfig,
    InstructionType,
    InstructionTriggerType,
    InstructionConfigObject,
    InstructionContainer
}

// 指令注册器
export default class Instruction {

    // 容器
    container:InstructionContainer = undefined;

    /*
    * 删除指令
    * @param mustRemove boolean 如果指定需要为行为负责 此选项指定后且callback不提供将不继续管理 指令池 而是直接delete掉
    * */
    public delete(name:string,callback?:InstructionConfigObject,triggerType:InstructionTriggerType = undefined,type:InstructionType="front",mustRemove:boolean=false):boolean{

        // 获取指令模块
        let Indexes= this.container[type];
        let result = false;
        if (Indexes) {

            if (triggerType) {
                let trigger = Indexes[triggerType];
                if (trigger && trigger[name]) {
                    delete trigger[name];
                    result =  true;
                }
            } else {
                for (let key in Indexes) {
                    if (Indexes.hasOwnProperty(key) && Indexes) {
                        if (Indexes[key][name] instanceof Array) {
                            if (!callback && !mustRemove) {
                                console.error('this '+name+' is has many callback',Indexes[key][name]);
                            } else{
                                if ((Indexes[key][name] as Array<InstructionConfigObject>).length <= 1 || !callback && mustRemove) {
                                    delete Indexes[key][name]
                                    result = true;
                                }
                                else if(callback) {
                                    let index = (Indexes[key][name] as Array<InstructionConfigObject>).indexOf(callback);
                                    index >= 0 && (Indexes[key][name] as Array<InstructionConfigObject>).splice(index,1);
                                    if (!result) {
                                        result = index >= 0;
                                    }
                                }
                            }
                        } else {
                            result = true;
                            delete Indexes[key][name];
                        }
                    }
                }
            }


        }

        return result;

    }

    // 添加指令
    protected push<T extends Record<string, any>>(instruction: InstructionConfig<T>, name: string = 'default', triggerType?: InstructionTriggerType, zIndex: number = 0):InstructionConfigObject{

        let resultInstruction:InstructionConfigObject<T>;
        if (typeof instruction === 'function') {
            resultInstruction = {
                trigger: instruction,
                name,
                zIndex,
                triggerType
            }
        } else {
            resultInstruction = instruction as InstructionConfigObject<T>;
            name = resultInstruction.name || name;
        }

        // 设置zIndex执行表
        resultInstruction.zIndex = resultInstruction.zIndex === undefined ? 0 : resultInstruction.zIndex;

        // 设置触发类型
        if (resultInstruction.triggerType === undefined) {
            resultInstruction.triggerType = "has";
        }

        // 获取类型
        let type = resultInstruction.type || "front";

        // 执行添加
        if (this.container === undefined) this.container = {};
        if (this.container[type] === undefined) {
            this.container[type] = {};
        }
        if (this.container[type][resultInstruction.triggerType] === undefined) {
            this.container[type][resultInstruction.triggerType] = {};
        }

        // 创建索引
        let Indexes =  this.container[type][resultInstruction.triggerType];


        if (Indexes[name] === undefined) {
            Indexes[name] = resultInstruction;
        } else {

            if (!(Indexes[name] instanceof Array)) {
                Indexes[name] = [Indexes[name] as InstructionConfigObject<T>];
            }

            (Indexes[name] as Array<InstructionConfigObject<T>>).push(resultInstruction);
        }

        return resultInstruction;
    }

    // 根据提供的key 查询可被执行的指令
    protected search<T extends Record<string, any>>(data:Record<string, any>,arg?:T,type:InstructionType = "front"):Array<InstructionConfigObject> {

        // 如果没有指令
        if (this.container === undefined) {
            return  [];
        }

        // 获取
        let Indexes = this.container[type];

        // 如果没有此类型返回空
        if (Indexes === undefined) {
            return  [];
        }

        let resultData:Array<InstructionConfigObject> = [];

        // 否则执行检测跳过执行
        if (Indexes.skip) {
            let skipIndexes = Indexes.skip;
            for (let key in skipIndexes) {
                if (skipIndexes.hasOwnProperty(key)) {
                    let useResultData = this.searchTriggerWhere<T>(skipIndexes[key],arg);
                    if (useResultData && useResultData.length > 0) {
                        resultData.push(...useResultData);
                    }
                }
            }
        }

        // 查找拥有
        if (Indexes.has) {
            let keys = Object.keys(data);
            let hasIndexes = Indexes.has;
            keys.map((item)=>{
                if (!hasIndexes[item]) return;
                let useResultData = this.searchTriggerWhere(hasIndexes[item],arg);
                if (useResultData && useResultData.length > 0) {
                    resultData.push(...useResultData);
                }
            });
        }

        // 执行排序
        if (resultData.length > 1) {
            resultData.sort(function (leftItem,rightItem) {
                return leftItem.zIndex > rightItem.zIndex ? -1 : 1;
            });
        }

        return resultData;

    }

    // 触发
    protected trigger(data:Array<InstructionConfigObject>,arg?:any):Array<any>{
        if (data) {
            return data.map((item)=> item.trigger(arg));
        }
    }

    // 触发 + 搜索
    protected searchTrigger(data:Record<string, any>,arg?:any,type:InstructionType = "front"){
        return this.trigger(this.search(data,arg,type));
    }

    // 查询可触发条件的where
    private searchTriggerWhere<T extends Record<string, any>>(triggers:InstructionConfigObject | Array<InstructionConfigObject>,arg:T):Array<InstructionConfigObject>{

        if (triggers instanceof Array) {
            return  triggers.filter((item)=> item.where === undefined || item.where(arg));
        } else {

            if (triggers.where === undefined || triggers.where(arg)) {
                return [triggers];
            }

        }

        return  undefined;

    }


}
