var gulp = require('gulp'),

    clean = require('gulp-clean'),

    connect = require('gulp-connect'),

    outputDir = 'app/build',

    concat = require('gulp-concat'),

    minifyCSS = require('gulp-minify-css'),

    uglify = require('gulp-uglifyjs'),

    autoprefixer = require('gulp-autoprefixer'),

    notify = require('gulp-notify');


gulp.task('cleanCSS', function () {
  return gulp.src('app/build/css/', {read: false})
    .pipe(clean());
});


gulp.task('cleanJS', function () {
  return gulp.src('app/build/js/', {read: false})
    .pipe(clean());
});

gulp.task('html', function () {
  return gulp.src('app/build/*.html')
    .pipe(connect.reload())
    .pipe(notify({ message: 'HTML updated' }));
});

gulp.task('watch', function () {
  gulp.watch(['app/build/*.html'], ['html']);
});

// create task to prefix, minify, and notify changes to css file
gulp.task('css', function() {
    return gulp.src('pre-build/styles/*.css')
        .pipe(autoprefixer('last 15 version'))
        .pipe(concat('main.css'))
        .pipe(minifyCSS())
        .pipe(gulp.dest('app/build/css'))
        .pipe(connect.reload())
        .pipe(notify({ message: 'CSS updated' }))
});

gulp.task('sportif', function() {
    return gulp.src('pre-build/scripts/fe-logic/sportif.js')
        .pipe(concat('0.js'))
        .pipe(uglify({mangle: false}))
        .pipe(gulp.dest('app/build/js'))
        .pipe(connect.reload())
        .pipe(notify({ message: 'sportif.js updated' }));
});

gulp.task('app', function() {
    return gulp.src('pre-build/scripts/fe-logic/app.js')
        .pipe(concat('1.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/build/js'))
        .pipe(connect.reload())
        .pipe(notify({ message: 'app.js updated' }));
});

gulp.task('services', function() {
    return gulp.src('pre-build/scripts/fe-logic/services.js')
        .pipe(concat('2.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/build/js'))
        .pipe(connect.reload())
        .pipe(notify({ message: 'services.js updated' }));
});

gulp.task('controllers', function() {
    return gulp.src('pre-build/scripts/fe-logic/controllers.js')
        .pipe(concat('3.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/build/js'))
        .pipe(connect.reload())
        .pipe(notify({ message: 'controllers.js updated' }));
});

gulp.task('directives', function() {
    return gulp.src('pre-build/scripts/fe-logic/directives.js')
        .pipe(concat('4.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/build/js'))
        .pipe(connect.reload())
        .pipe(notify({ message: 'directives.js updated' }));
});

gulp.task('filters', function() {
    return gulp.src('pre-build/scripts/fe-logic/filters.js')
        .pipe(concat('5.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/build/js'))
        .pipe(connect.reload())
        .pipe(notify({ message: 'filters.js updated' }));
});

gulp.watch('pre-build/styles/*.css', ['css']);

gulp.watch('pre-build/scripts/fe-logic/sportif.js', ['sportif']);

gulp.watch('pre-build/scripts/fe-logic/app.js', ['app']);


gulp.task('connect', function() {
  connect.server({
    root: outputDir,
    livereload: true
  });
});
gulp.watch('pre-build/scripts/fe-logic/services.js', ['services']);

gulp.watch('pre-build/scripts/fe-logic/controllers.js', ['controllers']);

gulp.watch('pre-build/scripts/fe-logic/directives.js', ['directives']);

gulp.watch('pre-build/scripts/fe-logic/filters.js', ['filters']);

// the default array of tasks to run when gulp is called
gulp.task('default', ['watch', 'cleanCSS', 'cleanJS', 'css', 'sportif', 'app', 'services', 'controllers', 'directives', 'filters', 'connect', 'watch']);
