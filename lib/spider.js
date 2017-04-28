"use strict"
var http = require('http')
var fs = require('fs')
var cheerio = require('cheerio')
var actor = function(){
	this.actorName_cn = "";
	this.actorName_en = "";
	this.imageUrl = "";
};
var character = function(){
	this.charaName_cn = "";
	this.charaName_en = "";
	this.imageUrl = "";
};
var spider = {
	url : "",
	actors_url : "",
	story_url : "",
	movieInfo : {
		movieNameChinese : [],
		movieName : [],
		year : [],
		rating : [],
		catagory : [],
		director : [],
		writer : [],
		country : [],
		publisher : [],
		actors : [],
		chatactors : [],
		story : []
	},
	setSpiderUrl : function(url){
		spider.url = url;
	},
	/*
		@param url : Mtime电影首页的URL
		@param callback : cheerio对象,用于提取网页中的信息
	*/
	getHTML : function(url,callback){
		http.get(url,function(res){
			res.setEncoding('utf8');
			var html = "";
			if(res.statusCode!==200){
				console.error(res.statusCode)
			}
			res.on('data',function(data){
				html+=data;
			});
			res.on('end',function(){
				html = html.replace(/[\t\r\n]/g,"");
				html = html.replace(/>\s+</g,"><")
				var $ =  cheerio.load(html)
				callback($);
			});
		})
	},
	/*
		用于生成请求Mtime评分信息的URL
	*/
	getToken: function() {
		var d = new Date(),
			c = [];
		c.push(d.getFullYear());
		c.push(d.getMonth() + 1);
		c.push(d.getDate());
		c.push(d.getHours());
		c.push(d.getMinutes());
		c.push(d.getSeconds());
		c.push(parseInt(Math.random() * 100000, 10));
		return c.join("")
	},
	/*
		@param url: Mtime电影首页的URL
		@return : 一个promise，resolve参数为电影的评分，reject参数为http状态码
	*/
	getRating : function(url){
		return new Promise(function(resolve,reject){
			var regexp = /[\d]+/;
			var number = url.match(regexp);
			var urlCode = encodeURIComponent(url);
			var t = spider.getToken();
			var ratingUrl = 'http://service.library.mtime.com/Movie.api?Ajax_CallBack=true&Ajax_CallBackType=Mtime.Library.Services&Ajax_CallBackMethod=GetMovieOverviewRating&Ajax_CrossDomain=1&Ajax_RequestUrl='+urlCode+'&t='+t+'&Ajax_CallBackArgument0='+number
			http.get(ratingUrl,function(res){
				res.setEncoding('utf8');
				var html = "";
				if(res.statusCode!==200){
					reject(res.statusCode);
				}
				res.on('data',function(data){
					html += data;
				})
				res.on('end',function(){
					var rate_regexp = /{.*}/;
					var rating_string = html.match(rate_regexp)[0];
					var rating = JSON.parse(rating_string).value.movieRating.RatingFinal;
					spider.movieInfo.rating.push(rating)
					resolve();
				})
			})
		})
		
	},
	/*
		提取信息的辅助方法
		@param $: cheerio对象
		@param selector: CSS选择器字符串
		@param array: 存储信息的数组
	*/
	dataExtractOne : function($,selector,array){
		array.push($(selector).get(0).children[0].data);
	},
	dataExtractMany : function($,selector,array){
		var length = $(selector).length
		for(let i = 0 ; i<length ; i++){
			array.push($(selector).get(i).children[0].data)
		}
	},
	/*
		用于在Mtime演职员页面提取演员信息
		@param $ : cheerio对象
		@return : 含有演员信息的promise, resolve参数为一个对象数组
		[{
			actorName_cn = "";
			actorName_en = "";
			imageUrl = "";
		}]
	*/
	pushActorInfo : function($){
		var actor_regexp_cn = /[\u4e00-\u9fa5.·A-Z&#183;]+/;
		var actor_regexp_en = /\s[a-zA-Z\s]+/;
		for (var i = 0; i < 4; i++) {
			var actorName_cn = "";
			var actorName_en = "";
			var imageUrl = "";
			var actorInfo_parent = $('.actor_tit','.db_actor').slice(1,5).get(i).children
			var actorInfo = $('.actor_tit','.db_actor').slice(1,5).get(i).children[0].children
			if(actorInfo_parent.length===1){
				if (actorInfo.length===3) {
					var actorName = actorInfo[0].children[0].attribs.alt;
					imageUrl = actorInfo[0].children[0].attribs.src;
					actorName_cn = actorName.match(actor_regexp_cn)[0];
					actorName_en = actorName.match(actor_regexp_en)[0];
					actorName_en = actorName_en.replace(/\s/,"");
				}else{
					var actor_regexp_en = /[a-zA-Z\s]+/;
					var chinese = /[\u4e00-\u9fa5]/;
			//console.log(actorInfo);
			var actorName = actorInfo[0].children[0].data
			actorName_cn = actorName.match(actor_regexp_cn)[0]
			actorName_en = actorName.match(actor_regexp_en)[0]
			if(!chinese.test(actorName_cn)){
				actorName_cn=null;
			}
		}
	}else if(actorInfo_parent.length===2){
		actorName_cn = actorInfo_parent[0].children[0].children[0].data;
		actorName_en = actorInfo_parent[1].children[0].children[0].data;
	}
	var thisActor = new actor();
	thisActor.actorName_cn = actorName_cn;
	thisActor.actorName_en = actorName_en;
	thisActor.imageUrl = imageUrl
	spider.movieInfo.actors.push(thisActor)
}
},
	/*
		用于在Mtime演职员页面提取电影角色信息
		@param $ : cheerio对象
		@return : 含有角色信息的promise, resolve参数为一个对象数组
		[{
			charaName_cn = "";
			charaName_en = "";
			imageUrl = "";
		}]
	*/
	pushCharaInfo : function($){
		for (var i = 0; i < 4 ; i++) {
			var charaName_cn = "";
			var charaName_en = "";
			var imageUrl = "";
			if($('.character_inner','.db_actor').slice(1,5).get(i).children.length===1){
				if($('.character_inner','.db_actor').slice(1,5).get(i).children[0].children.length===3){
					charaName_cn = $('.character_inner','.db_actor').slice(1,5).get(i).children[0].children[1].children[0].data
					charaName_en = $('.character_inner','.db_actor').slice(1,5).get(i).children[0].children[2].children[0].data
					imageUrl = $('.character_inner','.db_actor').slice(1,5).get(i).children[0].children[0].attribs.src
				}else{
					var charaName = $('.character_inner','.db_actor').slice(1,5).get(i).children[0].children[0].data;
					var chinese = /[\u4e00-\u9fa5]/
					if (chinese.test(charaName)) {
						charaName_cn = charaName;
					}else{
						charaName_en = charaName;
					}
				}
			}else if($('.character_inner','.db_actor').slice(1,5).get(i).children.length===2){
				charaName_cn = $('.character_inner','.db_actor').slice(1,5).get(i).children[0].children[0].data;
				charaName_cn = $('.character_inner','.db_actor').slice(1,5).get(i).children[1].children[0].data;
			}
			var thisChara = new character();
			thisChara.charaName_cn = charaName_cn;
			thisChara.charaName_en = charaName_en;
			thisChara.imageUrl = imageUrl;
			spider.movieInfo.chatactors.push(thisChara);
		}
	},

	getActorInfo : function(url){
		return new Promise(function(resolve,reject){
			spider.getHTML(url,function($){
				spider.pushActorInfo($);
				spider.pushCharaInfo($);
				resolve();
			})
		})
	},
	
/*
	用于获取Mtime电影主页上的基本信息，包括电影名称，发行日期，国家地区，
	导演，编剧，发行商，以及演职员页面和剧情页面的URL
	@param url : Mtime电影主页的URL
	@return : 一个promise， resolve的参数是基本信息以及演职员页面和剧情页面的URL
*/

	getMainPageData : function(url){
		var p = new Promise(function(resolve){
			spider.setSpiderUrl(url)
		spider.getHTML(url,function($1){

			spider.dataExtractOne($1,'[property="v:itemreviewed"]',spider.movieInfo.movieNameChinese);
			spider.dataExtractOne($1,'.db_enname',spider.movieInfo.movieName);
			spider.dataExtractOne($1,'[property="v:initialReleaseDate"]',spider.movieInfo.year);

			spider.dataExtractMany($1,'[property="v:genre"]',spider.movieInfo.catagory);
			spider.dataExtractMany($1,'[rel="v:directedBy"]',spider.movieInfo.director);

			for(let i = 1; i<$1('[rel="v:directedBy"]').get(0).parent.next.children.length;i++ ){
				spider.movieInfo.writer.push($1('[rel="v:directedBy"]').get(0).parent.next.children[i].children[0].data)
			}
			for(let i = 1; i<$1('[rel="v:directedBy"]').get(0).parent.next.next.children.length;i++ ){
				spider.movieInfo.country.push($1('[rel="v:directedBy"]').get(0).parent.next.next.children[i].children[0].data)
			}
			spider.movieInfo.publisher.push($1('[rel="v:directedBy"]').get(0).parent.next.next.next.children[1].children[0].data);

			spider.actors_url = $1('[pan="M14_Movie_Overview_Actor_More"]').get(0).children[0].attribs.href;

			spider.story_url = $1('[pan="M14_Movie_Overview_PlotsSummary"]').find('a').get(0).attribs.href;

			resolve();
		})
	
})
		return p;
}
}
// var promise_try = new Promise(function(resolve){
// 	spider.getMtimeData('http://movie.mtime.com/12543/',function(rating){
// 		resolve(rating)
// 	})
// })
// promise_try.then(function(rating){
// 	console.log(rating)
// })
spider.getMainPageData('http://movie.mtime.com/232556/').then(function(){
	return spider.getActorInfo(spider.actors_url)
}).then(function(){
	return spider.getRating(spider.url)
}).then(function(){
	console.log(spider.movieInfo)
})