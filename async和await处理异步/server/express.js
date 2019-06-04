const express = require('express')
const app = express()
var bodyParser = require('body-parser'); // 加载Express中间件


//引入mongodb模块，获得客户端对象
const MongoClient = require('mongodb').MongoClient;
//连接字符串
const DB_CONN_STR = 'mongodb://localhost:27017/gomall';
// Database Name
const dbName = 'gomall'

//定义函数表达式，用于操作数据库并返回结果
var insertData = function(db, callback) {
    //获得指定的集合 
    var collection = db.collection('users');
    //插入数据
    // let data = []
    // for (let key = 0; key < 20; key++) {
    //     let obj = {}
    //     obj.name = `chenshaopeng${key}`
    //     data.push(obj)
    // }
    var data = [{
        "product_code": "172100",
        "product_id": 106,
        "sale_qty": 3.0,
        "rank": 4,
        "thumbnail_url": "http://oss2.nexttao.com/crm/images/1721005.jpg",
        "image_url": "http://oss2.nexttao.com/crm/images/1721005.jpg",
        "unit_price": 4999.0,
        "category_id": 9,
        "product_name": "新品男士英伦西服套装 绅士修身商务正装职业西服",
        "category_name": "棒球服"
    },{
        "product_code": "1721005",
        "product_id": 106,
        "sale_qty": 3.0,
        "rank": 4,
        "thumbnail_url": "http://oss2.nexttao.com/crm/images/1721005.jpg",
        "image_url": "http://oss2.nexttao.com/crm/images/1721005.jpg",
        "unit_price": 4999.0,
        "category_id": 9,
        "product_name": "新品男士英伦西服套装 绅士修身商务正装职业西服",
        "category_name": "棒球服"
    },{
        "product_code": "1721005",
        "product_id": 106,
        "sale_qty": 3.0,
        "rank": 4,
        "thumbnail_url": "http://oss2.nexttao.com/crm/images/1721005.jpg",
        "image_url": "http://oss2.nexttao.com/crm/images/1721005.jpg",
        "unit_price": 4999.0,
        "category_id": 9,
        "product_name": "新品男士英伦西服套装 绅士修身商务正装职业西服",
        "category_name": "棒球服"
    },{
        "product_code": "1721005",
        "product_id": 106,
        "sale_qty": 3.0,
        "rank": 4,
        "thumbnail_url": "http://oss2.nexttao.com/crm/images/1721005.jpg",
        "image_url": "http://oss2.nexttao.com/crm/images/1721005.jpg",
        "unit_price": 4999.0,
        "category_id": 9,
        "product_name": "新品男士英伦西服套装 绅士修身商务正装职业西服",
        "category_name": "棒球服"
    },{
        "product_code": "1721005",
        "product_id": 106,
        "sale_qty": 3.0,
        "rank": 4,
        "thumbnail_url": "http://oss2.nexttao.com/crm/images/1721005.jpg",
        "image_url": "http://oss2.nexttao.com/crm/images/1721005.jpg",
        "unit_price": 4999.0,
        "category_id": 9,
        "product_name": "新品男士英伦西服套装 绅士修身商务正装职业西服",
        "category_name": "棒球服"
    },{
        "product_code": "1721005",
        "product_id": 106,
        "sale_qty": 3.0,
        "rank": 4,
        "thumbnail_url": "http://oss2.nexttao.com/crm/images/1721005.jpg",
        "image_url": "http://oss2.nexttao.com/crm/images/1721005.jpg",
        "unit_price": 4999.0,
        "category_id": 9,
        "product_name": "新品男士英伦西服套装 绅士修身商务正装职业西服",
        "category_name": "棒球服"
    }];
    collection.insert(data, function(err, result) {
        //如果存在错误
        if (err) {
            console.log('Error:' + err);
            return;
        }
        //调用传入的回调方法，将操作结果返回
        callback(result);
    });

}

// connect
MongoClient.connect(DB_CONN_STR, function(err, db) {
    if (err) {
        console.log("数据库连接失败!")
    }
    console.log("连接成功！");
    //执行插入数据操作，调用自定义方法
    insertData(db, function(result) {
        //显示结果
        console.log(result);
        //关闭数据库
        db.close();
    });
});

// 使用中间件提供的bodyParser.urlencoded对来自于post的url进行解析,只允许字符串和数字类型的结果
var urlencodeParser = bodyParser.urlencoded({ extended: false });
let options = {
    dotfiles: 'ignore',
    etag: false,
    extensions: ['htm', 'html'],
    index: false,
    maxAge: '1d',
    redirect: false,
    setHeaders: function(res, path, stat) {
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
app.locals.title = 'My App';
// app.locals.strftime = require('strftime');
// app.locals.email = 'me@myapp.com';

app.post('/phoneLocation', function(req, res) {
    setTimeout(() => {
        res.json({
            success: true,
            obj: {
                province: '广东',
                city: '深圳'
            }
        })
    }, 2000)
})

app.post('/faceList', function(req, res) {
    setTimeout(() => {
        res.json({
            success: true,
            obj: ['20元', '30元', '40元']
        })
    }, 1000)
})

app.get('/index.html', (req, res) => { // 调用中间件指定的静态资源目录 public, 然后调用回调函数
    res.sendFile(__dirname + '/' + 'index.html'); // 输出html文件的绝对路径，采取的是拼接字符串的方式,设置http标头
});

app.post('/process_get', urlencodeParser, (req, res) => { // 先进行回调第一个函数，将post请求，使用中间件进行处理，处理完后的值进行返回到req和res即下一个回调函数,数据经过两次回调
    // 输出json格式
    var response = {
        'first_name': req.body.first_name, // 将http报文中 查询到的first_name的值作为属性值
        'last_name': req.body.last_name // 同上
    };
    console.log(response); // 输出获取到的json的值, 可以用来查看错误,打出请求的日志
    res.end(JSON.stringify(response)); // 将获取到的值转为JSON格式的值，然后进行返回
});

var server = app.listen(800, () => {
    console.log(server.address());
})