'use strict';
var gulp = require('gulp'),
    less = require('gulp-less'),
    watch = require('gulp-watch'),
    notify = require('gulp-notify'),
    sourcemaps = require('gulp-sourcemaps'),
    markdown = require('gulp-markdown'),
    marked = require('marked'),
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

gulp.task('markdown', function () {
    var renderer = new marked.Renderer();
    renderer.heading = function (text, level, raw) {
        var tempArr = text.split('|'),
            label = tempArr[0],
            id = tempArr[1];
        return '<h'
            + level
            + ' id="'
            + this.options.headerPrefix
            + id
            + '">'
            + label
            + '</h'
            + level
            + '>\n';
    };
    gulp.src('./md/*.md')
        .pipe(markdown({
            headerPrefix: '',
            renderer: renderer
        }))
        .pipe(gulp.dest('dist'));
});
