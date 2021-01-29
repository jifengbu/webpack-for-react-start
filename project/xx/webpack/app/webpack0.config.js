/* eslint-disable */
var webpack = require('webpack');
var nodeExternals = require('webpack-node-externals');
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlPlugin = require('webpack-html-plugin');
var config = require('../../config');

module.exports = {
    entry: [
        'whatwg-fetch',
        'babel-polyfill',
        './App/app/index.js',
    ],
    output: {
        filename: 'bundle.js',
        path: '../app/www',
        publicPath: './',
    },
    resolve: {
        modulesDirectories: ['shared', 'node_modules'],
        extensions: ['', '.web.js', '.jsx', '.js', '.json'],
    },
    plugins: [
        // new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        // new webpack.optimize.OccurenceOrderPlugin(),
        // new CopyWebpackPlugin([
        //     {context: 'assets', from: '**/*', to: './hbclient/'} // `to` is relative to output.path
        // ]),
        // new webpack.optimize.DedupePlugin(),
        // new webpack.optimize.UglifyJsPlugin(),
        new ExtractTextPlugin('bundle.css'),
        new HtmlPlugin({ template: "./App/app/index.html" }),
    ],
    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/,
                loader: 'webpack-replace-loader',
                exclude: /node_modules/,
                query: { search: '/hbclient/img/', replace: './hbclient/img/', attr: 'g' },
            },
            {
                test: /\.(js|jsx)$/,
                loader: 'webpack-replace-loader',
                exclude: /node_modules/,
                query: { search: '/hb/api/upload', replace: `${config.apiServer}/hb/api/upload`, attr: 'g' },
            },
            {
                test: /\.(js|jsx)$/,
                loader: 'webpack-replace-loader',
                exclude: /node_modules/,
                query: { search: '/hb/api/member/upload', replace: `${config.apiServer}/hb/api/member/upload`, attr: 'g' },
            },
            {
                file: ['App/shared/relatejs/helpers/request.js'],
                loader: 'webpack-replace-loader',
                query: { search: '/hbclient/graphql', replace: `${config.apiServer.replace('3030', '3031')}/hbclient/graphql` },
            },
            {
                test: /\.(js|jsx)$/,
                loader: 'babel',
                exclude: /node_modules/,
                query: {
                    cacheDirectory: true,
                    presets: ['react', 'es2015', 'stage-0'],
                    plugins: [
                        'transform-decorators-legacy',
                        'transform-react-constant-elements',
                        'transform-react-inline-elements',
                        ["import", [{ "style": "css", "libraryName": "antd" }]],
                    ]
                }
            },
            {
                test: /\.json$/,
                loader: 'json',
            },
            {
                test: /\.(png|jpg|jpeg|gif)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'url',
            },
            {
                test: /\.(woff|woff2|ttf|eot|svg)$/,
                loader: 'file-loader?name=fonts/[name].[ext]',
            },
            // {
            //     test: /\.less$/,
            //     loader: ExtractTextPlugin.extract('style', 'webpack-replace-loader?{"search":"/hbclient/img/","replace":"./hbclient/img/","attr":"g"}!css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss!less', {
            //         publicPath: '../css/',
            //     }),
            // },
            // {
            //     test: /\.css$/,
            //     loader: ExtractTextPlugin.extract('style', 'css!postcss', {
            //         publicPath: '../css/',
            //     }),
            // },
        ],
    },
    postcss: function () {
        return [autoprefixer];
    },
};
