// gulpfile.js

var gulp = require('gulp');
var clean = require('gulp-clean');
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

var bases = {
	app: './src/',
	dist: './dist/'
}
var path = {
	app: 'app.js',
	start: 'bin/www',
	scripts: ['scripts/','scripts/**.js'],
	stylus: ['styles/','styles/**.styl'],
	routes: ['routes/','routes/**.js'],
	views: ['views/','views/**.jade'],
	js: ['public/js/','public/js/**.js'],
	css: ['public/css/','public/css/**.css'],
	bundle: 'public/js/bundle.js'
}

gulp.task('default', function () {
	gutil.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
	gutil.log('PLEASE USE:');
	gutil.log('gulp dev - to start on development');
	gutil.log('gulp pro - to start on production');
	gutil.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
});

gulp.task('clean', function(){
	return gulp.src(bases.dist)
	.pipe(clean());
});

gulp.task('copy',['clean'], function(){
	// Copy app.js
	gulp.src(bases.app + path.app)
	.pipe(gulp.dest(bases.dist));
	gutil.log('Gulp copied app.js')
	// Copy server
	gulp.src(bases.app + path.start)
	.pipe(gulp.dest(bases.dist + 'bin'));
	gutil.log('Gulp copied server files')
	// Copy routes
	gulp.src(bases.app + path.routes[1])
	.pipe(gulp.dest(bases.dist + path.routes[0]))
	gutil.log('Gulp copied routes')
	// Copy views
	gulp.src(bases.app + path.views[1])
	.pipe(gulp.dest(bases.dist + path.views[0]))
	gutil.log('Gulp copied views')
});

gulp.task('js',['clean', 'copy'], function(){
	// all scripts get browser- and uglyfied
	return gulp.src(bases.app + path.scripts[1])
		.pipe(concat('bundle.js'))
		.pipe(gulp.dest(bases.dist + path.js[0]))
		.on('end', function(){ gutil.log('Gulp piped scripts to bundle.js') });
});

gulp.task('jspublish', ['clean', 'copy', 'js'], function(){
	// browserify resolves all requirements
	return browserify(bases.dist + path.bundle)
		.bundle()
		.pipe(source('bundle.js'))
		.pipe(gulp.dest(bases.dist + path.js[0]))
		.on('end', function(){ gutil.log('Gulp\'s bundle.js got browserified') });
});

gulp.task('uglify', ['clean', 'copy', 'js', 'jspublish'], function(){
	return gulp.src(bases.dist + path.bundle)
	.pipe(uglify())
	.pipe(gulp.dest(bases.dist + path.js[0]))
})

gulp.task('css',['clean', 'copy'], function(){
	return gulp.src(bases.app + path.stylus[1])
		.pipe(stylus())
		.pipe(concat('style.css'))
		.pipe(uglifyCSS())
		.pipe(gulp.dest(bases.dist + path.css[0]))
		.on('end', function(){ gutil.log('Gulp piped styles to style.css')});
})

gulp.task('pro', ['clean', 'copy', 'js', 'jspublish', 'css', 'uglify'], function(cb){

		var started = false;

		return nodemon({
			script: bases.dist + path.start
		}).on('start', function () {
			// to avoid nodemon being started multiple times
			if (!started) {
				cb();
				started = true;
			}
			gutil.log('Gulp started production server')
		});
});

gulp.task('dev', ['scripts', 'styles', 'browserify', 'browser-sync']);

gulp.task('browser-sync', ['scripts', 'styles', 'browserify', 'nodemon'], function() {
	browserSync.init(null, {
		proxy: "http://localhost:5000",
        browser: "google chrome",
        port: 7000,
	});
	gulp.watch(bases.app + path.css[1], ['styles']);
	gulp.watch(bases.app + path.scripts[1], ['scripts', 'browserify']);
  gulp.watch('**/*.*').on('change', browserSync.reload);
});

gulp.task('nodemon', function (cb) {

	var started = false;

	return nodemon({
		script: bases.app + path.start
	}).on('start', function () {
		// to avoid nodemon being started multiple times
		if (!started) {
			cb();
			started = true;
		}
		gutil.log('Gulp started development server')
	});
});

gulp.task('scripts', function(){
	// all scripts get browser- and uglyfied
	return gulp.src(bases.app + path.scripts[1])
		.pipe(concat('bundle.js'))
		.pipe(gulp.dest(bases.app + path.js[0]))
		.on('end', function(){ gutil.log('Gulp piped scripts to bundle.js') });
});

gulp.task('browserify', ['scripts'], function(){
	// browserify resolves all requirements
	return browserify(bases.app + path.bundle)
		.bundle()
		.pipe(source('bundle.js'))
		.pipe(gulp.dest(bases.app + path.js[0]))
		.on('end', function(){ gutil.log('Gulp\'s bundle.js got browserified') });
});

gulp.task('styles', function(){
	// all styles get bundled and uglyfied
	return gulp.src(bases.app + path.stylus[1])
	.pipe(stylus())
	.pipe(concat('style.css'))
	.pipe(uglifyCSS())
	.pipe(gulp.dest(bases.app + path.css[0]))
	.on('end', function(){ gutil.log('Gulp piped styles to style.css')});
});
