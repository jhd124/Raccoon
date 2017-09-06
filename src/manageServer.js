var express= require('express');
var app=express();
var fs=require('fs')
var assert = require('assert');
var template = require('art-template');
var bodyparser = require('body-parser');
var movieData = require('./lib/movieDataManipulate');
var credentials = require('./lib/credentials.js');
var spider = require('./lib/spider.js')
var user = require('./lib/user.js');
var gm = require('gm');
var imageMagick = gm.subClass({imageMagick : true});
var admin = new user();
var normalizeFileName = require('./lib/normalizeFileName');
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
var server=app.listen(3551,function(){
	var addr = getAddress();
	var port=server.address().port;
	console.log("listening at %s:%s\r\n",addr,port);
});


//修改管理员用户名密码
app.post('/manager/revise',function(req,res){
	var oldpassword = req.body.oldpassword;
	var newpassword = req.body.newpassword||admin.getPassword();
	var newusername = req.body.newusername||admin.getUserName();
	if(admin.password===oldpassword){
		admin.setHistory(admin.getUserName())
		admin.setPassword(newpassword);
		admin.setUserName(newusername);
		admin.save(function(err){
			if(err){
				console.log(err);
				res.send("fail");
			}else{
				admin.init();
				console.log("管理员修改用户名/密码")
				res.send("success");
			}
		});
	}else{
		res.send("incorrectPassword")
	}
})

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
		roleEn1: req.body.roleEn1,
		roleEn2: req.body.roleEn2,
		roleEn3: req.body.roleEn3,
		roleEn4: req.body.roleEn4,
		year: req.body.year,
		catagory: req.body.catagory,
		story: req.body.story
	}
	return data;
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

//添加数据库条目
var conflict_id_create = "";
var conflict_id_update = "";
//主页电影名文件更新
app.get('/dataReview/updateIndexMovieNameData',function(req,res){
	movieData.findMovies({fields:{_id:0,movieName:1,movieNameChinese:1,director:1,catagory:1,country:1}},function(doc,num){
		var data = 'var movieNameArray='+JSON.stringify(doc)
		fs.writeFile("./public/js/indexMovieNameData.js",data,function(err){
			if(err){
				console.log(err)
				res.end('服务器发生错误')
			}else{
				res.end('success')
			}
		})
	})
})

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
//删除操作
function removeDir(path){
	var files = [];
    if( fs.existsSync(path) ) {
        files = fs.readdirSync(path);
		for(var i=0;i<files.length;i++){
            var curPath = path + "/" + files[i];
            if(fs.statSync(curPath).isDirectory()) { // recurse
                removeDir(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
		}
		fs.rmdirSync(path);
        }
    }
// function removePosters(filename){
// 	var rootPath = './public/img/cover/'
// 	fs.unlink(rootPath+"large-"+filename+'.jpg', function(err){
// 		if(err){
// 		console.log(err)
// 		}else{
// 			console.log('large poster deleted');
// 		}
// 	});
// 		fs.unlink(rootPath+"medium-1x-"+filename+'.jpg', function(err){
// 		if(err){
// 		console.log(err)
// 		}else{
// 			console.log('medium-1x poster deleted');
// 		}
// 	});
// 		fs.unlink(rootPath+"medium-2x-"+filename+'.jpg', function(err){
// 		if(err){
// 		console.log(err)
// 		}else{
// 			console.log('medium-2x poster deleted');
// 		}
// 	});
// 		fs.unlink(rootPath+"small-1x-"+filename+'.jpg', function(err){
// 		if(err){
// 		console.log(err)
// 		}else{
// 			console.log('small-1x poster deleted');
// 		}
// 	});
// 		fs.unlink(rootPath+"small-2x-"+filename+'.jpg', function(err){
// 		if(err){
// 		console.log(err)
// 		}else{
// 			console.log('small-2x poster deleted');
// 		}
// 	});
// 		fs.unlink(rootPath+"small-3x-"+filename+'.jpg', function(err){
// 		if(err){
// 		console.log(err)
// 		}else{
// 			console.log('large poster deleted');
// 		}
// 	});
// }
app.get('/deleteRecord',function(req,res){
	try{
	var filename = normalizeFileName(req.query['_id'].split('|')[1]);
	var path = './public/movie/'+filename;	
	var posterPath = './public/img/cover/'+filename;
	setTimeout(function(){removeDir(path)},0);
	setTimeout(function(){removeDir(posterPath)},0);
	// removePosters(filename);
	movieData.deleteOneMovie(req.query);
	res.end('deleted');
	}catch(e){
		console.log(e);
		res.end('something wrong/n/r'+e);
	}
})
app.post('/manager/login',function(req,res){

	var password = req.body.password;
	var userName = req.body.userName;
	if (admin._id===userName&&admin.password===password) {
		rs = randomString();
		res.cookie('lid',rs);
		res.redirect('/dataReview.html');
	}else if(admin._id!==userName){
		// console.log(admin._id);
		// console.log(userName)
		res.send('请检查用户名')
	}else{
		res.send("请检查密码")
	}
})
app.get('/logout',function(req,res){
	res.cookie('lid',"0");
	res.redirect("/login.html")
})
app.post('/passwordModify',function(req,res){
	admin.setPassword(req.body.password);
	admin.save();
	res.send('success');
})
app.get("/dataReview.html",function(req,res){
	if(req.cookies.lid!==rs){
		res.render("login");
	}else{
		res.render("dataReview")
	}
})
//设置主页路由
app.get('/',function(req,res){
	if(req.cookies.lid!==rs){
		res.render("login");
	}else{
		res.render("dataReview")
	}
})
app.get("/retriveMovieData",function(req,res){
		if(req.cookies.lid!==rs){
			res.send("请登陆");
		}else if(req.query.MtimeUrl===""){
			res.send("MtimeUrl为空")
		}else{
			var url = req.query.MtimeUrl
			console.log(url)
			//var url = 'http://movie.mtime.com/10964/'
			// spider.setSpiderUrl('http://movie.mtime.com/10964/')
			spider.getMtimeData(url,function(data,pic){
				if(req.query.operation==='q'){
					var movieData = JSON.stringify(data)
					console.log(data)
					res.send(movieData);
				}else if(req.query.operation==='s'){
					var actors = pic.actors;
					var charas = pic.chatactors;
					var normalizedfilename = normalizeFileName(data.movieName);
					var rootPath = './public/movie/'+normalizedfilename;
					console.log(normalizeFileName(data.movieName))
					fs.mkdir(rootPath,function(err){
						if((err!==null&&err.code==="EEXIST")||err===null){
							spider.savePost(rootPath,function(err){
								if(err){
									console.log(err)
								}else{
									var destPath = './public/img/cover/'+normalizedfilename+'/';
									console.log(rootPath,destPath)
									fs.mkdir(destPath,function(err){
										if((err!==null&&err.code==="EEXIST")||err===null){
											resizePoster(rootPath,destPath,250,"large-"+normalizeFileName(data.movieName));
											resizePoster(rootPath,destPath,110,"medium-1x-"+normalizeFileName(data.movieName));
											resizePoster(rootPath,destPath,220,"medium-2x-"+normalizeFileName(data.movieName));
											resizePoster(rootPath,destPath,110,"small-1x-"+normalizeFileName(data.movieName));
											resizePoster(rootPath,destPath,220,"small-2x-"+normalizeFileName(data.movieName));
											resizePoster(rootPath,destPath,330,"small-3x-"+normalizeFileName(data.movieName));
										}else{
											console.log(err);
										}
									})
									
								}
							});
							fs.mkdir(rootPath+'/'+'actors',function(err){
								if((err!==null&&err.code==="EEXIST")||err===null){
								actors.forEach(function(e){
									spider.savePic(data.movieName,e);
								})
							}else{
								console.log(err);
							}
							})
							fs.mkdir(rootPath+'/'+'roles',function(err){
								if((err!==null&&err.code==="EEXIST")||err===null){
								charas.forEach(function(e){
									spider.savePic(data.movieName,e);
								})
							}else{
								console.log(err);
							}
							})
						}else{
							console.log(err);
						}
					})

					res.send('success');
				}
			})
		}
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

function resizePoster(sourcePath,destPath,size,suffix){
	imageMagick(sourcePath+'/poster.jpg').resize(size).autoOrient().write(destPath+suffix+'.jpg',function(err){
		if(err){
			console.log(err);
		}else{
			console.log(size+' version of the poster has been saved');
		}
	})
}