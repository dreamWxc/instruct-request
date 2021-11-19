import In,{ SlicePlugin,CachePlugin } from './index';

const request = In.create({
    baseURL:'http://127.0.0.1:9000',
    method:'post'
});

SlicePlugin.register(request);

const speed = document.getElementById('speed');

const sliceExtend = request.extend('slice')();

const controller = sliceExtend.createdController();

const el = document.getElementById('button');

el.onclick = function() {
    if(controller.suspend) {
        controller.play();
    } else {
        controller.pause();
    }

    el.innerHTML = controller.suspend ? '继续' :'暂停'
}

document.getElementById('cancel').onclick = function() {
    controller.cancel();
}

document.getElementsByTagName('input')[0].onchange = function(this:HTMLInputElement){

    request.$upload({
        url:'/file/upload',
        file:{
           file: this.files[0],
           analysis:10,
        //    controller,
           mergeAnalysis:10,
        //    mode:'many',
        //    manyNumber:5,
           merge:{
               url:'/file/merge_chunks'
           },
        //    cache:'local'
        },
        onUploadProgress:function(progress){
            speed.innerHTML = Math.round(progress.loaded / progress.total * 100) + '%';
        }
    }).then((response)=>{
        console.log(response);
    }).catch((response)=>{
        console.log(response);
    })

}