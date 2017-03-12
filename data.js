var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var url = 'mongodb://localhost:27017/raccoon';

MongoClient.connect(url, function(err,db){
	assert.equal(null, err);
	console.log("Connected successfully to mongodb server");

	insertDocuments(db,function(result){//注意！ 回调的绝佳示例，先运行这个“findDocuments” 有了doc 再把doc这个参数放进里面的回调函数
		db.close();
	});
})

	var insertDocuments = function(db,callback){
		var collection = db.collection('movies');

		collection.insertMany(
			[{
				movieName: 'yourName',
				movieNameChinese: '你的名字',
				director: '新海诚',
				playwritter: '新海诚',
				country: '日本',
				publisher: '华夏',
				scoreDouban: 8.5,
				scoreIMDB: 8.7,
				actorChinese: '神木隆之介',
				actorEn: 'Kamiki Ryunosuke',
				mainMaleRole: '立花泷',
				actressChinese: '上白石萌音',
				actressEn: 'Mone Kamishiraishi',
				mainFemaleRole: '宫水三叶',
				supportingActorChinese: '长泽雅美',
				supportingActorEn: 'Masami Nagasawa',
				supportingMaleRole: '奥寺美纪',
				supportingActressChinese: '市原悦子',
				supportingActressEn: 'Etsuko Ichihara',
				supportingFemaleRole: '宫水一叶',
				story: '故事背景发生在适逢千年一遇彗星到访的日本，生活在日本小镇的女高中生三叶对于担任镇长的父亲所举行的选举运动，还有家传神社的古老习俗感到无聊乏味，对大城市充满憧憬的她，甚至幻想着“下辈子让我生做一个东京帅哥吧！”忽然有一天自己做了个变成男孩子的梦，在陌生的房间，面对陌生的朋友，以及东京的街道。虽然感到困惑，但少女对于能来到朝思暮想的东京还是充满喜悦。						与此同时，生活在东京的男高中生立花泷也做了个奇怪的梦，他在一个从未去过的深山小镇中，变成了女高中生。少男少女就这样在梦中邂逅了彼此，并带着“不论你在世界何方我一定会去见你”的信念去寻找彼此。没错，这就是一个互换身体的奇迹故事，那么少男少女这个奇妙的梦到底是什么原因？他们最终又会迎来什么样的结局呢？'
			}],function(err,result){
				assert.equal(err,null);
				assert.equal(1,result.result.n);
				assert.equal(1,result.ops.length);
				console.log("Inserted 1 documents into the collection");
				callback(result);
			});
	}
