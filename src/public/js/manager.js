var model = {
    form: {
        saveBtnSwitcher: "modi",
    
        MtimeSearchUrl: "http://search.mtime.com/search/?q=",

    }
}

var methods = {

    updateIndexMovieNameData: function(){
        $.ajax({
            type: "GET",
            url: "/dataReview/updateIndexMovieNameData",
            success: function(res){
                $('#success').modal();
            }
        })
    },
    
    setSearchFilter: function(key,value){
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
    },

    form: {
    //收集表单数据  应该称jquery自带的方法
        collectFormData: function(operation){
            var data = {};
            var dataElement = formView.dataElement;
            for(var i=0;i<dataElement.length;i++){
                var data_id = dataElement[i].id;
                data[data_id]=dataElement[i].value;
            }
            data.operation = operation;
            return data;
        },

        setSaveBtnCondi: function(condi){
            model.form.saveBtnSwitcher = condi;
        },

        getSaveBtnCondi: function(){
            return model.form.saveBtnSwitcher;
        },

        fulfilFormAndLock: function(data){
            for(var key in data){
                $("#"+key).val(data[key]);
                $("#"+key).get(0).disabled = "disabled"
            }
        },

        buttons: {
            turnToCreate: function(){
                model.form.saveBtnSwitcher = 'create';
            },
            turnToModify: function(){
                model.form.saveBtnSwitcher = 'modi';
            }
        }

    },
    AjaxRequest: {
        addRecords: function(data){
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
        },

        addOverride: function(data){
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
        },

        deleteRecord: function(data){
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
        },

        updateRecord: function(data){
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
        },

        spider: function(MtimeUrl,flag,callback){
            $.ajax({
                type: 'GET',
                url: "/retriveMovieData?MtimeUrl="+MtimeUrl+'&operation='+flag,
                success: function(res){
                callback(res)
                }
            })
        }

    },

    

};


//表格视图
var tableView = {
    init: function(){
        this.dataList = $('#dataList');
        //表头按钮效果
        this.theadBtn =  $('thead').children().children();
        this.theadBtn.mousedown(function(){
            this.setAttribute('style','background-color:#eee');
        });
        this.theadBtn.mouseup(function(){
            this.removeAttribute('style');
        });
        //表头click
        var theadBtnArray = Array.prototype.slice.call(document.getElementById('theadBtn').children[0].children);
        theadBtnArray.forEach(function(e){
            var key = e.getAttribute('data-thead');
            var sorter = JSON.parse('{"'+key+'":1}');
            var option = {sorter:sorter};
            e.onclick=function(){
                pagination.queryDocuments.queryAjax(option);
            }
        })
    },
    tableGenerate: function(data){
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
            (data[i].actor1Chinese?data[i].actor1Chinese:data[i].actor1En)+"|"+(data[i].actor2Chinese?data[i].actor2Chinese:data[i].actor2En)+"|"
            +(data[i].actor3Chinese?data[i].actor3Chinese:data[i].actor3En)+"|"+(data[i].actor4Chinese?data[i].actor4Chinese:data[i].actor4En)+
            "</td></tr>"
        }
        this.dataList[0].innerHTML = html;

        this.dataList.children().click(function(){
            $('#myModal').modal('show');
            $('#delete').get(0).style.display='inline-block';
            var index = this.id;
            methods.form.fulfilFormAndLock(data[index])
        });
    }
}


//表单视图
var formView = {
    init: function(){
         this.dataElement = $(".dataElement");
         methods.form.buttons.turnToModify();
         this.functionBtn.init();
    },

    clearForm: function(){
        var dataElement =formView.dataElement;
        for(var j = 0; j<dataElement.length-1; j++){
            dataElement[j].value = "";
        }
        story.value="";
    },

    lockForm: function(){
        for(var j = 0; j<this.dataElement.length; j++){
			this.dataElement[j].disabled = "disabled";
		}
    },
    unlockForm: function(){
        for(var j = 0; j<this.dataElement.length; j++){
			this.dataElement[j].disabled = false;
		}
    },

//功能按钮视图
    functionBtn: {
        init: function(){
            var me = this;

            this.search = $('#search');
            this.Mtimesearch = $("#Mtimesearch");
            this.smartSearch = $("#smartSearch");
            this.smartsave = $('#smartsave');
            this.saveBtn = $('#save');
            this.modify = $("#modify");
            this.formModal = $("#myModal");
            this.alert_modify = $('#alert_modify');
            this.deleteBtn = $('#delete');

            this.showModifyBtn();
            this.search.click(function(){
                var key = search_key.value;
                var value = search_value.value;
                if(key!=='Mtime搜索'){
                    methods.setSearchFilter(key,value);
                    pagination.setCurrentPage(1);
                    pagination.setActive(0);
                }else{
                    var url = model.form.MtimeSearchUrl+value;
                    window.open(url);
                }
            });

            this.Mtimesearch.click(function(){
                var value = Mtimesearch_value.value;
                var url = "http://search.mtime.com/search/?q="+value;
                window.open(url);
            });

            this.smartSearch.click(function(){
                me.showFormModal();
                me.showSmartSaveBtn();
                formView.dataElement.removeAttr('value');
                formView.unlockForm();
                var url = MtimeUrl.value;
                methods.AjaxRequest.spider(url,'q',function(res){
                    var data = JSON.parse(res);
                    me.showFormModal();
                    for(var key in data){
                        $('#'+key).get(0).value=data[key]
                    }
                })
            });
            this.smartsave.click(function(){
                $('#save').click()
		        var url = MtimeUrl.value;
		        methods.AjaxRequest.spider(url,'s')
            });
            this.modify.click(function(){
                me.showSaveBtn();
                formView.unlockForm();
            });
            this.saveBtn.click(function(){
                if(methods.form.getSaveBtnCondi()==='modi')
                    me.alert_modify.modal();
                else if(methods.form.getSaveBtnCondi()==='create'){
                    var data = methods.form.collectFormData('create');
			        methods.AjaxRequest.addRecords(data);
                }
            });
            this.formModal.on('hidden.bs.modal',function(e){
                me.showModifyBtn();
                methods.form.setSaveBtnCondi("modi");
                me.deleteBtn.hide();
                formView.clearForm();
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
            $('#sureToModify').click(function(){
                var data = methods.form.collectFormData('update');
                methods.AjaxRequest.updateRecord(data);
                $('#alert_modify').modal('hide');
            });
            $('#sureToSuccess').click(function(){
                location.reload();
            });
            $('#createRecord').click(function(){
                me.showSaveBtn();
                me.showFormModal();
                methods.form.setSaveBtnCondi("create");
                formView.dataElement.removeAttr('value');
                formView.unlockForm();
            });
            $('#override').click(function(){
                if(methods.form.getSaveBtnCondi()==='modi'){
                    var data = methods.form.collectFormData('update');
                    methods.AjaxRequest.addOverride(data);
                }else{
                    var data = methods.form.collectFormData('create');
                    methods.AjaxRequest.addOverride(data);
                }
                $('#alert_override').modal('hide');
            });
            this.deleteBtn.click(function(){
                $('#alert_delete').modal();
            });
            $('#sureToDelete').click(function(){
                var data ={_id: $('#_id')[0].value};
                methods.AjaxRequest.deleteRecord(data);
                $('#alert_delete').modal('hide');
            })
            $('#updateIndexMovieNameData').click(function(){
                methods.updateIndexMovieNameData();
            })
        },
        hideSaveBtn: function(){
            this.saveBtn.hide();
        },
        showSaveBtn: function(){
            this.saveBtn.show();
            this.hideModifyBtn();
            this.hideSmartSaveBtn();
        },
        hideModifyBtn:function(){
            this.modify.hide();
        },
        showModifyBtn: function(){
            this.modify.show();
            this.hideSaveBtn();
            this.hideSmartSaveBtn();
        },
        hideSmartSaveBtn: function(){
            this.smartsave.hide();
        },
        showSmartSaveBtn: function(){
            this.smartsave.show();
            this.hideModifyBtn();
            this.hideSaveBtn();
        },
        showFormModal: function(){
            this.formModal.modal('show');
        },
    }
}

//分页控件
btns = Array.prototype.slice.call(laura.children);
var pagination = {
	first : first,
	last : last,
	normalbtns : btns.slice(1,btns.length-1),
	active : 0,//index of normalbtns
	pointer : 2,//first后面的第一个按钮上的页数
	//btnStatus: [],
	currentIndex: 0,
	currentPage: 1,
    recordsPerPage: 30,
    APIUrl: "",
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
			url = pagination.APIUrl+"?filter="+filter+"&sorter="+sorter+"&currentPage="+currentPage+"&recordsPerPage="+recordsPerPage;
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
					tableView.tableGenerate(data);
					var totalRecords = data[data.length-1];
					var totalPage = totalRecords%pagination.recordsPerPage==0?totalRecords/pagination.recordsPerPage:parseInt(totalRecords/pagination.recordsPerPage)+1;
					pagination.setTotalPage(totalPage);
					pagination.displayBtns();
				}
			})
		}
	}
};
paginationView = {
    init: function(option){
        var sorter = option.sorter||{};
        var filter = option.filter||{};
        var jumpFlip = option.jumpFlip||4;
        pagination.queryDocuments.setSorter(sorter);
        pagination.queryDocuments.setFilter(filter);
        pagination.APIUrl = option.APIUrl||"";
        pagination.recordsPerPage = option.recordsPerPage||30;
        pagination.setCurrentPage(1);
        pagination.setActive(0);

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
            }else{
                if($('.active')[0].nextElementSibling.firstChild.click)
                    $('.active')[0].nextElementSibling.firstChild.click();
            }
        }
        pagination.normalbtns.forEach(function(e){
            e.onclick=function(){
                if(this.firstChild.innerHTML=="..."&&this.firstChild.id=='first'){
                    pagination.flip(-1*jumpFlip)
                }else if(this.firstChild.innerHTML=="..."&&this.firstChild.id=='last'){
                    pagination.flip(jumpFlip)
                }else{
                    var index = parseInt(this.getAttribute('data-index'));
                    pagination.setActive(index);
                }
            }
        })
    }
}
window.onload = function(){
    var paginationInitOptions = {
        sorter: {movieName:1},
        APIUrl: "/dataReview/findAllMovies",
    }
    paginationView.init(paginationInitOptions);
    tableView.init();
    formView.init();
}
$( document ).ajaxError(function( event, request, settings ) {
  alert("在请求地址 "+settings.url+" 时出错");
})