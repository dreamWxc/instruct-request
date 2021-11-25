import instructRequest,{RequestConfigInstruction,OutsideRequestObject}  from './lib/request/index.d';

import Instructions from './lib/instructions/index';

import PromiseExtend from "./lib/extend/ProsmiseExtend";

import axios from 'axios';

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
} from './lib/request/plugins/export';

declare const CachePlugin:CachePlugin;
declare const VerificationPlugin:VerificationPlugin;
declare const TipPlugin:TipPlugin;
declare const SlicePlugin:SlicePlugin;

export {
    Instructions,
    PromiseExtend,
    CachePlugin,
    axios
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
    OutsideRequestObject as RequestClass
}

export default instructRequest;