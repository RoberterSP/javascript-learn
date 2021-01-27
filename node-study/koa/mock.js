const Mock = require('mockjs')
var data = Mock.mock({
    'token': 'token',
    // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
    'list|3': [{
        // 属性 id 是一个自增数，起始值为 1，每次增 1
        'id|+1': 1,
        "name": "@cword(10)",
        "descript": "@csentence(20,50)",
        "price": "@float(10,100,10,100)",
        'data': '@datetime("yyyy-MM-dd MM:dd:dd")',
        '_randomDate': '@_randomDate',
        'image': '@image',
        'rank|1-100': 100,
        'address': '@county(true)',
        "natural": "@natural(60, 100)",
        "float": "@float(1,2,3,4)",
        "boolean": "@boolean( 1, 2, true )",
        'email': '@email',
        "string|1-10": "=",
        "ip": "@ip",
        'zip': '@zip',
        'cname': '@cname',
        'name':'@name',
    }]
})
console.log(data)