/*包装了对mongodb数据库增删查改的方法
	storeOne : function (url,collection,data)

	store : function (url,collection,dataArray)

	forageOne : function (url,collection,filter)

	forage : function (url,collection,filter)

	abandonOne : function (url,collection,filter)

	abandon : function (url,collection,filter)

	exchange : function (url,collection,filter,update)
*/
var MongoClient = require('mongodb').MongoClient;

var databaseManipulate = {

//------------------------------
/*
find all documents 查询所有文档
'db'          Comes from MongoClient
'collection'  Is the database collection that you want to find records in
'filter'      criteria of find operation
'callback'    The result of query
'db'          这个参数来自 MongoClient
'collection'  希望查找的collection
'filter'     查询条件
'callback'    查询结果
*/
	 findDocuments : function(db,collection,fliter,callback){
		var collection = db.collection(collection);
		collection.find(fliter).toArray(function(err,docs){
			if(err){console.log(err)}
			else{
				callback(docs);
			}
		})
	},
//-------------------------------
/*
find one document 查询单个文档
'db'          Comes from MongoClient
'collection'  Is the database collection that you want to find records in
'filter'     criteria  of finding operation
'callback'    The result of query
'db'          这个参数来自 MongoClient
'collection'  希望查找的collection
'filter'     查询条件
'callback'    查询结果
*/
	 findOneDocument : function(db,collection,filter,callback){
		var collection = db.collection(collection);
		collection.findOne(filter,function(err,doc){
			if(err){console.log(err)}
			else{
				callback(doc);
			}
		})
	},
//-------------------------------
/*
insert documents 插入多个文档
'db'          Comes from MongoClient
'collection'  Is the database collection that you want to insert records to
'dataArray'   the Array of data that you want to add to database
'callback'    The result of insertion
'db'          这个参数来自 MongoClient
'collection'  希望查找的collection
'dataArray'   将要插入的数据的数组
'callback'    添加结果
*/
	 insertDocuments : function(db,collection,dataArray,callback){
		var collection = db.collection(collection);
		collection.insertMany(dataArray,function(err,result){
			if (err) {console.log(err)}
			else{
				callback(result);
			}
		});
	},
//-------------------------------
/* 
insert one document 插入一个文档
'db'          Comes from MongoClient
'collection'  Is the database collection that you want to insert records to
'data'   the data that you want to add to database
'callback'    The result of insertion
'db'          这个参数来自 MongoClient
'collection'  希望查找的collection
'dataArray'   将要插入的数据
'callback'    添加结果
*/
	 insertOneDocument : function(db,collection,data,callback){
		var collection = db.collection(collection);
		collection.insertOne(data,function(err,result){
			if (err) {console.log(err)}
			else{
				callback(result);
			}
		});
	},
//-------------------------------
/*
delete some documents 删除多个文档 
'db'          Comes from MongoClient
'collection'  Is the database collection that you want to insert records to
'filter'   	  the criteria for delete
'callback'    The result of deleting
'db'          这个参数来自 MongoClient
'collection'  希望查找的collection
'filter'      想要删除的文档的查询条件
'callback'    删除结果
*/
	 removeDocuments : function(db,collection,filter,callback){
		var collection = db.collection(collection);
		collection.deleteMany(filter,function(err,result){
			if (err) {console.log(err)}
			else{
				callback(result);
			}
		});
	},
//-------------------------------
/*
delete one document 删除多个文档 
'db'          Comes from MongoClient
'collection'  Is the database collection that you want to insert records to
'filter'   	  the criteria for delete
'callback'    The result of deleting
'db'          这个参数来自 MongoClient
'collection'  希望查找的collection
'filter'      想要删除的文档的查询条件
'callback'    删除结果
*/
	 removeOneDocument : function(db,collection,filter,callback){
		var collection = db.collection(collection);
		collection.deleteOne(filter,function(err,result){
			if (err) {console.log(err)}
			else{
				callback(result);
			}
		});
	},
//-------------------------------
/*
update a document 修改数据
'db'          Comes from MongoClient
'collection'  Is the database collection that you want to update records in
'filter'   	  the criteria for update
'update'      the data to be updated
'callback'    The result of updating
*/
 	 updateOneDocument : function(db,collection,filter,update,callback){
 		var collection = db.collection(collection);
 		collection.updateOne(filter,update,function(err,result){
 			if (err) {console.log(err)}
 			else{
 				callback(result);
 			}
 		});
 	},

 //________________________________________________________________________________________________________________
 	/*
	addOneMovie 添加一
	'url' mongodb url
	'collection'  Is the database collection that you want to insert records to
	'data'   the data that you want to add to database, make it a object data={xxx:xxx, ccc:ccc}
	*/
	storeOne : function (url,collection,data,callback){
		MongoClient.connect(url, function(err,db){
			if(err){console.log(err)}
			else{
				databaseManipulate.insertOneDocument(db,collection,data,function(result){
					// console.log(new Date().toLocaleString()+" |  Inserted:  \""+data.movieName+"\" \r\n")
					db.close(result);
				})
			}
		});
	},
	// add several movies 添加多
	//dataArray: make your movies informations an array
	store : function (url,collection,dataArray,callback){
		MongoClient.connect(url, function(err,db){
			if(err){console.log(err)}
			else{
				databaseManipulate.insertDocuments(db,collection,dataArray,function(result){
					// for(var i=0; i<dataArray.length();i++){
						// console.log(new Date().toLocaleString()+" |  Inserted:  \""+dataArray[i].movieName+"\" \r\n")
					// }
					callback(result);
					db.close();
				})
			}
		});
	},
	//find one movie from the database
	//查询一
	//filter: criteria of finding operation  
	//filter: 查询条件
	forageOne : function (url,collection,filter,callback){
		MongoClient.connect(url, function(err,db){
			if(err){console.log(err)}
			else{
				databaseManipulate.findOneDocument(db,collection,filter,function(doc){
					// console.log(new Date().toLocaleString()+'| Client '+req.ip+'| request \"'+doc.movieName+'\" \r\n')
					callback(doc);
					db.close();
				})
			}
		});
	},
	//find serveral movies
	//查询一些
	//filter: criteria of finding operation  
	//filter: 查询条件
	forage : function (url,collection,filter,callback){
		MongoClient.connect(url, function(err,db){
			if(err){console.log(err)}
			else{
				databaseManipulate.findDocuments(db,collection,filter,function(doc){
					callback(doc);
					db.close();
				})
			}
		});
	},
	//delete one movie
	//删除一部电影（最好在入口的地方规定只能通过主键删除）
	//filter: criteria of finding operation  
	//filter: 查询条件
	abandonOne : function (url,collection,filter,callback){
		MongoClient.connect(url, function(err,db){
			if(err){console.log(err)}
			else{
				databaseManipulate.removeOneDocument(db,collection,filter,function(result){
					callback(result)
					db.close();
				})
			}
		});
	},
	//delete one movie
	//删除一些电影
	//filter: criteria of finding operation  
	//filter: 查询条件
	abandon : function (url,collection,filter,callback){
		MongoClient.connect(url, function(err,db){
			if(err){console.log(err)}
			else{
				databaseManipulate.removeDocuments(db,collection,filter,function(result){
					callback(result)
					db.close();
				})
			}
		});
	},
	//update movie information
	//修改电影数据
	exchange : function (url,collection,filter,update,callback){
		MongoClient.connect(url, function(err,db){
			if(err){console.log(err)}
			else{
				databaseManipulate.insertOneDocument(db,collection,filter,update,function(result){
					callback(result)
					db.close();
				})
			}
		});
	}
}
module.exports = databaseManipulate;