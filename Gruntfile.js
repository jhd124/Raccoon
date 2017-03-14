module.exports = function(grunt){
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		responsive_images:{
			dev:{
				options:{
					engine: 'im',
					sizes:[{
						width: 250,
						suffix: '-large-yourName',
						quality: 100
 					},{
						width: 110,
						suffix: '-medium-1x-yourName',
						quality: 70
 					},{
						width: 220,
						suffix: '-medium-2x-yourName',
						quality: 70
 					},{
						width: 110,
						suffix: '-small-1x-yourName',
						quality: 70
 					},{
						width: 220,
						suffix: '-small-2x-yourName',
						quality: 70
 					},{
						width: 330,
						suffix: '-small-3x-yourName',
						quality: 90
 					}]
				},
				files:[{
					expand: true,
					src: ['*.{gif,jpg,png}'],
					cwd: 'raw/posters/',
					dest: 'public/img/cover'
				}]
			}
		},

	});
	grunt.loadNpmTasks('grunt-responsive-images');
	grunt.registerTask('default', ['responsive_images']);
}