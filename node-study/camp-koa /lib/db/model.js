
// Mongoose是在node.js异步环境下对mongodb进行便捷操作的对象模型工具
const mongoose = require('mongoose')

const DB_URL = 'mongodb://127.0.0.1:27017/test?safe=true' // mongodb 的连接

// mongodb connect success
mongoose.connect(DB_URL, {
    openId: {
        type: String,
        index: true,
        unique: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date
    },
    name: {
        type: String,
        index: true
    },
    avatar: {
        type: String
    },
    userType: {
        type: Number
    }
})

// 用于判断数据库是否连接成功
const db = mongoose.connection
db.on('error', err => {
    console.log(err)
})

db.on('open', () => {
    console.log('connect success')
})

module.exports = mongoose