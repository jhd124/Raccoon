var express= require('express');
var app=express();
var assert = require('assert');
var template = require('art-template');
var bodyparser = require('body-parser');
var movieData = require('./lib/movieDataManipulate');
var credentials = require('./lib/credentials.js');
var spider = require('./lib/spider.js')
var user = require('./lib/user.js');
var admin = new user();
admin.init();
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

//处理包装保存请求的请求体
function packReqData(req,id){
	var data = {
				_id: id,
				movieName: req.body.movieName,
				movieNameChinese: req.body.movieNameChinese,
				director: req.body.director,
				playwritter: req.body.playwritter,
				country: req.body.country,
				publisher: req.body.publisher,
				rating: req.body.rating,
				actor1Chinese: req.body.actor1Chinese,
				actor1En: req.body.actor1En,
				actor2Chinese: req.body.actor2Chinese,
				actor2En: req.body.actor2En,
				actor3Chinese: req.body.actor3Chinese,
				actor3En: req.body.actor3En,
				actor4Chinese: req.body.actor4Chinese,
				actor4En: req.body.actor4En,
				role1: req.body.role1,
				role2: req.body.role2,
				role3: req.body.role3,
				role4: req.body.role4,
				year: req.body.year,
				catagory: req.body.catagory,
				story: req.body.story
			}
		return data;
}
//处理get查询请求
/**
 * /
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

//添加数据库条目
var conflict_id_create = "";
var conflict_id_update = "";


//查询所有数据(加载页面时执行)
app.get('/dataReview/findAllMovies', function (req, res) {
    var numPerPage = parseInt(req.query.numPerPage)||30;
    var currentPage = parseInt(req.query.currentPage)||1;
    var sorter = JSON.parse(req.query.sorter) || { movieName: 1 };
    var filter = JSON.parse(req.query.filter) || {};
   	
    var options = queryOption(numPerPage, currentPage, sorter,filter);
    movieData.findMovies(options, function (doc,num) {
        doc.push(num);
		console.log(new Date().toLocaleString()+'|'+' 管理员查询数据\r\n')
		res.cookie('kindle','yoyoyoyoyoyoyo',{signed:true})
		res.end(JSON.stringify(doc));
	})
});

app.get('/movieName/:movieName',function(req,res){
	if(req.params.movieName){
	var get_filter = {movieName:req.params.movieName};
	var a = req.params.movieName;
	movieData.findOneMovie({movieName: a},function(doc){
		
		var address = getAddress();
		var port = server.address().port;
		var data = {
			CSS1: 'http://'+address+':'+port+'/css/bootstrap.min.css',
			CSS2: 'http://'+address+':'+port+'/css/style.css',
			logoPath:'http://'+address+':'+port+'/img/logo.png',
			moviePath: 'http://'+address+':'+port+'/movie/'+doc.movieName+'.mp4',
			movieName: doc.movieName,
			movieNameChinese: doc.movieNameChinese,
			posterPath:'http://'+address+':'+port+'/movie/'+doc.movieName+'/poster.jpg',
			director: doc.director,
			playwritter: doc.playwritter,
			country: doc.country,
			publisher: doc.publisher,
			rating: doc.rating,
			actor1Chinese: doc.actor1Chinese,
			actor1En: doc.actor1En,
			actor1Path:'http://'+address+':'+port+'/movie/'+doc.movieName+'/actors/'+deleteSpace(doc.actor1En)+'.jpg',
			actor2Chinese: doc.actor2Chinese,
			actor2En: doc.actor2En,
			actor2Path:'http://'+address+':'+port+'/movie/'+doc.movieName+'/actors/'+deleteSpace(doc.actor2En)+'.jpg',
			actor3Chinese: doc.actor3Chinese,
			actor3En: doc.actor3En,
			actor3Path:'http://'+address+':'+port+'/movie/'+doc.movieName+'/actors/'+deleteSpace(doc.actor3En)+'.jpg',
			actor4Chinese: doc.actor4Chinese,
			actor4En: doc.actor4En,
			actor4Path:'http://'+address+':'+port+'/movie/'+doc.movieName+'/actors/'+deleteSpace(doc.actor4En)+'.jpg',
			role1: doc.role1,
			role2: doc.role2,
			role3: doc.role3,
			role4: doc.role4,
			role1Path: 'http://'+address+':'+port+'/movie/'+doc.movieName+'/roles/'+doc.role1+'.jpg',
			role2Path: 'http://'+address+':'+port+'/movie/'+doc.movieName+'/roles/'+doc.role2+'.jpg',
			role3Path: 'http://'+address+':'+port+'/movie/'+doc.movieName+'/roles/'+doc.role3+'.jpg',
			role4Path: 'http://'+address+':'+port+'/movie/'+doc.movieName+'/roles/'+doc.role4+'.jpg',
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
//修改数据
	// app.post('/updateRecord',function(req,res){
	// 	// movieData.updateOneMovie()
		
	// 	var data = packReqData(req,req.body._id);
	// 	movieData.updateOneMovie(data);
	// 	res.end('updated');
	// });
//接到提交的数据
	app.post('/submit',function(req,res){
		//若记录已经存在，则响应一个字符串'exists'
		if(req.body.operation==='update'){
		    movieData.findOneMovie({_id: req.body._id},function(doc){
			if(doc.movieName===req.body.movieName){
				var data = packReqData(req,req.body._id);
				movieData.updateOneMovie(data);
				res.end('updated');
			}else{
				movieData.findOneMovie({movieName: req.body.movieName},function(doc1){
					if(doc1){
						conflict_id_update = doc1._id;
						res.end('exists');
					}else{
						var data = packReqData(req,req.body._id);
						movieData.updateOneMovie(data);
						res.end('updated');
					}
				})
				
			}
		})
		}else if(req.body.operation==='create'){
			movieData.findOneMovie({movieName: req.body.movieName},function(doc){
			if(doc){
				conflict_id_create = doc._id;
				res.end('exists')
			}else{
				var id = movieData.primeKey(req.body.movieName)
				var data = packReqData(req, id);
				movieData.addOneMovie(data);
				res.end('inserted');
			}
		})
		}else{
			// res.status(404);
			// res.send('404 - Not Found');
			res.end('error');
		}
	});
	app.post('/override',function(req,res){
		if(req.body.operation==='update'){
			var data = packReqData(req, conflict_id_update);
			conflict_id_update = "";
			movieData.updateOneMovie(data);
			movieData.deleteOneMovie({_id: req.body._id});
			res.end('overrided')
		}else if(req.body.operation==='create'){
			var data = packReqData(req, conflict_id_create);
			conflict_id_create = "";
			movieData.updateOneMovie(data);
			res.end('overrided')
		}else{
			
			res.end('error');
		}
	});
	app.get('/deleteRecord',function(req,res){
		movieData.deleteOneMovie(req.query);
		console.log(req.query)
		res.end('deleted')
	})
	app.post('/login',function(req,res){

		var password = req.body.password;
		var userName = req.body.userName;
		if (admin._id===userName&&admin.password===password) {
		rs = randomString();
		res.cookie('lid',rs);
		res.redirect('/dataReview.html');
	}else if(admin._id!==userName){
		console.log(admin._id);
		console.log(userName)
		res.send('请检查用户名')
	}else{
		res.send("请检查密码")
	}
	})
	app.get('/logout',function(req,res){
		res.cookie('lid',"0");
		res.render("index")
	})
	app.post('/passwordModify',function(req,res){
		admin.setPassword(req.body.password);
		admin.save();
		res.send('success');
	})
	app.get("/dataReview.html",function(req,res){
		if(req.cookies.lid!==rs){
			res.send("请登陆");
		}else{
			res.render("dataReview")
		}
	})
	app.get("/retriveMovieData",function(req,res){
		// if(req.cookies.lid!==rs){
		// 	res.send("请登陆");
		// }else{
			 var url = req.query.MtimeUrl
			//var url = 'http://movie.mtime.com/10964/'
			// spider.setSpiderUrl('http://movie.mtime.com/10964/')
			console.log(url)
			spider.getMtimeData(url,function(data){

				var movieData = JSON.stringify(data)
				res.send(movieData);
			})
		// }
	})

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