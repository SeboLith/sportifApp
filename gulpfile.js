'use strict';

var gulp = require('gulp'),

    express = require('express'),

    refresh = require('gulp-livereload'),

    lr = require('tiny-lr'),

    lrserver = lr(),
    // A gulp plugin for removing files and folders.
    clean = require('gulp-clean'),
    // Gulp plugin to run a webserver (with LiveReload).
    connect = require('gulp-connect'),

    outputDir = 'app/build',
    // Concat files by your operating system's newLine.
    concat = require('gulp-concat'),
    // Minify css with clean-css, including optional caching.
    minifyCSS = require('gulp-minify-css'),
    // Minify multiple files with UglifyJS.
    uglify = require('gulp-uglifyjs'),
    // CSS autoprefixer for gulp.
    autoprefixer = require('gulp-autoprefixer'),
    // Gulp plugin to send notification messages.
    notify = require('gulp-notify'),

    livereloadport = 35729,

    serverport = 8081;


gulp.task('cleanCSS', function () {
    return gulp.src('app/build/css/', {read: false})
        .pipe(clean());
});


gulp.task('cleanJS', function () {
    return gulp.src('app/build/js/', {read: false})
        .pipe(clean());
});

gulp.task('views', function () {
    return gulp.src('app/build/views/**/*.html')
        .pipe(refresh(lrserver))
        .pipe(notify({ message: 'HTML updated' }));
});

// create task to prefix, minify, and notify changes to css file
gulp.task('css', function() {
    return gulp.src('pre-build/styles/*.css')
        .pipe(autoprefixer('last 15 version'))
        .pipe(concat('main.css'))
        .pipe(minifyCSS())
        .pipe(gulp.dest('app/build/css'))
        .pipe(refresh(lrserver))
        .pipe(notify({ message: 'CSS updated' }))
});

gulp.task('sportif', function() {
    return gulp.src('pre-build/scripts/fe-logic/sportif.js')
        .pipe(concat('0.js'))
        .pipe(uglify({mangle: false}))
        .pipe(gulp.dest('app/build/js'))
        .pipe(refresh(lrserver))
        .pipe(notify({ message: 'sportif.js updated' }));
});

gulp.task('app', function() {
    return gulp.src('pre-build/scripts/fe-logic/app.js')
        .pipe(concat('1.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/build/js'))
        .pipe(refresh(lrserver))
        .pipe(notify({ message: 'app.js updated' }));
});

gulp.task('config', function() {
    return gulp.src('pre-build/scripts/fe-logic/config.js')
        .pipe(concat('6.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/build/js'))
        .pipe(refresh(lrserver))
        .pipe(notify({ message: 'config.js updated' }));
});

gulp.task('services', function() {
    return gulp.src('pre-build/scripts/fe-logic/services.js')
        .pipe(concat('2.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/build/js'))
        .pipe(refresh(lrserver))
        .pipe(notify({ message: 'services.js updated' }));
});

gulp.task('factories', function() {
    return gulp.src('pre-build/scripts/fe-logic/factories.js')
        .pipe(concat('7.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/build/js'))
        .pipe(refresh(lrserver))
        .pipe(notify({ message: 'factories.js updated' }));
});

gulp.task('controllers', function() {
    return gulp.src('pre-build/scripts/fe-logic/controllers.js')
        .pipe(concat('3.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/build/js'))
        .pipe(refresh(lrserver))
        .pipe(notify({ message: 'controllers.js updated' }));
});

gulp.task('directives', function() {
    return gulp.src('pre-build/scripts/fe-logic/directives.js')
        .pipe(concat('4.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/build/js'))
        .pipe(refresh(lrserver))
        .pipe(notify({ message: 'directives.js updated' }));
});

gulp.task('filters', function() {
    return gulp.src('pre-build/scripts/fe-logic/filters.js')
        .pipe(concat('5.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/build/js'))
        .pipe(refresh(lrserver))
        .pipe(notify({ message: 'filters.js updated' }));
});

gulp.task('serverStart', function () {
    var express = require('./server.js');

    return express;
});

gulp.task('serve', function() {
    //Set up your static fileserver, which serves files in the build dir
    http.createServer(ecstatic({ root: __dirname + '/dist' })).listen(serverport);

    //Set up your livereload server
    lrserver.listen(livereloadport);
});

gulp.watch(['app/build/views/**/*.html'], ['views']);

gulp.watch('pre-build/styles/*.css', ['css']);

gulp.watch('pre-build/scripts/fe-logic/sportif.js', ['sportif']);

gulp.watch('pre-build/scripts/fe-logic/app.js', ['app']);

gulp.watch('pre-build/scripts/fe-logic/config.js', ['config']);

gulp.watch('pre-build/scripts/fe-logic/services.js', ['services']);

gulp.watch('pre-build/scripts/fe-logic/factories.js', ['factories']);

gulp.watch('pre-build/scripts/fe-logic/controllers.js', ['controllers']);

gulp.watch('pre-build/scripts/fe-logic/directives.js', ['directives']);

gulp.watch('pre-build/scripts/fe-logic/filters.js', ['filters']);

// the default array of tasks to run when gulp is called
gulp.task('default',
    [
      'cleanCSS',
      'cleanJS',
      'views',
      'css',
      'sportif',
      'app',
      'config',
      'services',
      'factories',
      'controllers',
      'directives',
      'filters',
      'serverStart',
      'serve'
    ]
);
