'use strict';
var gulp = require('gulp'),
    less = require('gulp-less'),
    watch = require('gulp-watch'),
    notify = require('gulp-notify'),
    del = require('del');

gulp.task('less', function () {
    watch('./frontend/less/*.less', function () {
        gulp.src('./frontend/less/*.less')
            .pipe(less())
            .pipe(gulp.dest('./frontend/css'))
            .pipe(notify({message: 'Task compile less done'}));
    });
});