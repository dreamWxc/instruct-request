const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

console.log(__dirname);
module.exports = {

    mode:'production',

    entry:__dirname+'/index.ts',

    cache:{
      type:'filesystem'
    },

    experiments:{
        outputModule:true,
    },

    output:{
        path:'/release/applet/dist',
        filename:'index.js',
        libraryTarget: 'module',
        module:true
    },

    resolve:{
        extensions:['.ts','.js'],
        modules: ["/node_modules"],
    },

    module:{
        rules:[
            {
                test:/\.tsx?$/,
                use:[
                    'babel-loader',
                    'ts-loader'
                ],
                include:[
                    '/src',
                    '/platforms/applet'
                ],
                exclude:'/node_modules'
            },
            {
                test:/\.js$/,
                loader:'babel-loader',
                exclude: path.resolve(__dirname,'node_modules')
            }
        ]
    },

    devServer:{
        port: 4000,
        hot:true,
        static:{
            directory: path.resolve(__dirname,'public'),
            watch:true
        }
    }

}
