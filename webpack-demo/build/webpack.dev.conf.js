var webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 通过 npm 安装
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpackDevServer = require('webpack-dev-server');
const  cleanWebpackPlugin =require('clean-webpack-plugin');
var path = require('path');
const HtmlWebpackPluginConfig={
    title: 'hello,零和壹在线课堂', // html5文件中<title>部分
    filename: 'front.html', // 默认是index.html，服务器中设置的首页是index.html，如果这里改成其它名字，那么devServer.index改为和它一样
    // 也是 context+template是最后模板的完整路径，./不能少
    template: './index.html', // 如果觉得插件默认生成的hmtl5文件不合要求，可以指定一个模板，模板文件如果不存在，会报错，默认是在项目根目录下找模板文件，才模板为样板，将打包的js文件注入到body结尾处
    inject:'body', // true|body|head|false，四种值，默认为true,true和body相同,是将js注入到body结束标签前,head将打包的js文件放在head结束前,false是不注入，这时得要手工在html中加js
}


module.exports = {
    context: path.resolve(__dirname,'../src'), //设置根目录
    entry: './main/main.js', //main.js中的js可以省略，前面的./不能省   './js/ceshi.js'
    output:{
        path:path.resolve(__dirname,'../dist'),
        filename: './app[hash].js',
        hashDigestLength: 8
    },
    module: {        
        rules: [       
            {
                test: /\.css$/,
                use: [
                    { loader: 'style-loader'},
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true
                        }
                    }
                ]
            },
            {
                test: /\.html$/,
                use: {
                    loader: 'html-loader',
                    options: {
                        attrs: [':data-src']
                    }
                }
            },
            {
                test: /\.(png|jpe?g|gif|svg|cur)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: ('img/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                  {
                    loader: 'file-loader',
                    options: {
                        //name: '[path][name].[ext]',
                        name: '[name].[ext]', //最后生成的文件名是 output.path+ outputPaht+ name，[name],[ext],[path]表示原来的文件名字，扩展名，路径
                        //useRelativePath:true,
                        outputPath: 'img/' // 后面的/不能少
                    }  
                  }
                ]
              }
            ]
      },
    plugins: [
        new HtmlWebpackPlugin(HtmlWebpackPluginConfig), // 生成首页html5文件，外部插件需要安装
        // new webpack.DefinePlugin({BJ: JSON.stringify('北京'),}), // 内置插件，无须安装，可以理解为它是webpack实例的一个方法，该插件相当于apache等web服务器上定义一个常量
        new UglifyJsPlugin(),
        new cleanWebpackPlugin("../dist/*.*", {
            root: __dirname,
            verbose: true,
            dry: false
        }),
        new HtmlWebpackPlugin({
            template: './index.html',
            title: 'webpack-demo of title'
        })
    ], 
    devServer: {
      contentBase: path.resolve(__dirname,'../dist'), //网站的根目录为 根目录/dist，这个路径一般与output.path一致，因为html插件生成的html5页是放在output.path这个目录下
      port: 9000, //端口改为9000
      open:true, // 自动打开浏览器，每次启动服务器会自动打开默认的浏览器
      index:'front.html', // 与HtmlWebpackPlugin中配置filename一样
      inline:true, // 默认为true, 意思是，在打包时会注入一段代码到最后的js文件中，用来监视页面的改动而自动刷新页面,当为false时，网页自动刷新的模式是iframe，也就是将模板页放在一个frame中
      hot:false,
      compress:true //压缩
    },
    mode: "development"
}