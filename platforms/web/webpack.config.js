const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {

    mode:'production',

    entry:'./index.ts',

    cache:{
      type:'filesystem'
    },

    experiments:{
        outputModule:true,
    },

    output:{
        path:path.resolve(__dirname,'./release/web/dist'),
        filename:'index.js',
        libraryTarget: 'module',
        module:true
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

    devServer:{
        port: 4000,
        hot:true,
        static:{
            directory: path.resolve(__dirname,'public'),
            watch:true
        }
    }

}
