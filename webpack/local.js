const webpackMerge = require('webpack-merge')
const webpack = require('webpack')
const common = require('./common')


module.exports = webpackMerge(common, {

    // Enable sourcemaps for debugging webpack's output.
    // devtool: "source-map",

    watch: true,
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('local')
        }),
    ]

})
