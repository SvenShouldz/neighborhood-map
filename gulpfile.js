// gulpfile.js

var gulp = require('gulp');
var concat = require('gulp-concat');
var nodemon = require('gulp-nodemon');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var stylus = require('gulp-stylus');
var uglifyCSS = require('gulp-uglifycss');
var browserSync = require('browser-sync');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');

var env = 'src';

var path = {
	app: './' + env + '/app.js',
	start: './' + env + '/bin/www',
	scripts: './' + env + '/scripts/*.js',
	img: './' + env + '/images/*.+(jpg|png)',
	css: './' + env + '/styles/*.styl',
	routes: './' + env + '/routes/*.js',
	views: './' + env + '/views/*.jade',
	js: './' + env + '/public/js/',
	bundle: './' + env + '/public/js/bundle.js'
}

gulp.task('default', ['scripts', 'styles', 'browserify', 'browser-sync']);

gulp.task('browser-sync', ['scripts', 'styles', 'browserify', 'nodemon'], function() {
	browserSync.init(null, {
		proxy: "http://localhost:5000",
        browser: "google chrome",
        port: 7000,
	});
	gulp.watch(path.css, ['styles']);
	gulp.watch(path.scripts, ['scripts', 'browserify']);
  gulp.watch('**/*.*').on('change', browserSync.reload);
});

gulp.task('nodemon', function (cb) {

	var started = false;

	return nodemon({
		script: path.start
	}).on('start', function () {
		// to avoid nodemon being started multiple times
		if (!started) {
			cb();
			started = true;
		}
		gutil.log('Gulp started nodemon on: ' + env)
	});
});

gulp.task('scripts', function(){
	// all scripts get browser- and uglyfied
	return gulp.src(path.scripts)
		.pipe(concat('bundle.js'))
		.pipe(gulp.dest(path.js))
		.on('end', function(){ gutil.log('Gulp piped scripts to bundle.js') });
});

gulp.task('browserify', ['scripts'], function(){
	// browserify resolves all requirements
	return browserify(path.bundle)
		.bundle()
		.pipe(source('bundle.js'))
		.pipe(gulp.dest(path.js))
		.on('end', function(){ gutil.log('Gulp\'s bundle.js got browserified') });
});

gulp.task('styles', function(){
	// all styles get bundled and uglyfied
	return gulp.src(path.css)
	.pipe(stylus())
	.pipe(concat('style.css'))
	.pipe(uglifyCSS())
	.pipe(gulp.dest('./' + env + '/public/css'))
	.on('end', function(){ gutil.log('Gulp piped styles to style.css')});
});
