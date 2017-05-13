module.exports = function normalizeFileName(name){
		var filename = name.replace(/[/\":*?<>|\\ ]/g);
		return filename;
}