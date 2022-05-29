import instructRequest,{RequestConfigInstruction,OutsideRequestObject,RequestExtend,RequestPlugin}  from '../../request/index';

import Instructions from '../../instructions/index';

import PromiseExtend from "../../extend/ProsmiseExtend";

import {
    CachePlugin,
    VerificationPlugin,
    TipPlugin,
    SlicePlugin,

    CacheOptionObject,
    CachePluginOption,
    VerificationPluginOption,
    VerificationOption,
    RequestUploadInstructionFile,
    TipPluginOption,
    TipOptionObject
} from '../../request/plugins/export';

declare const CachePlugin:CachePlugin;
declare const VerificationPlugin:VerificationPlugin;
declare const TipPlugin:TipPlugin;
declare const SlicePlugin:SlicePlugin;

export {
    Instructions,
    PromiseExtend,
    CachePlugin,
    VerificationPlugin,
    TipPlugin,
    SlicePlugin
}

export {
    RequestConfigInstruction,
    CacheOptionObject,
    CachePluginOption,
    VerificationPluginOption,
    VerificationOption,
    RequestUploadInstructionFile,
    TipPluginOption,
    TipOptionObject,
    OutsideRequestObject as RequestClass,
    RequestExtend,
    RequestPlugin
}

export default instructRequest;
