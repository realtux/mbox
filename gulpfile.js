#!/usr/bin/env node
var gulp = require('gulp');
var clean_css = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var path = require('path');
var fs = require('fs');

var version = fs.readFileSync('version').toString().trim();

console.log('compressing version:', version);

gulp.task('uglify', () => {
    return gulp.src('./src/mbox.js')
        .pipe(uglify())
        .pipe(rename('mbox-' + version + '.min.js'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('minify-css', () => {
    return gulp.src('./src/mbox.css')
        .pipe(clean_css())
        .pipe(rename('mbox-' + version + '.min.css'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['uglify', 'minify-css']);
