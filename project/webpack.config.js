const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/main.js',
    output:{
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
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
            }
        ]
    },
    plugins:[
        new HtmlWebPackPlugin({ template:'./src/index.html' })
    ]
}
