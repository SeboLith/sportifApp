var gulp = require('gulp'),

    concat = require('gulp-concat'),

    minifyCSS = require('gulp-minify-css'),

    uglify = require('gulp-uglifyjs'),

    autoprefixer = require('gulp-autoprefixer'),

    notify = require('gulp-notify');

// create task to prefix, minify, and notify changes to css file
gulp.task('css', function() {
    return gulp.src('app/styles/*.css')
        .pipe(autoprefixer('last 15 version'))
        .pipe(concat('main.css'))
        .pipe(minifyCSS())
        .pipe(gulp.dest('app/build/css'))
        .pipe(notify({ message: 'CSS updated' }));
});

gulp.task('custom', function() {
    return gulp.src('app/scripts/fe-logic/custom.js')
        .pipe(concat('2.js'))
        .pipe(uglify({mangle: false}))
        .pipe(gulp.dest('app/build/js'))
        .pipe(notify({ message: 'custom.js updated' }));
});

gulp.task('sportif', function() {
    return gulp.src('app/scripts/fe-logic/sportif.js')
        .pipe(concat('3.js'))
        .pipe(uglify({mangle: false}))
        .pipe(gulp.dest('app/build/js'))
        .pipe(notify({ message: 'sportif.js updated' }));
});

gulp.task('app', function() {
    return gulp.src('app/scripts/fe-logic/app.js')
        .pipe(concat('4.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/build/js'))
        .pipe(notify({ message: 'app.js updated' }));
});

gulp.task('services', function() {
    return gulp.src('app/scripts/fe-logic/services.js')
        .pipe(concat('5.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/build/js'))
        .pipe(notify({ message: 'services.js updated' }));
});

gulp.task('controllers', function() {
    return gulp.src('app/scripts/fe-logic/controllers.js')
        .pipe(concat('6.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/build/js'))
        .pipe(notify({ message: 'controllers.js updated' }));
});

gulp.task('directives', function() {
    return gulp.src('app/scripts/fe-logic/directives.js')
        .pipe(concat('7.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/build/js'))
        .pipe(notify({ message: 'directives.js updated' }));
});

gulp.task('filters', function() {
    return gulp.src('app/scripts/fe-logic/filters.js')
        .pipe(concat('8.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/build/js'))
        .pipe(notify({ message: 'filters.js updated' }));
});

// watch for css file changes in the app/styles/ directory
// and run the css task
gulp.watch('app/styles/*.css', ['css']);

gulp.watch('app/scripts/fe-logic/custom.js', ['custom']);

gulp.watch('app/scripts/fe-logic/sportif.js', ['sportif']);

gulp.watch('app/scripts/fe-logic/app.js', ['app']);

gulp.watch('app/scripts/fe-logic/services.js', ['services']);

gulp.watch('app/scripts/fe-logic/controllers.js', ['controllers']);

gulp.watch('app/scripts/fe-logic/directives.js', ['directives']);

gulp.watch('app/scripts/fe-logic/filters.js', ['filters']);

// the default array of tasks to run when gulp is called
gulp.task('default', ['css', 'custom', 'sportif', 'app', 'services', 'controllers', 'directives', 'filters']);
