var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/raccoon';
var user = function(){
	this._id = "";
	this.password = "";
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
user.prototype.save =function(){
	var user = this;
	MongoClient.connect(url,function(err,db){
		if(err){
			console.error(err)
		}else{
			var collection = db.collection('user');
			collection.save(user,function(err){
				if(err){console.error(err)}
			})
		}
		db.close();
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