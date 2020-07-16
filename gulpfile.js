/**
 * Created by zeqi
 * @description The common node module project for store platform
 * @module node.common
 * @version 1.0.0
 * @author Xijun Zhu <zhuzeqi2010@163.com>
 * @File gulpfile
 * @Date 17-5-22
 * @Wechat zhuzeqi2010
 * @QQ 304566647
 * @Office-email zhuzeqi2013@gmail.com
 */

'use strict';

let gulp = require('gulp');
var clean = require('gulp-clean');
var jsdoc = require('gulp-jsdoc3');

gulp.task('clear', function () {
    return gulp.src('docs/*')
        .pipe(clean());
});

gulp.task('doc', function (cb) {
    return gulp.src(['lib/', 'lib/**/*.js'], { read: false })
        .pipe(jsdoc())
        .pipe(gulp.dest('docs'));
});

gulp.task('default', ['doc']);
