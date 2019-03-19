// webpack配置是标准的Node.js CommonJS模块  通过require(..)导入文件
// node.js的特点:支持模块化编程

// 什么是 webpack 模块
// 对比 Node.js 模块，webpack 模块能够以各种方式表达它们的依赖关系，几个例子如下：

// ES2015 import 语句
// CommonJS require() 语句
// AMD define 和 require 语句
// css/sass/less 文件中的 @import 语句。
// 样式(url(...))或 HTML 文件(<img src=...>)中的图片链接(image url)


// 模块热替换(HMR-Hot Module Replacement)功能会在应用程序运行过程中替换/添加/删除模块,无需重新加载整个页面,可以快速提高开发速度;
var webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 通过 npm 安装
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpackDevServer = require('webpack-dev-server');
const  cleanWebpackPlugin =require('clean-webpack-plugin');
var path = require('path');
// var ExtractTextPlugin = require("extract-text-webpack-plugin");
var config = {
    entry: {
        search: path.join(__dirname, 'src', '/js/ceshi.js')
        // app: path.join(__dirname, 'src', '/search/search.js')
    },
    output: {
        filename: '[name].[hash:10].js',
        path: path.join(__dirname,'./dist'),         //在编译时不知道最重要输出文件的目录:path: path.join(__dirname,'./dist/[hash]'),         
        // publicPath: "http://cdn.example.com/assets/[hash]/"
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
                test: /\.(png|jpe?g|gif|svg|cur)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: ('img/[name].[hash:7].[ext]')
                }
            }
        ]
    },
    plugins: [
        new UglifyJsPlugin(),
        new cleanWebpackPlugin("dist/*.*", {
            root: __dirname,
            verbose: true,
            dry: false
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            title: 'webpack-demo of title'
        })
    ],
    devServer: {
        port: 9600,
        host: '0.0.0.0',
        historyApiFallback: true,
        contentBase: './dist',
        inline: true,
        hot: true,
        proxy: {
            "/*/*.do": {
                target: "http://127.0.0.1:4108"
            },
        }
    },
    mode: "development"
};
module.exports = config;