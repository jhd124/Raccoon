var express= require('express');
var app=express();
var assert = require('assert');
var template = require('art-template');
var movieData = require('./lib/movieDataManipulate');
var bodyparser = require('body-parser');
var credentials = require('./lib/credentials.js');
var normalizeFileName = require('./lib/normalizeFileName');
app.use(require('cookie-parser')(credentials.cookieSecret));

/*设置bodyparser中间件，用以解析post请求*/
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

//登陆用的随机序列
var rs="";
// ----------------引入模板引擎----------------
template.config('base', '');
template.config('extname', '.html');
app.engine('.html', template.__express);
app.set('view engine', 'html');
app.set('views', __dirname + '/public');




// get local IP address
var os = require('os');
function getAddress(){
	var interfaces = os.networkInterfaces();
	var addresses = [];
	for (var k in interfaces) {
		for (var k2 in interfaces[k]) {
			var address = interfaces[k][k2];
			if (address.family === 'IPv4' && !address.internal) {
				addresses.push(address.address);
			}
		}
		return addresses[0];
	}
}

//generate random code
function randomString(len) {
	　　len = len || 32;
	　　var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
	　　var maxPos = $chars.length;
	　　var pwd = '';
	　　for (i = 0; i < len; i++) {
		　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
	　　}
	　　return pwd;
}


// start a server
var server=app.listen(3000,function(){
	var addr = getAddress();
	var port=server.address().port;
	console.log("listening at %s:%s\r\n",addr,port);
});




// 删除空格
function deleteSpace(word){
	var word_array = word.split(" ");
	var final = word_array[0].concat(word_array[1]);
	return final;
}

//处理get查询请求
/**
 * 
 * @param {any} numOfPage 每一页的条目数
 * @param {any} currentPage 当前页码
 */
 function queryOption(numOfPage,currentPage,sorter,filter) {
 	var opt = {
 		skipNum: numOfPage * (currentPage - 1),
 		limitNum: numOfPage,
 		sorter: sorter,
 		filter: filter
 	}
 	return opt;
 }




app.get('/movieName/:movieName',function(req,res){
	if(req.params.movieName){
		var get_filter = {movieName:req.params.movieName};
		var a = req.params.movieName;
		movieData.findOneMovie({movieName: a},function(doc){
			var address = getAddress();
			var port = server.address().port;
			var rootUrl = 'http://'+address+':'+port+'/movie/'+normalizeFileName(doc.movieName);
			var data = {
				CSS1: 'http://'+address+':'+port+'/css/bootstrap.min.css',
				CSS2: 'http://'+address+':'+port+'/css/style.css',
				logoPath:'http://'+address+':'+port+'/img/logo.png',
				moviePath: rootUrl+'.mp4',
				movieName: doc.movieName,
				movieNameChinese: doc.movieNameChinese,
				posterPath:rootUrl+'/poster.jpg',
				director: doc.director,
				playwritter: doc.playwritter,
				country: doc.country,
				publisher: doc.publisher,
				rating: doc.rating,
				actor1Chinese: doc.actor1Chinese,
				actor1En: doc.actor1En,
				actor1Path:rootUrl+'/actors/'+normalizeFileName(doc.actor1En)+'.jpg',
				actor2Chinese: doc.actor2Chinese,
				actor2En: doc.actor2En,
				actor2Path:rootUrl+'/actors/'+normalizeFileName(doc.actor2En)+'.jpg',
				actor3Chinese: doc.actor3Chinese,
				actor3En: doc.actor3En,
				actor3Path:rootUrl+'/actors/'+normalizeFileName(doc.actor3En)+'.jpg',
				actor4Chinese: doc.actor4Chinese,
				actor4En: doc.actor4En,
				actor4Path:rootUrl+'/actors/'+normalizeFileName(doc.actor4En)+'.jpg',
				role1: doc.role1?doc.role1:doc.roleEn1,
				role2: doc.role2?doc.role2:doc.roleEn2,
				role3: doc.role3?doc.role3:doc.roleEn3,
				role4: doc.role4?doc.role4:doc.roleEn4,
				role1Path: rootUrl+'/roles/'+normalizeFileName(doc.roleEn1)+'.jpg',
				role2Path: rootUrl+'/roles/'+normalizeFileName(doc.roleEn2)+'.jpg',
				role3Path: rootUrl+'/roles/'+normalizeFileName(doc.roleEn3)+'.jpg',
				role4Path: rootUrl+'/roles/'+normalizeFileName(doc.roleEn4)+'.jpg',
				story: doc.story
			};
	  //渲染模板
	  console.log(new Date().toLocaleString()+'| Client '+req.ip+'| request \"'+doc.movieName+'\" \r\n');
	  res.render('movie',data);
	  res.end();
	});
	}else{
		res.end("这段视频不见了");
	}
});
app.use(express.static('public'));
//如果请求没有进入上述任何一个路由，将落尽这个404中间件
app.use(function(req,res){
	res.type('text/plain');
	res.status(404);
	res.send('404-Not Found')
})
//定制500
app.use(function(err,req,res,next){
	console.error(err.stack);
	res.type('text/plain');
	res.status(500);
	res.send('500-Server Error')
})