var fs = require('fs');
var path = require('path');//解析需要遍历的文件夹
var process = require('child_process');
var ProgressBar = require('progress');
var targetProcess = require('process');

var platforms = 'web';
targetProcess.argv.forEach((val, index) => {

    if (val && val.split('=')[0] === 'platforms') {
        platforms = val.split('=')[1];
    }
})

if (!platforms) {
    throw 'fail: please set platforms name';
}
//
//
let queue = [
    'rm -rf ./release/'+platforms+'/lib',
    'rm -rf ./release/'+platforms+'/README.md',
    'rm -rf ./release/'+platforms+'/index.ts',
    'rm -rf ./release/'+platforms+'/index.js',
    'cp -a src/ release/'+platforms+'/',
    'rm -rf ./release/'+platforms+'/lib/platforms/*',
    'cp -a src/lib/platforms/'+platforms+'/ ./release/'+platforms+'/lib/platforms/'+platforms+'/',
    'cp -r README.md release/'+platforms+'/README.md'
]

var bar = new ProgressBar(':bar :current/:total', { total: queue.length });


function triggerQueue(i=0){
    let item = queue[i];
    if (item) {
        if (typeof item === 'string') {
            return process.exec(item,function () {
                bar.tick();
                triggerQueue(i+1);
            });
        } else {
            item();
            bar.tick();
            return triggerQueue(i+1);
        }
    }


}

triggerQueue();
