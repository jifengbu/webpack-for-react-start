/* eslint-disable */
var webpack = require('webpack');
var nodeExternals = require('webpack-node-externals');
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var path = require('path');

var commonResolve = {
    modulesDirectories: ['shared', 'node_modules'],
    extensions: ['', '.web.js', '.jsx', '.js', '.json'],
};

var commonLoaders = [
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
    }
];

module.exports = [
    {
        name: 'Client side',
        entry: {
            client: ['./App/client/client.js'],
            auth: ['./App/client/auth.js'],
            public: ['./App/client/public.js'],
        },
        output: {
            path: '../dist/public/hbclient/assets',
            filename: '[name].js',
            chunkFilename: "[name].chunk.js",
            publicPath: '/hbclient/assets/',
        },
        resolve: commonResolve,
        plugins: [
            new webpack.NoErrorsPlugin(),
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify('production')
                }
            }),
            new webpack.optimize.OccurenceOrderPlugin(),
            new webpack.optimize.CommonsChunkPlugin('common.js', ['client', 'auth', 'public']),
            new webpack.optimize.CommonsChunkPlugin({ children: true, async: 'children-async' }),
            new CopyWebpackPlugin([
                {context: 'assets', from: '**/*', to: '../'} // `to` is relative to output.path
            ]),
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.UglifyJsPlugin(),
            new ExtractTextPlugin('[name].css', {allChunks: true}),
        ],
        module: {
            loaders: commonLoaders.concat(
                {
                    test: /\.less$/,
                    loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss!less', {
                        publicPath: '../css/',
                    }),
                },
                {
                    test: /\.css$/,
                    loader: ExtractTextPlugin.extract('style', 'css!postcss', {
                        publicPath: '../css/',
                    }),
                }
            )
        },
        postcss: function () {
            return [autoprefixer];
        },
    },
    {
        name: 'Server side',
        entry: './app.js',
        output: {
            path: path.join(__dirname, '..', '..', '..', 'dist'),
            filename: 'app.js'
        },
        target: 'node',
        externals: [nodeExternals()],
        node: {
            console: false,
            global: false,
            process: false,
            Buffer: false,
            __filename: false,
            __dirname: false,
            setImmediate: false,
        },
        resolve: commonResolve,
        plugins: [
            new webpack.NoErrorsPlugin(),
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify('production'),
                },
            }),
            new webpack.optimize.OccurenceOrderPlugin(),
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.UglifyJsPlugin(),
            new ExtractTextPlugin('[name].css', {allChunks: true}),
        ],
        module: {
            loaders: commonLoaders.concat(
                {
                    test: /\.less$/,
                    loader: ExtractTextPlugin.extract('css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss!less'),
                },
                {
                    test: /\.css$/,
                    loader: ExtractTextPlugin.extract('css!postcss'),
                },
            )
        },
        postcss: function () {
            return [autoprefixer];
        }
    }
];
