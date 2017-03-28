
window.onload=function(){
	var html="";
	$.ajax({
		url : "/dataReview/findAllMovies",
		success : function(res){
			var data = JSON.parse(res);
			for(var i in data){
				html += "<tr id="+i+"><td>"+
				data[i].movieNameChinese+" ("+data[i].movieName+")"+
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
	});


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
}
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