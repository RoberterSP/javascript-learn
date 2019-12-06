// import { count } from './util/count'
let count = require('./util/count')
// 引入的模块作为变量保存在count变量中，那count变量到底是什么东西？其实变量count就是在count.js中我们用exports.count;输出的count函数。所以，main.js就成功地引用了count.js模块中定义的count()函数，接下来就可以直接使用它了。

let fs = require('fs')
fs.readFile('sample.txt', 'utf-8', function (err, data) {
    if(err) {
        console.log('err' ,err)
    } else {
        // console.log('data', data)
    }
})
fs.stat('太平鸟.jpeg',  function (err, data) {
    if(err) {
        console.log('err' ,err)
    } else {
        // console.log('data', data.toString('utf-8'))
        // console.log("是否是文件:", data.isFile())
        // console.log("文件:", data)
        // console.log("文件大小:", data.size)
        // console.log("文件创建时间:", data.birthtime)
        // console.log("文件修改时间:", data.mtime)
    }
})


var rs = fs.createReadStream('sample.txt', 'utf-8');
rs.on('data', function (chunk) {
    console.log('DATA:')
    console.log(chunk);
});

rs.on('end', function () {
    console.log('END');
});

rs.on('error', function (err) {
    console.log('ERROR: ' + err);
});

for (let i=0; i< 10; i++) {
    if(i < 10) {
        // console.log(count.count())
    }
}
var rs = fs.createReadStream('sample.txt');

var ws = fs.createWriteStream('readme.md');
rs.pipe(ws);
ws.write('ceshi')
