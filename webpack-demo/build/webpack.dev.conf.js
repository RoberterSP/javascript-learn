const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig={
    title: 'hello,零和壹在线课堂', // html5文件中<title>部分
    filename: 'front.html', // 默认是index.html，服务器中设置的首页是index.html，如果这里改成其它名字，那么devServer.index改为和它一样，最终完整文件路径是output.path+filename，如果filename中有子文件夹形式，如`./ab/cd/front.html`，只取`./front.html`
    template: './src/index.html', //如果觉得插件默认生成的hmtl5文件不合要求，可以指定一个模板，模板文件如果不存在，会报错，默认是在项目根目录下找模板文件，才模板为样板，将打包的js文件注入到body结尾处
    // inject:head  // true|body|head|false，四种值，默认为true,true和body相同,是将js注入到body结束标签前,head将打包的js文件放在head结束前,false是不注入，这时得要手工在html中加js
}
module.exports = {
    entry: './src/main', //main.js中的js可以省略，前面的./不能省
    output:{
        filename:'./dist/[hash]app.js',
        hashDigestLength: 8
    },
    plugins: [new HtmlWebpackPlugin(HtmlWebpackPluginConfig)], //先不配置插件，看看效果
    devServer: {
      contentBase: path.join(__dirname, "../dist"), //网站的根目录为 根目录/dist
      port: 9000, //端口改为9000
      open:true, // 自动打开浏览器
      index:'front.html' // 与HtmlWebpackPlugin中配置filename一样
    }
}