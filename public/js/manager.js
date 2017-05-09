window.onload=function(){
	//-------初始化页面
	pagination.queryDocuments.setSorter({movieName:1});
	pagination.queryDocuments.setFilter({});
	pagination.setCurrentPage(1);
	pagination.setActive(0);
	//------点击表头使记录重新排序

	//表头按钮效果
	$('thead').children().children().mousedown(function(){
		this.setAttribute('style','background-color:#eee');
	});
	$('thead').children().children().mouseup(function(){
		this.removeAttribute('style');
	});

	//表头click
	var theadBtnArray =Array.prototype.slice.call(theadBtn.children[0].children);
	theadBtnArray.forEach(function(e){
		var key = e.getAttribute('data-thead');
		var sorter = JSON.parse('{"'+key+'":1}');
		var option = {sorter:sorter};
		e.onclick=function(){
			pagination.queryDocuments.queryAjax(option);
		}
	})
	//搜索
	search.onclick=function(){
		var key = search_key.value;
		var value = search_value.value;
		if(key!=='Mtime搜索'){
			setSearchFilter(key,value);
			pagination.setCurrentPage(1);
			pagination.setActive(0);
		}else{
			var url = "http://search.mtime.com/search/?q="+value;
			window.open(url);
		}
	}
	//智能添加
	smartSearch.onclick = function(){
		$('#modify').hide();
		$('#save').show();
		$('#myModal').modal('show');
		$('#save').attr('data-modiorcreate','create');
		var dataElement = $(".dataElement");
		dataElement.removeAttr('value');
		for(var j = 0; j<dataElement.length; j++){
			dataElement[j].disabled= false;
		}
		var url = MtimeUrl.value;
		spider(url,function(res){
			var data = JSON.parse(res);
			$('#myModal').modal('show');
			
			for(var key in data){
				$('#'+key).get(0).value=data[key]
			}
		})
	}
	//初始化分页按钮	
	
	previous.onclick = function(){
		if($('.active')[0].previousElementSibling.firstChild.innerHTML=='...'){
			pagination.flip(-1);
		}else{
			if($('.active')[0].previousElementSibling.firstChild.click)
				$('.active')[0].previousElementSibling.firstChild.click();
		}
	}
	next.onclick = function(){
		if($('.active')[0].nextElementSibling.firstChild.innerHTML=='...'){
			pagination.flip(1);
			// pagination.activeBtn(pagination.currentIndex)
		}else{
			// pagination.flip(0);
			if($('.active')[0].nextElementSibling.firstChild.click)
				$('.active')[0].nextElementSibling.firstChild.click();
		}
	}
	pagination.normalbtns.forEach(function(e){
		e.onclick=function(){
			if(this.firstChild.innerHTML=="..."&&this.firstChild.id=='first'){
				pagination.flip(-4)
			}else if(this.firstChild.innerHTML=="..."&&this.firstChild.id=='last'){
				pagination.flip(4)
			}else{
				var index = parseInt(this.getAttribute('data-index'));
				pagination.setActive(index);
			}
		}
	})
				// console.log(pagination.currentPage)

	//给按键绑定点击函数

	//分页结束---------------------

	//--------模态框------------
	//保存和修改的按钮的控制
	$('#save').hide();
	$('#modify').click(function(){
		$('#modify').hide();
		$('#save').show();
		var dataElement = $(".dataElement");
		for(var j = 0; j<dataElement.length; j++){
			dataElement[j].disabled = false;
		}
	});
	$('#save').click(function(){
		if($('#save')[0].dataset.modiorcreate==='modi'){
			$('#alert_modify').modal();
		}else{
			var data = collectFormData('create');
			addRecords(data);
		}
	});
	//在模态框关闭的时候让save隐藏，让modify显示--------
	$('#myModal').on('hidden.bs.modal', function (e) {
		$('#save').hide();
		$('#modify').show();
		$('#save')[0].dataset.modiorcreate='modi';
	});
	$('#alert_override').on('hidden.bs.modal',function(e){
		$('body').attr('class','modal-open');
	});
	$('#alert_modify').on('hidden.bs.modal',function(e){
		$('body').attr('class','modal-open');
	});
	$('#alert_delete').on('hidden.bs.modal',function(e){
		$('body').attr('class','modal-open');
	});
	//-----------------------------------------------------
	$('#sureToModify').click(function(){
		var data = collectFormData('update');
		updateRecord(data);
		$('#alert_modify').modal('hide');
	})
	$('#sureToSuccess').click(function(){
		location.reload();
	})
	$('#createRecord').click(function(){
		$('#modify').hide();
		$('#save').show();
		$('#myModal').modal('show');
		$('#save').attr('data-modiorcreate','create');
		var dataElement = $(".dataElement");
		dataElement.removeAttr('value');
		for(var j = 0; j<dataElement.length; j++){
			dataElement[j].disabled= false;
		}
	});
	$('#override').click(function(){
		if($('#save')[0].dataset.modiorcreate==='modi'){
			var data = collectFormData('update');
			addOverride(data);
		}else{
			var data = collectFormData('create');
			addOverride(data);
		}
		$('#alert_override').modal('hide');
	});
	$('#delete').click(function(){
		$('#alert_delete').modal();
	});
	$('#sureToDelete').click(function(){
		var data ={_id: $('#_id')[0].value};
		deleteRecord(data);
		$('#alert_delete').modal('hide');
	})
	//-------搜索------
}

//---------方法--------

function collectFormData(operation){
	var data = {};
	var dataElement = $(".dataElement");
	for(var i=0;i<dataElement.length;i++){
		var data_id = dataElement[i].id;
		data[data_id]=dataElement[i].value;
	}
	data.operation = operation;
	return data;
}

function addRecords(data){
	$.ajax({
		type: 'POST',
		url: '/submit',
		data: data,
		success: function(res){
			if(res==='exists'){
				$('#alert_override').modal()
			}else if(res==='error'){
				alert('出问题了')
			}else{
				$('#success').modal();
			}
		}
	})
}

function addOverride(data){
	$.ajax({
		type: 'POST',
		url: '/override',
		data: data,
		success: function(res){
			if(res==='error'){alert('出问题了')}
				else{
					$('#success').modal();
				}
			}
		})
}

function deleteRecord(data){
	$.ajax({
		url: '/deleteRecord',
		data: data,
		success: function(res){
			if(res==='deleted'){
				$('#success').modal();
			}else{
				alert('出问题了');
			}
		}
	})
}

function updateRecord(data){
	$.ajax({
		type: 'POST',
		url: '/submit',
		data: data,
		success: function(res){
			if(res==='exists'){
				$('#alert_override').modal()
			}else if(res==='error'){
				alert('出问题了')
			}else{
				$('#success').modal();
			}
		}
	})
}

function spider(MtimeUrl,callback){
	$.ajax({
		type: 'GET',
		url: "/retriveMovieData?MtimeUrl="+MtimeUrl,
		success: function(res){
		callback(res)
		}
	})
}
//填表
function tableGenerate(data){
	var html = "";
	for (var i = 0; i < data.length-1;i++){
		html += "<tr id="+i+"><td>"+
		data[i].movieNameChinese +
		"</td><td>" +
		data[i].movieName+
		"</td><td>"+
		data[i].catagory+
		"</td><td>"+
		data[i].country+							
		"</td><td>"+
		data[i].director+
		"</td><td>"+
		data[i].actorChinese+"|"+data[i].actressChinese+"|"+data[i].supportingActorChinese+"|"+data[i].supportingActressChinese+
		"</td></tr>"
	}
	$('#dataList')[0].innerHTML = html;

	$('#save')[0].dataset.modiorcreate='modi';

	var dataList_row=$('#dataList')[0];
	$('#dataList').children().click(function(){
		$('#myModal').modal('show');
		var index = this.id;
		var dataElement = $(".dataElement");
		for(var j = 0; j<dataElement.length-1; j++){
			var data_id = dataElement[j].id;
			dataElement[j].setAttribute('value',data[index][data_id]);
			dataElement[j].disabled = 'disabled';
		}
		story.innerHTML=data[index].story;
		dataElement[j].disabled = 'disabled';
	});
}
/*-------------------*/

var btns = Array.prototype.slice.call(laura.children);
var pagination = {
	first : first,
	last : last,
	btns : btns,
	normalbtns : this.btns.slice(1,this.btns.length-1),
	active : 0,//index of normalbtns
	pointer : 2,//first后面的第一个按钮上的页数
	//btnStatus: [],
	currentIndex: 0,
	currentPage: 1,
	recordsPerPage: 30,
	totalPage : 1,
	setCurrentIndex : function(index){
		this.currentIndex=index;
	},
	setTotalPage: function(n){
		this.totalPage=n;
	},
	setRecordsPerPage: function(recordsPerPage){
		this.recordsPerPage=recordsPerPage;
	},
	setCurrentPage : function(p){
		this.currentPage=p;
	},
	setData_num: function(lableIndex,n){
		this.normalbtns[lableIndex].firstChild.setAttribute('data-num',n);
		this.normalbtns[lableIndex].firstChild.innerHTML=n;
	},
	setActive: function(lableIndex){
		this.normalbtns[this.currentIndex].removeAttribute('class');
		this.normalbtns[lableIndex].setAttribute('class','active');
		this.setCurrentIndex(lableIndex);
		if(this.normalbtns[lableIndex].firstChild.getAttribute('data-num'))
			this.setCurrentPage(parseInt(this.normalbtns[lableIndex].firstChild.getAttribute('data-num')));
		this.queryDocuments.queryAjax({});
	},
	hideBtn: function(lableIndex){
		this.normalbtns[lableIndex].style.display='none';
	},
	showBtn: function(lableIndex){
		this.normalbtns[lableIndex].removeAttribute('style');
	},
	setPointer : function(p){
		this.pointer=p;
	},
	//
	displayBtns : function(){
		this.normalbtns.forEach(function(e){
			e.firstChild.removeAttribute('data-num')
		})
		for(let i=-1;i<this.normalbtns.length-1;i++){
			if(this.pointer+i>this.totalPage){
				this.hideBtn(i+1);
			}else{
				this.setData_num(i+1,this.pointer+i);
				this.showBtn(i+1);
			}
			if(this.pointer!=2){
				first.innerHTML="...";
			}
			if(this.pointer+this.normalbtns.length-2<this.totalPage){
				last.innerHTML="...";
			}
		}
	},
	flip : function(n){
		var newPointer
		if(this.pointer+n<2){
			newPointer=2;
		}else if(this.pointer+n>this.totalPage){
			newPointer=this.totalPage;
		}else{
			newPointer=this.pointer+n;
		}
		
		this.setPointer(newPointer);
		this.displayBtns();
		var btnShown = document.querySelectorAll("[data-num]");
		this.setActive(parseInt(btnShown.length/2));
		console.log(parseInt(btnShown.length/2))

	},


	queryDocuments : {
		filter:{},
		sorter:{},

		setFilter: function(filter){
			this.filter = filter;
		},

		setSorter: function(sorter){
			this.sorter = sorter;
		},
	//生成链接
	generateQueryUrl: function(){
		var filter = JSON.stringify(this.filter)||'{}';
		var sorter = JSON.stringify(this.sorter)||'{}';
		var currentPage = pagination.currentPage;
		var recordsPerPage = pagination.recordsPerPage;
		url = "/dataReview/findAllMovies?filter="+filter+"&sorter="+sorter+"&currentPage="+currentPage+"&recordsPerPage="+recordsPerPage;
		return url;
	},

	queryAjax: function(option){
		if(option.filter)
			{this.setFilter(option.filter)};
		if(option.sorter)
			{this.setSorter(option.sorter)};
		var url = this.generateQueryUrl();
		$.ajax({
			url : url,
			success : function(res){
				var data = JSON.parse(res);
				tableGenerate(data);
				var totalRecords = data[data.length-1];
				var totalPage = totalRecords%pagination.recordsPerPage==0?totalRecords/pagination.recordsPerPage:parseInt(totalRecords/pagination.recordsPerPage)+1;
				pagination.setTotalPage(totalPage);
				pagination.displayBtns();
			}
		})
	}
}
};

function setSearchFilter(key, value){
	var filter;
	switch(key){
		case '电影中文名':
		filter=JSON.parse("{\"movieNameChinese\":\""+value+"\"}");
		break;
		case "电影英文名":
		filter=JSON.parse("{\"movieName\":\""+value+"\"}");
		break;
		case "分类":
		filter=JSON.parse("{\"catagory\":\""+value+"\"}");
		break;
		case "国家/地区":
		filter=JSON.parse("{\"country\":\""+value+"\"}");
		break;
		case "导演":
		filter=JSON.parse("{\"director\":\""+value+"\"}");
		break;
		//case "Mtime搜索":

	}
	pagination.queryDocuments.filter=filter;
}
