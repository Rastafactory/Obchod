var gulp = require('gulp');
var nodemon = require('gulp-nodemon');

var jsFiles = ['*.js', 'src/**/*.js'];

gulp.task('serve', function () {
	var options = {
		script: 'app.js',
		delayTime: 1,
		env: {
			'PORT': 3000
		},
		watch: jsFiles
	};
	console.log('Listening on port: ' + options.env.PORT);

	return nodemon(options)
		.on('restart', function (ev) {
			console.log('restarting...');
			console.log('Listening on port: ' + options.env.PORT);
		});

});