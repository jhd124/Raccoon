var pagination = {
	first : first,
	last : last,
	btns : Array.prototype.slice.call(laura.children),
	normalbtns : this.btns.slice(1,this.btns.length-1),
	active : 0,//index of normalbtns
	pointer : 2,//first后面的第一个按钮上的页数
	//btnStatus: [],
	currentPage: 1,
	recordsPerPage: 30,
	totalPage : 1,
	setTotalPage: function(n){
		this.totalPage=n;
	}
	setRecordsPerPage: function(recordsPerPage){
		this.recordsPerPage=recordsPerPage;
	},
	setCurrentPage : function(p){
		this.currentPage=p;
	},
	setData_num: function(lableIndex,n){
		this.normalbtns[lableIndex].setAttribute('data-num',n);
		this.normalbtns[lableIndex].innerHTML=n;
	},
	setActive: function(lableIndex){
		this.normalbtns[this.currentPage].parentElement.removeAttribute('class');
		this.normalbtns[lableIndex].parentElement.setAttribute('class','active');
		setCurrentPage(parseInt(normalbtns[lableIndex].getAttribute('data-num')));
		queryDocuments.queryAjax({});
	},
	hideBtn: function(lableIndex){
		this.normalbtns[lableIndex].parentElement.style.display='none';
	},
	showBtn: function(lableIndex){
		this.normalbtns[lableIndex].parentElement.removeAttribute('style');
	},
	setPointer : function(p){
		this.pointer=p;
	},
	//
	displayBtns : function(){
		for(let i=-1;i<this.normalbtns.length-1;i++){
			if(this.pointer+i>this.totalPage){
				this.hideBtn(i+1);
			}else{
				this.setData_num(this.pointer+i);
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
		if((var newPointer=this.pointer+n)<=this.totalPage){
			this.setPointer(newPointer);
			this.displayBtns();
			var btnShown = document.querySelector("[data-num]");
			setActive(parseInt(btnShown.length/2));
		}else{
			return false;
		}
	}
};

var queryDocuments = {
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
		this.setFilter(option.filter);
		if(option.sorter)
		this.setSorter(option.sorter);
		var url = generateQueryUrl();
		$.ajax({
			url : url,
			success : function(res){
			var data = JSON.parse(res);
            tableGenerate(data);
            pagination.setTotalPage(data[data.length-1]);
			}
		})
	}
}