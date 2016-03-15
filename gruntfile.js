module.exports = function(grunt){
	
	grunt.initConfig({
		watch:{
			jade: {
				files: ['views/**'],
				options: {
					livereload: true
				}
			},
			js: {
				files: ['public/js/**','models/**/*.js','schemas/**/*.js'],
				//tasks: ['jshint'],
				options: {
					livereload: true
				}
			}
		},

		nodemon: {
			dev: {
				options: {
					file: 'app.js',
					args: [],
					ignoredFiles: ['README.md','node_modules/**','.DS_Store'],
					watchedExtensions: ['js'],
					watchedFolders: ['./'],
					debug: true,
					delayTime: 1,
					env: {
						PORT: 3000
					},
					cwd: __dirname
				}
			}
		},

		concurrent: {
			tasks: ['nodemon','watch'],
			options: {
				logConcurrentOutput: true
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch'); //用处：只要有文件增加、删除、修改,会重新去执行它里面注册好的任务
	grunt.loadNpmTasks('grunt-nodemon'); //用处：用于实时监听app.js，能自动重启服务
	grunt.loadNpmTasks('grunt-concurrent'); //用处：针对慢任务开发的插件，如sass，less

	grunt.option('force',true);  //不要因为警告这些错误终断服务
	grunt.registerTask('default',['concurrent']);
}