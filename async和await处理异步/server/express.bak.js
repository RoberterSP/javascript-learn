const express = require('express')
const app = express()

let options = {
    dotfiles: 'ignore',
    etag: false,
    extensions: ['htm', 'html'],
    index: false,
    maxAge: '1d',
    redirect: false,
    setHeaders: function (res, path, stat) {
      res.set('x-timestamp', Date.now())
    }
  }
  
let pro = {
    success: true,
    obj: {
        province: '上海',
        city: '浦东'
    }
}
// 引入的静态文件配置
app.use(express.static('public', options))
// app.locals对象的属性是应用程序中的局部变量
// app.locals.title = 'My App';
// app.locals.strftime = require('strftime');
// app.locals.email = 'me@myapp.com';

app.post('/phoneLocation', function (req, res) {
    setTimeout(() => {
        res.json({
            success: true,
            obj: {
                province: '广东',
                city: '深圳'
            }
        })
    },2000)
})

app.post('/faceList', function (req, res) {
    setTimeout(() => {
        res.json(
            {
                success: true,
                obj:['20元', '30元', '40元']
            }
        )
    }, 1000)
})

app.get('/index.html', (req, res) => {	// 调用中间件指定的静态资源目录 public, 然后调用回调函数
	res.sendFile( __dirname + '/' + 'index.html');	// 输出html文件的绝对路径，采取的是拼接字符串的方式,设置http标头
});

app.get('/process_get', (req, res) => {
	// 输出json格式
	var response = {
		'first_name': req.query.first_name,	// 将http报文中 查询到的first_name的值作为属性值
		'last_name': req.query.last_name	// 同上
	};
	console.log(response); // 输出获取到的json的值
	res.end(JSON.stringify(response));	// 将获取到的值转为JSON格式的值，然后进行返回
});

app.listen(8100, () => {
    console.log('server start');
})