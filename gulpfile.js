#!/usr/bin/env node

var gulp = require('gulp');
var clean_css = require('gulp-clean-css');
var replace = require('gulp-html-replace');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var path = require('path');
var fs = require('fs');

var version = fs.readFileSync('version').toString().trim();

console.log(`Generating links for mbox version ${version}`);

// gulp.task('uglify', () => {
//     return gulp.src('./src/mbox.js')
//         .pipe(uglify())
//         .pipe(rename('mbox-' + version + '.min.js'))
//         .pipe(gulp.dest('./dist'));
// });


gulp.task('update-cdn-links', () => {
    return gulp.src('./template.html')
        .pipe(replace({
            css: `http://cdn.bri.io/mbox/dist/mbox-${version}.min.css`,
            js: `http://cdn.bri.io/mbox/dist/mbox-${version}.min.js`
        })).pipe(rename('index.html'))
        .pipe(gulp.dest('./'));
});

/* gulp.task('minify-css', () => {
    return gulp.src('./src/mbox.css')
        .pipe(clean_css())
        .pipe(rename('mbox-' + version + '.min.css'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('minify-index-js', () => {
    return gulp.src('./src/index.js')
        .pipe(uglify())
        .pipe(rename('index.min.js'))
        .pipe(gulp.dest('./dist'));
});
gulp.task('minify-index-css', () => {
    return gulp.src('./src/index.css')
        .pipe(clean_css())
        .pipe(rename('index.min.css'))
        .pipe(gulp.dest('./dist'));
}); */


gulp.task('default', ['update-cdn-links']);