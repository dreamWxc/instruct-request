export type InstructionContainerObject = {

    [key in InstructionTriggerType]?:Record<string,InstructionConfigObject | Array<InstructionConfigObject>>;
}

export type InstructionContainer = {
    [key in InstructionType]?:InstructionContainerObject
}

export type InstructionType =
    'entry'|
    'front'|
    'post'|
    'success'|
    'fail'

export type InstructionTriggerType = 'has' | 'skip';

export interface InstructionConfigObject<T extends Record<string, any> = any> {

    // 执行层级值越小排名越低
    zIndex?:number,

    // 判断条件 如果返回 true 才可以执行
    where?: InstructionWhere<T>,

    // 处理器
    trigger: InstructionTrigger<T>,

    // 执行校验的判断
    triggerType?: InstructionTriggerType

    // 类型
    type?: InstructionType,

    // 名称
    name?:string,

}

interface InstructionTrigger<T extends Record<string, any> = any> {
    (data:T):any
}

interface InstructionWhere<T extends Record<string, any> = any> {
    (data:T):boolean
}

// 指令配置文件
export type InstructionConfig<T extends Record<string, any> = any> = InstructionType | InstructionConfigObject<T>;

