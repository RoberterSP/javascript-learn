let User = require('./user.js')

// insert data

module.exports = User

function insert() {
    let user = new User({
        title: 'title',
        author: 'csp3',
        body:   'body',
        comments: [{ body: '今天是一个好添加', date: new Date }],
        hidden: false,
        meta: {
            votes: 11,
            favs:  22
        }
    })
    // 保存数据, 保存的方法是实例后,才能够进行保存
    user.save((err, res) => {
        if (err) {
            console.log(err)
        }
        console.log("save user data")
    })
    // 查找数据库里面的数据
    User.find({ author: /^csp3/ }, function (err, res) {
        console.log(res, 'res')
    });
    // 删除数据库里面的数据
    User.remove({
        author: /^cs/
    }).then(()=> {})
    // 支持的方法: find   remove   update where create  (增删改查)
}
// insert()
