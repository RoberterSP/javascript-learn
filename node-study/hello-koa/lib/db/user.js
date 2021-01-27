
const mongoose = require('./connect')

// Schema 注释: schema是mongoose里会用到的一种数据模式，可以理解为表结构的定义；每个schema会映射到mongodb中的一个collection，它不具备操作数据库的能力
const Schema = mongoose.Schema

let categorySchema = new Schema({
    name: String,
    password: String,
    title:  String,
    author: String,
    body:   String,
    comments: [{ body: String, date: Date }],
    date: { type: Date, default: Date.now },
    hidden: Boolean,
    meta: {
      votes: Number,
      favs:  Number
    }
})
// 定义好了Schema，接下就是生成Model。  model是由schema生成的模型，可以对数据库的操作
module.exports = mongoose.model('Blog', categorySchema)


