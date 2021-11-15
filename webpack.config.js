const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {

    mode:isProduction ? 'production' : 'development',

    entry:isProduction ? './src/index.ts' : './src/devloop.ts',

    cache:{
      type:'filesystem'
    },

    experiments:isProduction ? {
        outputModule:true,
    }:undefined,

    output:isProduction ? {
        path:path.resolve(__dirname,'./release/dist'),
        filename:'index.js',
        libraryTarget: 'module',
        module:true
    } : {
        path:path.resolve(__dirname,'./dist'),
        filename:'index.js',
    },

    resolve:{
        extensions:['.ts','.js'],
        modules: [path.resolve(__dirname,"node_modules")],
    },

    module:{
        rules:[
            {
                test:/\.tsx?$/,
                use:[
                    'babel-loader',
                    'ts-loader'
                ],
                include:path.resolve(__dirname,'src'),
                exclude: path.resolve(__dirname,'node_modules')
            },
            {
                test:/\.js$/,
                loader:'babel-loader',
                exclude: path.resolve(__dirname,'node_modules')
            }
        ]
    },

    plugins:[
        new HtmlWebpackPlugin({
            title:'request 接口请求器',
            filename: './index.html',
            template:path.resolve(__dirname,'public/index.html')
        })
    ],

    devServer:{
        port: 4000,
        hot:true,
        static:{
            directory: path.resolve(__dirname,'public'),
            watch:true
        }
    }

}
