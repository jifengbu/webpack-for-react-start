/* eslint-disable */
const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: [
        'whatwg-fetch',
        'babel-polyfill',
        path.resolve(__dirname, '../../App/app/index.js'),
    ],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, '../app/www'),
        publicPath: '/',
    },
    resolve: {
        modules: ['shared', 'node_modules'],
        extensions: ['*', '.web.js', '.jsx', '.js', '.json'],
    },
    module:{
        rules:[
            {
                test: /\.js(x?)$/,
                exclude: "/node_module/",
                use:{
                    loader: "babel-loader",
                    options: {
                        presets: [
                            '@babel/preset-env', //引入babel
                            '@babel/preset-react', //引入babel-react
                        ],
                    }
                }
            },
            {
                test: /\.less$/i,
                use: [
                    {
                        loader: "style-loader",
                    },
                    {
                        loader: "css-loader",
                        options: {
                            modules: {
                                localIdentName: "[name]__[local]___[hash:base64:5]",
                            },
                        },
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: [
                                    [
                                        "autoprefixer",
                                    ],
                                ],
                            },
                        },
                    },
                    {
                        loader: "less-loader",
                    },
                ],
            },
        ]
    },
    plugins:[
        new HtmlWebPackPlugin({ template:'./App/app/index.html' })
    ]
};
