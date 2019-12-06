var fn_index = async (ctx, next) => {
    ctx.response.body = `<h1>Index</h1>
        <form action="/get_account" method="post">
            <p>Name: <input name="name" value="koa"></p>
            <p>Password: <input name="password" type="password"></p>
            <p><input type="submit" value="Submit"></p>
        </form>`;
};

let acount = {
    status: 200,
    data: {
        name: '张三',
        code: 'zhangsan'
    }
}
var fn_signin = async (ctx, next) => {
    var name = ctx.request.body.name || '',
        password = ctx.request.body.password || '';
    if (name === 'koa' && password === '12345') {
        ctx.response.body = `<h1>Welcome, ${name}!</h1>`;
    } else {
        ctx.response.body = acount;
    }
};

module.exports = {
    'GET /': fn_index,
    'POST /get_account': fn_signin
};