'use strict';
var gulp = require('gulp'),
    less = require('gulp-less'),
    watch = require('gulp-watch'),
    notify = require('gulp-notify'),
    sourcemaps = require('gulp-sourcemaps'),
    del = require('del');

gulp.task('less', function () {
    watch('./frontend/less/*.less', function () {
        gulp.src('./frontend/less/*.less')
            .pipe(sourcemaps.init())
            .pipe(less())
            .pipe(sourcemaps.write('./maps')) //相对于css目录
            .pipe(gulp.dest('./frontend/css'))
            .pipe(notify({message: 'Task compile less done'}));
    });
});
gulp.task('less-bootstrap-select', function () {
    watch('./frontend/lib/bootstrap-select/less/*.less', function () {
        gulp.src('./frontend/lib/bootstrap-select/less/bootstrap-select.less')
            .pipe(sourcemaps.init())
            .pipe(less())
            .pipe(gulp.dest('./frontend/lib/bootstrap-select/css'))
            .pipe(sourcemaps.write('./maps')) //相对于css目录
            .pipe(notify({message: 'Task compile bootstrap-select less done'}));
    });
});
gulp.task('build-less', function () {
    gulp.start('less');
    gulp.start('less-bootstrap-select');
});
