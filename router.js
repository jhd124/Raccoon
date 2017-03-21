var express= require('express');
var app=express();
var assert = require('assert');
var template = require('art-template');
var bodyparser = require('body-parser');
var movieData = require('./lib/movieDataManipulate');

/*设置bodyparser中间件，用以解析post请求*/
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




// 删除空格
function deleteSpace(word){
	var word_array = word.split(" ");
	var final = word_array[0].concat(word_array[1]);
	return final;
}



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

	movieData.addOneMovie(data);

	res.end('your data received');
})

app.get('/movieName/:movieName',function(req,res){
	var get_filter = {movieName:req.params.movieName};
	var a = req.params.movieName;
	movieData.findOneMovie({movieName: a},function(doc){
		
		var address = getAddress();
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
	});
})

app.use(express.static('public'));
