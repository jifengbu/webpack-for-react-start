/* eslint-disable */
var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var config = require('../../config');
var autoprefixer = require('autoprefixer');
var pxtorem = require('postcss-pxtorem');

var NoErrorsPlugin = webpack.NoErrorsPlugin;
var optimize = webpack.optimize;

var webpackConfig = module.exports = {
    entry: {
        client: ['./App/client/client.js'],
        auth: ['./App/client/auth.js'],
        public: ['./App/client/public.js'],
    },
    output: {
        path: './build/public/client/assets',
        filename: '[name].js',
        chunkFilename: "[name].chunk.js",
        publicPath: 'http://localhost:' + config.devPort + '/hbclient/assets/',
    },
    // devtool: 'eval',
    resolve: {
        modulesDirectories: ['shared', 'node_modules'],
        extensions: ['', '.web.js', '.jsx', '.js', '.json'],
    },
    plugins: [
        new optimize.OccurenceOrderPlugin(),
        new optimize.CommonsChunkPlugin('common.js', ['client', 'auth', 'public']),
        new CopyWebpackPlugin([
            { context: 'assets', from: '**/*', to: '../' }, // `to` is relative to output.path
        ]),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('development'),
            },
        }),
    ],
    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/,
                loader: 'babel',
                exclude: /node_modules/,
                query: {
                    cacheDirectory: true,
                    presets: ['react', 'es2015', 'stage-0'],
                    plugins: ['transform-decorators-legacy',   ['react-transform', {
                        transforms: [
                            {
                                transform: 'react-transform-hmr',
                                imports: ['react'],
                                locals: ['module'],
                            },
                            {
                                transform: 'react-transform-catch-errors',
                                imports: ['react', 'redbox-react'],
                            }
                        ]
                    }], ["import", [{ "style": "css", "libraryName": "antd" }]]],
                }
            },
            {
                test: /\.json$/,
                loader: 'json',
            },
            {
                test: /\.less$/,
                loader: 'style!css-loader?modules&importLoaders=2&localIdentName=[name]__[local]___[hash:base64:5]!less',
            },
            {
                test: /\.css$/,
                loader: 'style!css-loader',
                include: [
                    require.resolve('../../App/node_modules/antd').replace(path.join('lib', 'index.js'), ''),
                    // require.resolve('../../App/node_modules/normalize.css'),
                ],
            },
            {
                test: /\.(woff|woff2|ttf|eot|svg|png|jpg|jpeg|gif)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'url',
            },
        ]
    },
    postcss: function () {
        return [autoprefixer, pxtorem({ rootValue: 100, propWhiteList: [] })];
    },
    devServer: {
        port: config.devPort,
        contentBase: 'http://localhost:' + config.port,
        outputPath: 'build/public/hbclient/assets',
    }
};
