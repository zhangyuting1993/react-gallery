var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');



/*
工具函数
 */
var utils = require("./util");
var fullPath = utils.fullPath;
var pickFiles = utils.pickFiles;

/*
一些项目路径
 */
var ROOT_PATH = fullPath('../');
var SRC_PATH = ROOT_PATH + '/src';
var DIST_PATH = ROOT_PATH + '/dist';
var NODE_MODULES_PATH = ROOT_PATH + '/node_modules';

/*
环境判断
 */

var __DEV__ = process.env.NODE_ENV != 'production';


var args = process.argv;
var uglify = args.indexOf('--uglify') > -1;



/*
模块名简化
 */
var alias = pickFiles({
    id: /(component\/[^\/]+).js$/,
    pattern: SRC_PATH + '/component/*.js'
})



alias = Object.assign(alias, pickFiles({
    id: /(data\/[^\/]+).json$/,
    pattern: SRC_PATH + '/data/*.json'
}))



var config = {
    context: SRC_PATH,
    entry: {
        index: [SRC_PATH + '/index.js'],
        lib: ['react', 'react-dom']
    },
    output: {
        path: DIST_PATH,
        filename: 'js/[name].[hash].js'
    },
    module: {

    },
    resolve: {
        alias: alias
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || 'development')
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }

        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            chunks: ['index', 'lib'],
            template: SRC_PATH + '/index.html',
            minify: {
                collapseWhitespace: true,
                collapseInlineTagWhitespace: true,
                removeRedundantAttributes: true,
                removeEmptyAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                removeComments: true
            }
        }),


        new webpack.optimize.CommonsChunkPlugin(['lib', 'manifest'])

    ]
}


var CACHE_PATH = ROOT_PATH + '/cache';
config.module.loaders = [];

config.module.loaders = [{
    test: /\.js$/,
    exclude: /node_modules/,
    loaders: ['babel-loader?cacheDirectory=' + CACHE_PATH]
}]

config.module.loaders.push({
    test: /\.(scss|css)$/,
    loaders: ['style-loader', 'css-loader', 'sass-loader', 'postcss-loader']
})

config.module.loaders.push({
    test: /\.(?:jpg|gif|png|svg|ttf|woff|woff2|eot)$/,
    loaders: [
        'url-loader?limit=8000'
    ]
});

config.module.loaders.push({
    test: /\.json$/,
    loaders: ['json-loader']
});


if (uglify) {
    config.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            output: {
                comments: false
            }
        })
    );
}



// config.plugins.push(new webpack.LoaderOptionsPlugin({
//     options: {
//         postcss: function() {
//             return  [autoprefixer];
//         }
//     }
// }))

// 内嵌 manifest 到 html 页面
config.plugins.push(function() {
    this.plugin('compilation', function(compilation) {

        compilation.plugin('html-webpack-plugin-after-emit', function(file, callback) {
            var manifest = '';

            Object.keys(compilation.assets).forEach(function(filename, index) {
                if (/\/?manifest.[^\/]*js$/.test(filename)) {
                    manifest = '<script>' + compilation.assets[filename].source() + '</script>';
                }
                //console.log({filename:filename})

                //console.log({"manifest":manifest})
            });

            if (manifest) {
                var htmlSource = file.html.source();
                //console.log({htmlSource:htmlSource})
                htmlSource = htmlSource.replace(/(<\/head>)/, manifest + '$1');
                file.html.source = function() {
                    return htmlSource;
                };
            }
            callback(null, file);
        });
    });
});




module.exports = config;
