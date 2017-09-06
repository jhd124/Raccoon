var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/raccoon';
var user = function(){
	this.history = "";
	this._id = "";
	this.password = "";
};
user.prototype.setHistory = function(history){
	this.history = history;
};
user.prototype.setUserName = function(userName){
	this._id = userName;
};
user.prototype.getUserName = function(){
	return this._id;
};
user.prototype.setPassword =function(password){
	this.password = password;
};
user.prototype.getPassword =function(){
	return this.password;
};
user.prototype.getHistory = function(){
	return this.history;
};
user.prototype.save =function(callback){
	var user = this;
	MongoClient.connect(url,function(err,db){
		if(err){
			callback(err);
		}else{
			var collection = db.collection('user');
			collection.deleteOne({"_id":user.history},function(err){
				if(err){callback(err)};
			});
			collection.save(user,function(err){
				if(err){callback(err)};
			});
		}
		db.close();
		callback();
	})
};
user.prototype.init =function(){
	var user = this;
	MongoClient.connect(url,function(err,db){
		if(err){
			console.error(err)
		}else{
			var collection = db.collection('user');
			collection.findOne({},function(err,doc){
				if(err){console.error(err)}
					else{
						if(!doc){
							user.setUserName('admin');
							user.setPassword('admin');
							collection.insert(user);
						}else{
							user.setUserName(doc._id);
							user.setPassword(doc.password)
						}
					}
					db.close();
			})
		}
	})
}
module.exports = user;