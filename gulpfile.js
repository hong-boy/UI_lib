'use strict';
var gulp = require('gulp'),
    less = require('gulp-less'),
    watch = require('gulp-watch'),
    notify = require('gulp-notify'),
    sourcemaps = require('gulp-sourcemaps'),
    del = require('del');

gulp.task('im-less', function () {
    gulp.src('./frontend/less/*.less')
        .pipe(sourcemaps.init())
        .pipe(less({globalVars: {basePicUrl: '..\\\\'}}))
        .pipe(sourcemaps.write('./maps')) //相对于css目录
        .pipe(gulp.dest('./frontend/css'))
        .pipe(notify({message: 'Task compile less done'}));
});

gulp.task('im-less-bootstrap-select', function () {
    gulp.src('./frontend/lib/bootstrap-select/less/bootstrap-select.less')
        .pipe(sourcemaps.init())
        //.pipe(less({globalVars:{basePicUrl: '..\\'}}))
        .pipe(gulp.dest('./frontend/lib/bootstrap-select/css'))
        .pipe(sourcemaps.write('./maps')) //相对于css目录
        .pipe(notify({message: 'Task compile bootstrap-select less done'}));
});

gulp.task('less', function () {
    gulp.start('im-less');
    watch('./frontend/less/*.less', function () {
        gulp.start('im-less');
    });
});
gulp.task('less-bootstrap-select', function () {
    gulp.start('im-less-bootstrap-select');
    watch('./frontend/lib/bootstrap-select/less/*.less', function () {
        gulp.start('im-less-bootstrap-select');
    });
});
gulp.task('build-less', function () {
    gulp.start('less');
    gulp.start('less-bootstrap-select');
});
