var gulp = require('gulp');
var inject = require('gulp-inject');
var concat = require('gulp-concat');
var Server = require('karma').Server;
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");

gulp.task('test', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
}); 

/**
 * Watch for file changes and re-run tests on each change
 */
gulp.task('tdd', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js'
  }, done).start();
});

gulp.task('inject_sources', ['concat_js', 'concat_css', 'uglify'], function () {
	var src = gulp.src('./src/index.html');
	// It's not necessary to read the files (will speed up things), we're only after their paths: 
	var vendorSources = gulp.src(['./js/vendor.js', './css/vendor.css'], { read: false, cwd: './dist/' });
	var mainSources = gulp.src(['./js/main.js'], { read: false, cwd: './dist/' });

	return src
		.pipe(inject(vendorSources, { addRootSlash: false, name: 'vendor' }))
		.pipe(inject(mainSources, { addRootSlash: false, name: 'main' } ))
		.pipe(gulp.dest('./dist'));
});

gulp.task('uglify', function() {
	return gulp.src('./src/js/tempMon.js')
    	.pipe(uglify())
    	.pipe(rename('main.js'))
    	.pipe(gulp.dest('./dist/js/'));
});

gulp.task('concat_js', function() {
	return gulp.src(['./bower_components/jquery/dist/jquery.min.js', 
		'./bower_components/bootstrap/dist/js/bootstrap.min.js',
		'./bower_components/angular/angular.min.js',
		'./bower_components/Chart.js/Chart.min.js',
		'./bower_components/angular-chart.js/dist/angular-chart.min.js'])
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('./dist/js/'));
});

gulp.task('concat_css', function() {
	return gulp.src(['./bower_components/bootstrap/dist/css/bootstrap.min.css',
		'bower_components/angular-chart.js/dist/angular-chart.min.css'])
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest('./dist/css/'));
});

gulp.task('default', ['uglify', 'concat_css', 'concat_js', 'inject_sources']);
