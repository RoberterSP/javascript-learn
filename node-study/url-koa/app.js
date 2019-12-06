const Koa = require('koa');

const path = require('path')

const bodyParser = require('koa-bodyparser');

const controller = require('./controller');

const static = require('koa-static')

const staticPath = './static'

const low = require('lowdb');

const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('./db.json');

const db = low(adapter);

const app = new Koa();

app.use(static(path.join(__dirname, staticPath)))

// db.defaults({posts: [], user: {}, count: 0})
//   .write();
 
// db.get('posts')
//   .push({id: 1, title: 'lowdb is awesome'})
//   .write()
 
// db.set('user.name', 'typicode').write()
// db.update('count', n => n + 1).write()
// log request URL:
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    await next();
});

// parse request body:
app.use(bodyParser());

// add controllers:
app.use(controller());

app.listen(3033);
console.log('app started at port 3000...');
