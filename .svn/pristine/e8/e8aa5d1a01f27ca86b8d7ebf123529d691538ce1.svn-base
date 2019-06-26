const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { resolve } = require('path')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

// the path(s) that should be cleaned
let pathsToClean = [
    './dist',
    // 'build'
]

// the clean options to use
let cleanOptions = {
    root: resolve(__dirname, '../'),
    // exclude: ['shared.js'],
    verbose: true,
    dry: false,
}



module.exports = {
    context: resolve(__dirname, '../src'),

    entry: {
        eventPage: "./eventPage.js",
        config: "./config.js",
        content: "./content.js",
    },

    output: {
        filename: '[name].js', // string
        path: resolve(__dirname, '../dist'),
    },

    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"],

        alias: {
            TAOBAO: resolve(__dirname, '../src/taobao'),
            COUNT: resolve(__dirname, '../src/count'),
            TOOL: resolve(__dirname, '../src/tool'),
            ALIMAMA: resolve(__dirname, '../src/alimama')
        },
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ["env", {
                                "targets": {
                                    // "browsers": ["last 2 versions", "safari >= 7"]
                                    "browsers": [
                                        "last 2 versions",
                                        // "safari >= 7",
                                    ],
                                },
                                // "include": ["transform-es2015-arrow-functions", "es6.map"],
                                "exclude": [
                                    "transform-regenerator",
                                    // "es6.set",
                                ],
                            }],
                        ],
                        plugins: [
                            "transform-object-rest-spread",
                        ],
                    },
                },
            },
        ]
    },

    plugins: [
        new CleanWebpackPlugin(pathsToClean, cleanOptions),
        new CopyWebpackPlugin([
            // {output}/to/file.txt
            { from: '../manifest.json', to: '../dist/manifest.json' },
            { from: '../popup.html', to: '../dist/popup.html' },
            { from: '../background.html', to: '../dist/background.html' },
            { from: '../css', to: '../dist/css' },
            { from: '../images', to: '../dist/images' },
            { from: '../js', to: '../dist/js' },
        ]),
        new UglifyJSPlugin(),
    ]

}
