// 导入koa，和koa 1.x不同，在koa2中，我们导入的是一个class，因此用大写的Koa表示:
const Koa = require('koa');

// 注意require('koa-router')返回的是函数:
const router = require('koa-router')();

// 解析原始request请求，然后，把解析后的参数，绑定到ctx.request.body中
const bodyParser = require('koa-bodyparser');
const static = require('koa-static') // 设置项目根目录为静态资源根目录
const path = require('path') // path 通道
const test = require('./lib/test')
// 从KWT中获取 sign 的方法
const {sign} = require('jsonwebtoken');

const secret = 'demo' // 设置密钥
const staticPath = './'

const jwt = require('koa-jwt')({secret})

const User = require('./lib/test')

const JSON_TYPE = 'application/json'

// 创建一个Koa对象表示web app本身:
const app = new Koa();

app.use(async (ctx, next) => {
    ctx.response.set('content-type', 'application/json');
    ctx.response.set('content-type', 'html');
    await next();
});

router.get('/', async (ctx, next) => {
    ctx.response.body = `<h1>Index</h1>
        <form action="/signin" method="post">
            <p>Name: <input name="name" value="koa"></p>
            <p>Password: <input name="password" type="password"></p>
            <p>author: <input name="author" type="text"></p>
            <p>title: <input name="title" type="text"></p>
            <p>body: <input name="body" type="text"></p>
            <p><input type="submit" value="Submit"></p>
        </form>`;
});

router.post('/signin', async (ctx, next) => {
    
    var name = ctx.request.body.name || '',
        password = ctx.request.body.password || '';
    let msg = new User({
        password: password,
        name: name,
        author: ctx.request.body.author || '',
        title: ctx.request.body.title || '',
        body: ctx.request.body.body || ''
    })
    msg.save((err,res) => {
        if (err) {
            console.log(err)
            return
        }
        console.log('save success issue')
    })
    const token = sign({name}, secret, {expiresIn: '1h'})
    if (name === 'koa' && password === '123') {
        ctx.response.body = `<h1>Welcome, ${name}!</h1><div>token: ${token}</div>`;
    } else {
        ctx.response.body = `<h1>Login failed!</h1>
        <p><a href="/">Try again</a></p>`;
    }
});

async function getUserById (name) {
    return await User.find({
        name: name
    })
}

router.get('/hello/:name', async (ctx, next) => {
    ctx.type = JSON_TYPE
    let name = ctx.params.name;
    console.log(User.find({
        name: name
    }))
    ctx.body = {
        status: 0,
        data: await getUserById(name)
    }
})

// koa-bodyparser必须在router之前被注册到app对象上
app.use(bodyParser());
app.use(static(
    path.join(__dirname, staticPath)
))
// add router middleware:
app.use(router.routes());
// 在端口3000监听:
app.listen(3002);
console.log('app started at port 3002...');
