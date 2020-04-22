const { src, dest, series, parallel } = require('gulp'),
    gulpClean = require('gulp-clean'),
    connect   = require('gulp-connect'),
    sass      = require('gulp-sass'),
    cleanCSS  = require('gulp-clean-css'),
    uglify    = require('gulp-uglify'),
    concat    = require('gulp-concat'),
    pug       = require('gulp-pug'),
    htmlmin   = require('gulp-html-minifier');

// Server task
const server = () => {
  connect.server({
    root: 'build',
    livereload: true
  });
}

// // Live-reload for HTML
// gulp.task('html', function () {
//   return gulp.src('./src/statics/*.html')
//     .pipe(connect.reload());
// });

// Clean build
const clean = () =>
  src('build', {
    read: false,
    allowEmpty: true
  })
  .pipe(gulpClean());

// Compile Pug template to HTML
const compilePug = () =>
  src('src/pug/*.pug')
    .pipe(pug())
    .pipe(dest('build/'));

const build = (cb) => {
  console.log('Build task');

  return compilePug();
}

const watch = (cb) => {
  console.log('Watch task');
  parallel(
    compilePug
  );
  cb();
}

exports.build = series(clean, build)

exports.default = series(
  clean,
  watch,
  server
)