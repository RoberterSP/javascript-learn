const express = require('express');
const app = express();// express.static 提供静态文件，就是html, css, js 文件
app.use(express.static('public'));

// 电话号码返回省和市，为了模拟延迟，使用了setTimeout
app.post('/phoneLocation', (req, res) => {
    setTimeout(() => {
        res.json({
            success: true,
            obj: {
                province: '广东',
                city: '深圳'
            }
        })
    }, 1000);
})

// 返回面值列表
app.post('/faceList', (req, res) => {
    setTimeout(() => {
        res.json(
            {
                success: true,
                obj:['20元', '30元', '40元']
            }
            
        )
    }, 1000);
})

app.listen(3000, () => {
    console.log('server start');
})