const path = require('path');

module.exports = {
    entry: './js/index.js',
    output: {
        path: path.resolve('dist'),
        filename: 'bundle.js'
    },
    module: {
        rules: [{
            test: /\.vue$/,
            loaders: ['vue-loader']
        },
        {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'jshint-loader'
        }
        ],
        loaders: [{
            test: /\.css$/,
            loader: 'style!css'
        },
        {
            test: /\.js$/,
            exclude :  /node_modules/,
            loader: 'babel-loader'
        }
        ]
    },
    context: __dirname,
    resolve: {
        modules: [path.resolve('node_modules')],
        extensions: [ '.js', '.vue', '.json' ],
        alias: {
            vue: 'vue/dist/vue.js'
        }
    }   
};