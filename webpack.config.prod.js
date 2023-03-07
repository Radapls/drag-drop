const path = require('path');
const cleanPlugin = require('clean-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: './src/app.ts',
    performance: {
        hints: false
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    devServer: {
        static:
        {
            directory: path.join(__dirname, './')
        },
        compress: true,
        port: 3000

    },
    devtool: false,
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: [ '.ts', '.js' ]
    },
    plugins: [
        new cleanPlugin.CleanWebpackPlugin()
    ]
};