/*包装了对向数据库增加电影数据的方法*/
var dataDriver = require('./databaseManipulate.js');
var movieDataManipulate={
	/*
	addOneMovie 添加一部电影
	'url' mongodb url
	'collection'  Is the database collection that you want to insert records to
	'data'   the data that you want to add to database, make it a object data={xxx:xxx, ccc:ccc}
	*/
	addOneMovie : function (url,collection,data){
		MongoClient.connect(url, function(err,db){
			if(err){console.log(err)}
			else{
				dataDriver.insertOneDocument(db,collection,data,function(){
					console.log(new Date().toLocaleString()+" |  Inserted:  \""+data.movieName+"\" \r\n")
					db.close();
				})
			}
		});
	},
	// add several movies 添加多部电影
	//dataArray: make your movies informations an array
	addMovies : function (url,collection,dataArray){
		MongoClient.connect(url, function(err,db){
			if(err){console.log(err)}
			else{
				dataDriver.insertDocuments(db,collection,dataArray,function(){
					for(var i=0; i<dataArray.length();i++){
						console.log(new Date().toLocaleString()+" |  Inserted:  \""+dataArray[i].movieName+"\" \r\n")
					}
					db.close();
				})
			}
		});
	},
	//find one movie from the database
	//查询一部电影
	//filter: criteria of finding operation  
	//filter: 查询条件
	findOneMovie : function (url,collection,filter){
		MongoClient.connect(url, function(err,db){
			if(err){console.log(err)}
			else{
				dataDriver.findOneDocument(db,collection,filter,function(){
					console.log(new Date().toLocaleString()+'| Client '+req.ip+'| request \"'+doc.movieName+'\" \r\n')
					db.close();
				})
			}
		});
	},
	//find serveral movies
	//查询一些电影
	//filter: criteria of finding operation  
	//filter: 查询条件
	findMovies : function (url,collection,filter){
		MongoClient.connect(url, function(err,db){
			if(err){console.log(err)}
			else{
				dataDriver.findDocuments(db,collection,filter,function(){
					db.close();
				})
			}
		});
	},
	//delete one movie
	//删除一部电影（最好在入口的地方规定只能通过主键删除）
	//filter: criteria of finding operation  
	//filter: 查询条件
	deleteOneMovie : function (url,collection,filter){
		MongoClient.connect(url, function(err,db){
			if(err){console.log(err)}
			else{
				dataDriver.removeOneDocument(db,collection,filter,function(){
					db.close();
				})
			}
		});
	},
	//delete one movie
	//删除一些电影
	//filter: criteria of finding operation  
	//filter: 查询条件
	deleteMovies : function (url,collection,filter){
		MongoClient.connect(url, function(err,db){
			if(err){console.log(err)}
			else{
				dataDriver.removeDocuments(db,collection,filter,function(){
					db.close();
				})
			}
		});
	},
	//update movie information
	//修改电影数据
	updateOneMovie : function (url,collection,filter,update){
		MongoClient.connect(url, function(err,db){
			if(err){console.log(err)}
			else{
				dataDriver.insertOneDocument(db,collection,filter,update,function(){
					db.close();
				})
			}
		});
	},

};
module.exports=b;