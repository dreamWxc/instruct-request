var fs = require('fs');
var path = require('path');//解析需要遍历的文件夹
var process = require('child_process');
var ProgressBar = require('progress');

let queue = [
    'rm -rf ./release/lib',
    'rm -rf ./release/docs',
    'rm -rf ./release/README.md',
    'rm -rf ./release/index.ts',
    'rm -rf ./release/index.js',
    'cp -a src/ release/',
    'cp -a docs/ release/docs/',
    'cp -r README.md release/README.md'
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
