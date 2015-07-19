// Include gulp
var gulp = require('gulp');

 // Include plugins
var concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	jshint = require('gulp-jshint'),
	minifyCSS = require('gulp-minify-css'),
	notify = require('gulp-notify'),
	livereload = require('gulp-livereload'),
	del = require('del');

// Concatenate and Minify JS Files
gulp.task('scripts', function(){
	return gulp.src('js/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(uglify())
		.pipe(concat('app.js'))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('build/js'))
		.pipe(notify({ message: 'Scripts tasks complete' }));
});


// Concatenate and Minify css files
gulp.task('css', function(){
    return gulp.src(['css/**.css'])
        .pipe(minifyCSS())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('build/css'))
		.pipe(notify({ message: 'CSS tasks complete' }));
});


// Clean out destination folders
gulp.task('clean', function(cb) {
	del(['build/js','build/css','build/img'], cb)
});

// Create tasks to watch if any of the files changes
gulp.task('watch', function() {
	// Watch .js files
	gulp.watch(['js/*.js'], ['scripts']);

	// Watch .css files
	gulp.watch(['css/*.css'], ['css']);

	// Create LiveReload server
	livereload.listen();

	// Watch any files in build/, reload on change
	gulp.watch(['build/**']).on('change', livereload.changed);
});

// Define default task when running gulp in CLI that includes the above tasks
gulp.task('default',['clean'], function() {
	gulp.start('scripts','css','watch');
});

