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
    findOneMovie: function (filter, callback) {
		dataDriver.forageOne(this.url,this.collection,filter,function(doc){
			callback(doc);
		});
	},
    findMovies: function (option, callback) {
        var option_after = {
            url: this.url,
            collection: this.collection,
            filter: option.filter,
            sorter: option.sorter,
            skipNum: option.skipNum,
            limitNum: option.limitNum,
            fields: option.fields
        }
        // console.log(option.limitNum)
        dataDriver.forage(option_after, function (doc, num) {
			callback(doc,num);
		});
	},
	deleteOneMovie : function(filter){
		dataDriver.abandonOne(this.url,this.collection,filter);
	},
	deleteMovies : function(filter,callback){
		dataDriver.abandon(this.url,this.collection,filter,function(result){
			callback(result);
		});
	},
	updateOneMovie : function(data){//update:
		dataDriver.exchange(this.url,this.collection,data);
    },
    //主键生成策略
	primeKey : function(movieName){
		return Date.now().toString()+"|"+movieName;
	}
};
module.exports=movieDataManipulate;