var gulp = require('gulp');
var inject = require('gulp-inject');
var concat = require('gulp-concat');

 
gulp.task('inject_sources', ['concat_js', 'concat_css'], function () {
	var src = gulp.src('./src/index.html');
	// It's not necessary to read the files (will speed up things), we're only after their paths: 
	var sources = gulp.src(['./js/vendor.js', './css/vendor.css'], { read: false, cwd: './dist/' });

	return src
		.pipe(inject(sources, { addRootSlash: false }))
		.pipe(gulp.dest('./dist'));
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

gulp.task('default', ['concat_css', 'concat_js', 'inject_sources']);