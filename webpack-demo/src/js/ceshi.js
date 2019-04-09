console.log('陈少鹏')
import './a.js';
function ceshi(aa) {
    document.write(aa)
}
ceshi("我是ceshi.js")
//将之前写的require('./style.css');改成下面的语句
 
require('!style-loader!css-loader!./../css/ceshi.css');
 
//这句话的意思是在使用这个css文件之前必须经过loader的处理

// import './../css/ceshi.css';