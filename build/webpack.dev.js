var webpack=require('webpack');
var webpackDevServer=require('webpack-dev-server');
var config=require('./webpack.config');
var utils=require('./util');


var PORT=8080;
var HOST=utils.getIP();
var args=process.argv;
var hot=args.indexOf('--hot')>-1;
var deploy=args.indexOf('--deploy')>-1;


var localPublicPath="http://"+HOST+":"+PORT+"/";

config.output.publicPath=localPublicPath;
config.entry.index.unshift('webpack-dev-server/client?'+localPublicPath);


if(hot===true){
	config.entry.index.unshift('webpack/hot/only-dev-server');
	config.module.loaders[0].loaders.unshift('react-hot-loader');
	config.plugins.push(new webpack.HotModuleReplacementPlugin())
}

config.devtool = '#eval-cheap-module-source-map';


new webpackDevServer(webpack(config),{
	hot:hot,
	inline:true,
	compress:true,
	stats:{
		chunks:false,
		children:false,
		colors:true
	},
	historyApiFallback:true,
}).listen(PORT,HOST,function(){
	  console.log(localPublicPath);
});