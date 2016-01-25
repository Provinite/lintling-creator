var $        = require('gulp-load-plugins')();
var argv     = require('yargs').argv;
var gulp     = require('gulp');
var rimraf   = require('rimraf');
var sequence = require('run-sequence');

var isProduction = false;
//File Paths
var paths = {
	assets: [
		'./client/**/*.*',
		'!./client/templates/**/*.*',
		'!./client/assets/{scss,js}/**/*.*'
	],
	sass: [
		'client/assets/scss'
	],
	appJS: [
		'client/assets/js/app.js',
		'client/assets/js/controllers/*.js'
	]
}

gulp.task('clean', function(cb) {
	rimraf('./build', cb);
});

gulp.task('copy', function() {
	return gulp.src(paths.assets, {
		base: './client/'
	}).pipe(gulp.dest('./build'));
});

gulp.task('sass', function () {
  return gulp.src('client/assets/scss/app.scss')
    .pipe($.sass({
      includePaths: paths.sass,
      outputStyle: (isProduction ? 'compressed' : 'nested'),
      errLogToConsole: true
    })
    .on('error', function (e) {
      console.log(e);
      this.emit('end');
    }))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions', 'ie 10']
    }))
    .pipe(gulp.dest('./build/assets/css/'))
  ;
});

gulp.task('server', ['build'], function() {
  gulp.src('./build')
    .pipe($.webserver({
      port: 8079,
      host: 'localhost',
      fallback: 'index.html',
      livereload: true,
      open: true
    }))
  ;
});

gulp.task('uglify', function() {
  var uglify = $.if(isProduction, $.uglify()
    .on('error', function (e) {
      console.log(e);
    }));

  return gulp.src(paths.appJS)
    .pipe(uglify)
    .pipe($.concat('app.js'))
    .pipe(gulp.dest('./build/assets/js/'))
  ;
});

gulp.task('build', function(cb) {
  sequence('clean', ['copy', 'sass', 'uglify'], cb);
});

gulp.task("default", ['server'], function() {
  // Watch Sass
  gulp.watch(['./client/assets/scss/**/*', './scss/**/*'], ['sass']);

  // Watch JavaScript
  gulp.watch(['./client/assets/js/**/*', './js/**/*'], ['uglify']);

  // Watch static files
  gulp.watch(['./client/**/*.*', '!./client/templates/**/*.*', '!./client/assets/{scss,js}/**/*.*'], ['copy']);

  // Watch app templates
  //gulp.watch(['./client/templates/**/*.html'], ['copy:templates']);
});