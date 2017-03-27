
window.onload=function(){
	var html="";
	$.ajax({
		url : "/dataReview/findAllMovies",
		success : function(res){
			var data = JSON.parse(res);
			for(var i in data){
				html += "<tr id="+i+"><td>"+
				data[i].movieNameChinese+
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

			$('#alert_modify')[0].dataset.modiorcreate='modi';

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
		if($('#alert_modify')[0].dataset.modiorcreate==='modi'){
			$('#alert_modify').modal();
		}else{
			var data = collectFormData();
			addRecords(data);
		}
	});
	//在模态框关闭的时候让save隐藏，让modify显示--------
	$('#myModal').on('hidden.bs.modal', function (e) {
		$('#save').hide();
		$('#modify').show();
		$('#alert_modify')[0].dataset.modiorcreate='modi';
	});
	$('#alert_override').on('hidden.bs.modal',function(e){
		$('body').attr('class','modal-open');
	});
	$('#alert_modify').on('hidden.bs.modal',function(e){
		$('body').attr('class','modal-open');
	});
	//-----------------------------------------------------
	$('#sureToModify').click(function(){
		var data = collectFormData();
		updateRecord(data);
	})
	$('#sureToSuccess').click(function(){
		location.reload();
	})
	$('#createRecord').click(function(){
		$('#modify').hide();
		$('#save').show();
		$('#myModal').modal('show');
		$('#alert_modify').attr('data-modiorcreate','create');
		var dataElement = $(".dataElement");
		dataElement.removeAttr('value');
		for(var j = 0; j<dataElement.length; j++){
			dataElement[j].disabled= false;
		}
	});
	$('#override').click(function(){
		var data = collectFormData();
		addOverride(data);
	});
}
function collectFormData(){
	var data = {};
	var dataElement = $(".dataElement");
	for(var i=0;i<dataElement.length;i++){
		var data_id = dataElement[i].id;
		data[data_id]=dataElement[i].value;
	}
	return data;
}

function addRecords(data){
	$.ajax({
		type: 'POST',
		url: '/addRecords',
		data: data,
		success: function(res){
			if(res==='exists'){
				$('#alert_override').modal()
			}else{
				$('#success').modal();
			}
		}
	})
}

function addOverride(data){
	$.ajax({
		type: 'POST',
		url: '/addOverride',
		data: data,
		success: function(){
			$('#success').modal();
		}
	})
}

// function addAnother(data){
// 	$ajax({
// 		url: '/addAnother',
// 		data:
// 		success: 
// 	})
// }

function updateRecord(data){
	$.ajax({
		type: 'POST',
		url: '/updateRecord',
		data: data,
		success: function(){
			$('#success').modal();
		}
	})
}