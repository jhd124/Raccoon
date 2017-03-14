var express= require('express');
var app=express();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var template = require('art-template');
var bodyparser = require('body-parser')

//设置bodyparser中间件，用以解析post请求
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
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
// start a server

var server=app.listen(3000,function(){
	var addr = getAddress();
	var port=server.address().port;
	console.log("listening at %s:%s\r\n",addr,port);
});

//app.get()
// connect to mongodb
var url = 'mongodb://localhost:27017/raccoon';
var getAllMovieInfo = function(callback){
	MongoClient.connect(url, function(err,db){
		assert.equal(null, err);
		//console.log("Connected successfully to mongodb server\r\n");

	findDocuments(db,function(doc){//注意！ 回调的绝佳示例，先运行这个“findDocuments” 有了doc 再把doc这个参数放进里面的回调函数
		callback(doc[0]);
		db.close();
	});
});
}

var getOneMovieInfo = function(filter,callback){
	MongoClient.connect(url, function(err,db){
		assert.equal(null, err);
		// console.log("Connected successfully to mongodb server\r\n");

		findOneDocument(db,filter,function(doc){
			callback(doc);
			db.close();
		})
	})
}

//insert a document
var insertDocuments = function(db,callback){
	var collection = db.collection('movies');

	collection.insertMany(
		[{a:1},{a:2}],function(err,result){
			assert.equal(err,null);
			assert.equal(2,result.result.n);
			assert.equal(2,result.ops.length);
			console.log("Inserted 2 documents into the collection\r\n");
			callback(result);
		});
}

//add a movie into database
function addOneMovie(data){
	MongoClient.connect(url, function(err,db){
		assert.equal(null, err);
	var collection = db.collection('movies');
	collection.insertOne(data,function(err){
		assert.equal(err,null);
		console.log(new Date().toLocaleString()+"|  Insert the movie \""+data.movieName+"\" \r\n");
	});
});
}

//find all document
var findDocuments = function(db,callback){
	var collection = db.collection('movies');
	collection.find({}).toArray(function(err,docs){
		assert.equal(err, null);
		//console.log("found the following records\r\n");
		console.log(docs);
		callback(docs);
	})
}
//find a document
var  findOneDocument = function(db,filter,callback){
	var collection = db.collection('movies');
	collection.findOne(filter,function(err,doc){
		if(err){console.log(err)}
			else{
				//console.log("Found the record\r\n");
		callback(doc);
	}
})
}

// 删除空格
function deleteSpace(word){
	var word_array = word.split(" ");
	var final = word_array[0].concat(word_array[1]);
	return final;
}

//compiling our schema into a model
//var Centences=mongoose.model('Centences',englishSchema); 
//添加数据库条目
app.post('/addRecords',function(req,res){
	var data = {
		movieName: req.body.movieName,
		movieNameChinese: req.body.movieNameChinese,
		director: req.body.director,
		playwritter: req.body.playwritter,
		country: req.body.country,
		publisher: req.body.publisher,
		scoreDouban: req.body.scoreDouban,
		scoreIMDB: req.body.scoreIMDB,
		actorChinese: req.body.actorChinese,
		actorEn: req.body.actorEn,
		mainMaleRole: req.body.mainMaleRole,
		actressChinese: req.body.actressChinese,
		actressEn: req.body.actressEn,
		mainFemaleRole: req.body.mainFemaleRole,
		supportingActorChinese: req.body.supportingActorChinese,
		supportingActorEn: req.body.supportingActorEn,
		supportingMaleRole: req.body.supportingMaleRole,
		supportingActressChinese: req.body.supportingActressChinese,
		supportingActressEn: req.body.supportingActressEn,
		supportingFemaleRole: req.body.supportingFemaleRole,
		story: req.body.story
	}
	addOneMovie(data);
	// console.log(res);
	res.end('your data received');
})

app.get('/movieName/:movieName',function(req,res){
	var get_filter = {movieName:req.params.movieName};
	var a=req.params.movieName;
	getOneMovieInfo({movieName: a},function(doc){
		
		var address=getAddress();
		var port = server.address().port;
		var data = {
			CSS1: 'http://'+address+':'+port+'/css/bootstrap.min.css',
			CSS2: 'http://'+address+':'+port+'/css/style.css',
			logoPath:'http://'+address+':'+port+'/img/logo.png',
			moviePath: 'http://'+address+':'+port+'/video/'+doc.movieName+'.mp4',
			movieName: doc.movieName,
			movieNameChinese: doc.movieNameChinese,
			posterPath:'http://'+address+':'+port+'/img/'+doc.movieName+'/poster.jpg',
			director: doc.director,
			playwritter: doc.playwritter,
			country: doc.country,
			publisher: doc.publisher,
			scoreDouban: doc.scoreDouban,
			scoreIMDB: doc.scoreIMDB,
			actorChinese: doc.actorChinese,
			actorEn: doc.actorEn,
			actorPath:'http://'+address+':'+port+'/img/'+doc.movieName+'/actors/'+deleteSpace(doc.actorEn)+'.jpg',
			mainMaleRole: doc.mainMaleRole,
			actressChinese: doc.actressChinese,
			actressEn: doc.actressEn,
			actressPath:'http://'+address+':'+port+'/img/'+doc.movieName+'/actors/'+deleteSpace(doc.actressEn)+'.jpg',
			mainFemaleRole: doc.mainFemaleRole,
			supportingActorChinese: doc.supportingActorChinese,
			supportingActorEn: doc.supportingActorEn,
			supportingActorPath:'http://'+address+':'+port+'/img/'+doc.movieName+'/actors/'+deleteSpace(doc.supportingActorEn)+'.jpg',
			supportingMaleRole: doc.supportingMaleRole,
			supportingActressChinese: doc.supportingActressChinese,
			supportingActressEn: doc.supportingActressEn,
			supportingActressPath:'http://'+address+':'+port+'/img/'+doc.movieName+'/actors/'+deleteSpace(doc.supportingActressEn)+'.jpg',
			supportingFemaleRole: doc.supportingFemaleRole,
			mainMaleRolePath: 'http://'+address+':'+port+'/img/'+doc.movieName+'/roles/'+doc.mainMaleRole+'.jpg',
			mainFemaleRolePath: 'http://'+address+':'+port+'/img/'+doc.movieName+'/roles/'+doc.mainFemaleRole+'.jpg',
			supportingMaleRolePath: 'http://'+address+':'+port+'/img/'+doc.movieName+'/roles/'+doc.supportingMaleRole+'.jpg',
			supportingFemaleRolePath: 'http://'+address+':'+port+'/img/'+doc.movieName+'/roles/'+doc.supportingFemaleRole+'.jpg',
			story: doc.story
		};
	  //渲染模板
	  console.log(new Date().toLocaleString()+'| Client '+req.ip+'| request \"'+doc.movieName+'\" \r\n');
	 res.render('movie',data);

	 res.end();
		//res.end('director:'+doc.director);
	});
	
})

app.use(express.static('public'));
