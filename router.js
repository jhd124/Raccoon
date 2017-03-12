var express= require('express');
var app=express();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

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
	var host=server.address().address;
	var port=server.address().port;
	console.log("listening at %s,%s",host,port);
	console.log(getAddress());
	// getOneMovieInfo({movieName:'yourName'},function(doc){
	// 	console.log('getarecord'+doc.director);
	// });
});

//app.get()
// connect to mongodb
var url = 'mongodb://localhost:27017/raccoon';
var getAllMovieInfo = function(callback){
	MongoClient.connect(url, function(err,db){
	assert.equal(null, err);
	console.log("Connected successfully to mongodb server");

	findDocuments(db,function(doc){//注意！ 回调的绝佳示例，先运行这个“findDocuments” 有了doc 再把doc这个参数放进里面的回调函数
		callback(doc[0]);
		db.close();
	});
});
}

var getOneMovieInfo = function(filter,callback){
	MongoClient.connect(url, function(err,db){
	assert.equal(null, err);
	console.log("Connected successfully to mongodb server");

	findOneDocument(db,filter,function(doc){
		console.log("got it "+doc);
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
			console.log("Inserted 2 documents into the collection");
			callback(result);
		});
}
//find all document
var findDocuments = function(db,callback){
	var collection = db.collection('movies');
	collection.find({}).toArray(function(err,docs){
		assert.equal(err, null);
		console.log("found the following records");
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
		console.log("Found the record");
		console.log(filter);
		// console.log(value);
		console.log(doc);
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
app.get('/sss',function(req,res){
	console.log('ssssss');
	res.end('ssssssssssssssssssss');
})

app.get('/movieName/:movieName',function(req,res){
	var get_filter = {movieName:req.params.movieName};
	var a=req.params.movieName;
	getOneMovieInfo({movieName: a},function(doc){
		var template = require('art-template');
		var address=getAddress();
		var port = server.address().port;
		console.log('记录内容：'+doc);
		
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
		// data={}
     //数据
    console.log('---------------------')
	
	console.log('---------------------')
	
     //渲染模板

      var html = template('./public/index', data);

	 res.writeHead(200, {"Content-Type": "text/html"});
	 res.write(html);
	res.end();
		//res.end('director:'+doc.director);
	});
	
})
// app.get('/id/:id',function(req,res){
// 	Centences.findOne({'id':req.params.id},function(error,centences){
// 		if(error){
// 			return res.send(error);
// 		}
// 		if(!centences){
// 			return res.send('not found')
// 		}
// 		res.json({centences:centences});
// 		console.log(centences.chinese);
// 	})
// });
app.use(express.static('public'));
