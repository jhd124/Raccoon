"use strict"
var http = require('http')
var fs = require('fs')
var cheerio = require('cheerio')
var html = "";

var result_raw={};

result_raw.movieNameChinese=[];
result_raw.movieName=[];
result_raw.year = [];
result_raw.catagory = [];
result_raw.director = [];
result_raw.writer = [];
result_raw.country = [];
result_raw.publisher = [];
result_raw.actors = [];
result_raw.chatactors = [];
result_raw.story = [];


// /编剧：.+?</dd>/g
// /">[a-z\s.·]+/g
// //
// var regexp_movieNameChinese = new RegExp("v:itemreviewed\">[\u4e00-\u9fa5]+",'g');
// var regexp_catagory = /v:genre">[\u4e00-\u9fa5]+/g;
// var regexp_director = /v:directedBy">[\u4e00-\u9fa5·A-Za-z\s.·]+/;
// var regexp_writer0 = /编剧：.+?<\/dd>/g;
// var regexp_writer = /\">[\u4e00-\u9fa5·A-Za-z\s.·]+/g;
// var regexp_country0 = /国家地区：.+?<\/dd>/g;
// var regexp_country = /\">[\u4e00-\u9fa5·A-Za-z]+/g;
// var regexp_publisher0 = /发行公司：.+?<\/dd>/g;
// var regexp_publisher = /\">[\u4e00-\u9fa5·A-Za-z\s.·]+/g
//
var $ =  cheerio.load(html)
function dataExtractOne(selector,array){
	array.push($(selector).get(0).children[0].data);
}
function dataExtractMany(selector,array){
	for(let i = 0 ; i< $(selector).length ; i++){
		array.push($(selector).get(i).children[0].data)
	}
	return array;
}

http.get('http://service.library.mtime.com/Movie.api?Ajax_CallBack=true&Ajax_CallBackType=Mtime.Library.Services&Ajax_CallBackMethod=GetMovieOverviewRating&Ajax_CrossDomain=1&Ajax_RequestUrl=http%3A%2F%2Fmovie.mtime.com%2F232596%2F&t=20174249571457814&Ajax_CallBackArgument0=232556',function(res){
	res.on('data',function(data){
		html+=data;
	});
	res.on('end',function(){
		// console.log(html)
		// var rate_regexp = /{.*}/;
		// var rating_string = html.match(rate_regexp)[0];
		// var rating = JSON.parse(rating_string).value.movieRating.RatingFinal;
		// console.log(rating.value.movieRating.RatingFinal)

		 html = html.replace(/[\t\r\n]/g,"");
		 html = html.replace(/>\s+</g,"><")
		// fs.writeFile('mtime.html',html);
		// 	result_raw.movieNameChinese = html.match(regexp_movieNameChinese);

		// result_raw.catagory = html.match(regexp_catagory);
		 $ =  cheerio.load(html)
		// var writer_temp = html.match(regexp_writer0);
		// var country_temp = html.match(regexp_country0);
		// var publisher_temp = html.match(regexp_publisher0);
		// result_raw.writer = writer_temp[0].match(regexp_writer);
		// result_raw.country = country_temp[0].match(regexp_country)
		// result_raw.publisher = publisher_temp[0].match(regexp_publisher)[0]
		// var movieNameChinese = result_raw.movieNameChinese[0].split('>')[1];
		// var info_arr_dd = $('.info_l').children();
		// info_arr_dd.each(function(e){
		// 	console.log(e)
		// })


		// dataExtractOne('[property="v:itemreviewed"]',result_raw.movieNameChinese);
		// dataExtractOne('.db_enname',result_raw.movieName);
		// dataExtractOne('[property="v:initialReleaseDate"]',result_raw.year);

		// dataExtractMany('[property="v:genre"]',result_raw.catagory);
		// dataExtractMany('[rel="v:directedBy"]',result_raw.director);
		// dataExtractMany('[rel="v:directedBy"]',result_raw.writer);
		// dataExtractMany('[rel="v:directedBy"]',result_raw.country);
		// dataExtractMany('[rel="v:directedBy"]',result_raw.publisher);
		// dataExtractMany('[rel="v:directedBy"]',result_raw.actors);
		// dataExtractMany('[rel="v:directedBy"]',result_raw.chatactors);
		// dataExtractMany('[rel="v:directedBy"]',result_raw.story);
		// for(let i = 1; i<$('[rel="v:directedBy"]').get(0).parent.next.children.length;i++ ){
		// 	result_raw.writer.push($('[rel="v:directedBy"]').get(0).parent.next.children[i].children[0].data)
		// }
		// for(let i = 1; i<$('[rel="v:directedBy"]').get(0).parent.next.next.children.length;i++ ){
		// 	result_raw.country.push($('[rel="v:directedBy"]').get(0).parent.next.next.children[i].children[0].data)
		// }
		// result_raw.publisher.push($('[rel="v:directedBy"]').get(0).parent.next.next.next.children[1].children[0].data);

		// for(let i = 0 ; i<$('[rel="v:directedBy"]').length;i++){
		// 		result_raw.director.push(dataExtractMany('[rel="v:directedBy"]',i));
		// }
		//console.log($('[rel="v:directedBy"]'))//.get(0).children[0].data)

		// var actors_url = $('[pan="M14_Movie_Overview_Actor_More"]').get(0).children[0].attribs.href;
		// var html_actors = "";
		// var story_url = $('[pan="M14_Movie_Overview_PlotsSummary"]').find('a').get(0).attribs.href;
		// var html_story = "";

		// http.get(actors_url,function(res){
		// 	res.on(data,function(data){
		// 		html_actors += data;
		// 	})
		// 	res.on(end,function(){
		// 		 $ =  cheerio.load(html_actors)
		// 	})
		// })
		// http.get(story_url,function(res){
		// 	res.on(data,function(data){
		// 		html_story += data;
		// 	})
		// 	res.on(end,function(){
		// 		 $ =  cheerio.load(html_story)
		// 	})
		// })
var actor = function(){
	this.actorName_cn = "";
	this.actorName_en = "";
	this.imageUrl = "";
}
var character = function(){
	this.charaName_cn = "";
	this.charaName_en = "";
	this.imageUrl = "";
}
function getActorInfo($){
		var actor_regexp_cn = /[\u4e00-\u9fa5.·A-Z&#183;]+/;
		var actor_regexp_en = /\s[a-zA-Z\s]+/;
		var actors = [];
		for (var i = 0; i < 4; i++) {
			var actorName_cn = "";
			var actorName_en = "";
			var imageUrl ="";
			var actorInfo_parent = $('.actor_tit','.db_actor').slice(1,5).get(i).children
			var actorInfo = $('.actor_tit','.db_actor').slice(1,5).get(i).children[0].children
			if(actorInfo_parent.length===1){
			if (actorInfo.length===3) {
				var actorName = actorInfo[0].children[0].attribs.alt;
				imageUrl = actorInfo[0].children[0].attribs.src;
				actorName_cn = actorName.match(actor_regexp_cn)[0]
				actorName_en = actorName.match(actor_regexp_en)[0]
				actorName_en = actorName_en.replace(/\s/,"")
			}else{
				var actor_regexp_en = /[a-zA-Z\s]+/;
				var chinese = /[\u4e00-\u9fa5]/
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
	thisActor.actorName_cn = actorName_cn
	thisActor.actorName_en = actorName_en
	thisActor.imageUrl = imageUrl
	actors.push(thisActor)
	}
	return actors
	}

	function getCharaInfo($){
		var characters = [];
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
			characters.push(thisChara);
		}
		return characters;
	}
	// function getRating(url){
	// 	http.get(url,function(res){
	// 		var html = "";
	// 		res.on('data',function(data){
	// 				html += data;
	// 		})
	// 		res.on('end',function(){
	// 			var rate_regexp = /{.*}/;
	// 			var rating_string = html.match(rate_regexp)[0];
	// 			var rating = JSON.parse(rating_string).value.movieRating.RatingFinal;
	// 		})
	// 	})
	// 	var regexp = /[\d]+/;
	// 	var number = url.match(regexp);
	// 	var urlCode = encodeURIComponent(url);
	// 	var t = spider.getToken();
	// 	var ratingUrl = 'http://service.library.mtime.com/Movie.api?Ajax_CallBack=true&Ajax_CallBackType=Mtime.Library.Services&Ajax_CallBackMethod=GetMovieOverviewRating&Ajax_CrossDomain=1&Ajax_RequestUrl='+urlCode+'&t='+t+'&Ajax_CallBackArgument0='+number
	// 	return ratingUrl;
	// }
	//encodeURIComponent(url)
		//console.log(getCharaInfo($))
		//$('dd','.db_actor').slice(0,4).get(0) //得到dd
		//$('img','.db_actor').slice(0,4)  //得到
	})
})

var getToken=function() {
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
	}
var getRating = function(url){
		var regexp = /[\d]+/;
		var number = url.match(regexp);
		var urlCode = encodeURIComponent(url);
		var t = getToken();
		var ratingUrl = 'http://service.library.mtime.com/Movie.api?Ajax_CallBack=true&Ajax_CallBackType=Mtime.Library.Services&Ajax_CallBackMethod=GetMovieOverviewRating&Ajax_CrossDomain=1&Ajax_RequestUrl='+urlCode+'&t='+t+'&Ajax_CallBackArgument0='+number
			http.get(ratingUrl,function(res){
				console.log(res.statusCode)
			var html = "";
			res.on('data',function(data){
					html += data;
			})
			res.on('end',function(){
				var rate_regexp = /{.*}/;
				var rating_string = html.match(rate_regexp)[0];
				var rating = JSON.parse(rating_string).value.movieRating.RatingFinal;
				console.log(rating)
			})
		})
	}
	getRating("http://movie.mtime.com/11858/")