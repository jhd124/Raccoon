for (var i = 0; i < movieNameArray.length; i++) {
	movieNameArray[i]["filename"] = normalizeFileName(movieNameArray[i].movieName)
}
Vue.component('todo-moviepic',{
	props: ['todo'],
	// template: '<source media="(min-width:1200px)" src="./img/cover/large-{{todo.filename}}.jpg">{{todo.filename}}</source>'
		template: '{{<p title=todo.filename></p>}}'

})
var app_1 = new Vue({
	el: '#app-1',
	data:{
		movieNameArray:movieNameArray
	}
})
function normalizeFileName(name){
		var filename = name.replace(/[/\":*?<>|\\ ]/g,'');
		return filename;
}
Vue.component('todo-movpic', {
  props: ['todo'],
  template: '<a>{{ todo.movieName }}</a>'
})
var app7 = new Vue({
  el: '#app-7',
  data: {
    movieNameArray:movieNameArray
  }
})
