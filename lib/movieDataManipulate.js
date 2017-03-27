/*包装了对向数据库增加电影数据的方法*/
var dataDriver = require('./databaseManipulate.js');

var movieDataManipulate={
	url : 'mongodb://localhost:27017/raccoon',
	collection : 'movies',
	addOneMovie : function(data,callback){
		dataDriver.storeOne(this.url,this.collection,data,function(result){
			callback(result);
		});
	},
	addMovies : function(dataArray,callback){
		dataDriver.store(this.url,this.collection,dataArray,function(result){
			callback(result);
		});
	},
	findOneMovie : function(filter,callback){
		dataDriver.forageOne(this.url,this.collection,filter,function(doc){
			callback(doc);
		});
	},
	findMovies : function(filter,callback){
		dataDriver.forage(this.url,this.collection,filter,function(doc){
			callback(doc);
		});
	},
	deleteOneMovie : function(filter,callback){
		dataDriver.abandonOne(this.url,this.collection,filter,function(result){
			callback(result);
		});
	},
	deleteMovies : function(filter,callback){
		dataDriver.abandon(this.url,this.collection,filter,function(result){
			callback(result);
		});
	},
	updateOneMovie : function(data){//update:
		dataDriver.exchange(this.url,this.collection,data);
	},
	primeKey : function(movieName){
		return Date.now().toString()+movieName;
	}
};
module.exports=movieDataManipulate;