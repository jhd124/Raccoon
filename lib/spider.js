"use strict"
var http = require('http')
var fs = require('fs')
var cheerio = require('cheerio')
var actor = function(){
	this.actorName_cn = "";
	this.actorName_en = "";
	this.imageUrl = "";
	this.classify = "";
};
actor.prototype.saveImg = function(movieName,data){
	var path = './public/movie/'+movieName+'/'+this.classify+'/'+this.actorName_en+'.jpg';
	fs.writeFile(path,data,'binary',function(err){
		if(err){
			console.log('save fail');
			console.log(err)
		}else{
			console.log('A image has been saved into path');
		}
	})
}
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
		playwritter : [],
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
		getHTML: 发送get请求到指定URL获取HTML页面
		@param url : Mtime电影首页的URL
		@param callback : cheerio对象,用于提取网页中的信息
	*/
	getHTML : function(url,callback){
		try{
		http.get(url,function(res){
			res.setEncoding('utf8');
			var html = "";
			if(res.statusCode!==200){
				console.error(res.statusCode)
				res.resume()
			}
			res.on('error',function(error){
  				console.log(error.message)
  			})
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
	}
	catch(e){
		console.log(e)
	}
	},
	/*
		getToken : 用于生成请求Mtime评分信息的URL
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
		getRating : 获取一部电影在Mtime上的评分
		@param url: Mtime电影首页的URL
		@return : 一个promise，resolve参数为电影的评分，reject参数为http状态码
	*/
	getRating : function(url){
		this.movieInfo.rating=[];
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
		@behavior: 将4个actor对象push进spider.movieInfo.data.actors
	*/
	pushActorInfo : function($){
		this.movieInfo.actors = [];
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
	thisActor.classify = "actors";
	spider.movieInfo.actors.push(thisActor)
}
},
	/*
		用于在Mtime演职员页面提取电影角色信息
		@param $ : cheerio对象
		@behavior: 将4个character对象push进spider.movieInfo.data.charactors
	*/
	pushCharaInfo : function($){
		this.movieInfo.chatactors = [];
		for (var i = 0; i < 4 ; i++) {
			var charaName_cn = "";
			var charaName_en = "";
			var imageUrl = "";
			if($('.character_inner','.db_actor').slice(1,5).get(i).children.length===1){
				if($('.character_inner','.db_actor').slice(1,5).get(i).children[0].children.length===3){
					charaName_cn = $('.character_inner','.db_actor').slice(1,5).get(i).children[0].children[1].children[0].data
					charaName_en = $('.character_inner','.db_actor').slice(1,5).get(i).children[0].children[2].children[0].data
					imageUrl = $('.character_inner','.db_actor').slice(1,5).get(i).children[0].children[0].attribs.src
					if(!(charaName_en!==undefined||charaName_cn!==undefined)){
						imageUrl = $('.character_inner','.db_actor').slice(1,5).get(i).children[0].children[0].children[0].attribs.src;
						charaName_cn = $('.character_inner','.db_actor').slice(1,5).get(i).children[0].children[0].children[0].attribs.alt;
						charaName_en = $('.character_inner','.db_actor').slice(1,5).get(i).children[0].children[2].children[0].children[0].data;
					}
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
				charaName_en = $('.character_inner','.db_actor').slice(1,5).get(i).children[1].children[0].data;
			}
			var thisChara = new actor();
			thisChara.actorName_cn = charaName_cn;
			thisChara.actorName_en = charaName_en;
			thisChara.imageUrl = imageUrl;
			thisChara.classify = "roles"
			spider.movieInfo.chatactors.push(thisChara);
		}
	},
	/*
		用于在Mtime剧情简介页面抓取剧情信息
		@param $ : cheerio对象
		@behavior: 将1个字符串放进spider.movieInfo.data.story
	*/
	pushStory : function($){
		this.movieInfo.story=[];
		var story = $('.first_letter').get(0).parent
		var letter = $('text',story)
		var first_letter = $('.first_letter').get(0).children[0].data
		var storytext=""
		for(let i=0;i<story.children.length;i++){
			if(story.children[i].type==='text'){
				storytext+=story.children[i].data
			}
		}
		spider.movieInfo.story.push(first_letter+storytext)
	},
	/*
		发送请求，请求演员和角色页面并进行信息抓取
	 */
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
		发送请求，请求剧情页面并进行信息抓取
	 */
	getStory :function(url){
		return new Promise(function(resolve,reject){
			spider.getHTML(url,function($){
				spider.pushStory($);
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
		this.movieInfo.movieNameChinese=[];
		this.movieInfo.movieName = [];
		this.movieInfo.year = [];
		this.movieInfo.catagory = [];
		this.movieInfo.director = [];
		this.movieInfo.playwritter = [];
		this.movieInfo.country = [];
		this.movieInfo.publisher = [];
		var p = new Promise(function(resolve){
			spider.setSpiderUrl(url)
		spider.getHTML(url,function($1){

			spider.dataExtractOne($1,'[property="v:itemreviewed"]',spider.movieInfo.movieNameChinese);
			spider.dataExtractOne($1,'.db_enname',spider.movieInfo.movieName);
			spider.dataExtractOne($1,'[property="v:initialReleaseDate"]',spider.movieInfo.year);

			spider.dataExtractMany($1,'[property="v:genre"]',spider.movieInfo.catagory);
			spider.dataExtractMany($1,'[rel="v:directedBy"]',spider.movieInfo.director);

			for(let i = 1; i<$1('[rel="v:directedBy"]').get(0).parent.next.children.length;i++ ){
				spider.movieInfo.playwritter.push($1('[rel="v:directedBy"]').get(0).parent.next.children[i].children[0].data)
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
},
/**
 * 获取电影全部信息的的方法
 * @param url: Mtime电影主页面
 * @callback : 带一个参数，包含得到的电影信息
 */
getMtimeData : function(url,callback){
	// return new Promise(function(resolve){
	spider.getMainPageData(url).then(function(){
			return spider.getActorInfo(spider.actors_url);
		}).then(function(){
			return spider.getRating(spider.url);
		}).then(function(){
			return spider.getStory(spider.story_url);
		}).then(function(){
			// console.log(spider.movieInfo)
			var movieSchema={};
			for(let key in spider.movieInfo){
				if(key!='actors'&&key!='chatactors'){
					if(key==='country'){
						movieSchema[key]=spider.movieInfo[key].join("");
					}else{
						movieSchema[key]=spider.movieInfo[key].toString();
					}
					//console.log(movieSchema[key])
				}else if(key=='actors'){
					//console.log(2)
					var actornum =1;
					// spider.movieInfo.actors.forEach(function(e){
					for (var i = 0; i < spider.movieInfo.actors.length; i++) {
						//console.log(i)
						//console.log(e.actorName_en)
						 movieSchema['actor'+actornum+'Chinese']=spider.movieInfo.actors[i].actorName_cn;
						movieSchema['actor'+actornum+'En']=spider.movieInfo.actors[i].actorName_en;
						// console.log(e.actorName_en)
						actornum++;
						//console.log(movieSchema)
					}
				}else{
					//console.log(3)
					var charanum =1;
					//console.log(spider.movieInfo.chatactors[1].actorName_cn)
					for (var i = 0; i < spider.movieInfo.chatactors.length; i++) {
						if(spider.movieInfo.chatactors[i].actorName_cn){
							movieSchema['role'+(i+1)] = spider.movieInfo.chatactors[i].actorName_cn
						}else{
							movieSchema['role'+(i+1)] = spider.movieInfo.chatactors[i].actorName_en
						}
					}
				}
			}
			
			callback(movieSchema,spider.movieInfo)
		})
	},
savePic : function(movieName,actor){
	var url = actor.imageUrl;
	http.get(url,function(res){
    var pic="";
    res.setEncoding('binary')//这个很重要，对图片来说
    res.on('data',function(chunk){
        pic+=chunk;
    })
    res.on('end',function(){
    	actor.saveImg(movieName,pic)
    })
})
}
}
// spider.getMtimeData('http://movie.mtime.com/10964/',function(data){
// 	console.log(data)
// })
module.exports = spider