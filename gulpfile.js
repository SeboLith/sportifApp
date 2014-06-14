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

    outputDir = 'app',
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
    return gulp.src('app/css/', {read: false})
        .pipe(clean());
});


gulp.task('cleanJS', function () {
    return gulp.src('app/js/', {read: false})
        .pipe(clean());
});

gulp.task('views', function () {
    return gulp.src('app/views/**/*.html')
        .pipe(refresh(lrserver));
});

// create task to prefix, minify, and notify changes to css file
gulp.task('css', function() {
    return gulp.src('pre-build/styles/*.css')
        .pipe(autoprefixer('last 15 version'))
        .pipe(concat('main.css'))
        .pipe(minifyCSS())
        .pipe(gulp.dest('app/css'))
        .pipe(refresh(lrserver));
});

gulp.task('logic', function() {
    return gulp.src('pre-build/scripts/**/*.js')
        .pipe(concat('0.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/js'))
        .pipe(refresh(lrserver));
});

gulp.task('serverStart', function () {
    var express = require('./server.js');

    return express;
});

gulp.task('serve', function() {

    //Set up your livereload server
    lrserver.listen(livereloadport);
});

gulp.watch(['app/views/**/*.html'], ['views']);

gulp.watch('pre-build/styles/*.css', ['css']);

gulp.watch('pre-build/scripts/**/*.js', ['logic']);

// the default array of tasks to run when gulp is called
gulp.task('default',
    [
      'cleanCSS',
      'cleanJS',
      'css',
      'logic',
      'serverStart',
      'serve',
      'views'
    ]
);
