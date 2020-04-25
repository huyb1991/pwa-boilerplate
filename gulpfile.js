const {
  src,
  dest,
  watch,
  series,
  parallel
} = require('gulp'),
  gulpClean = require('gulp-clean'),
  connect   = require('gulp-connect'),
  sass      = require('gulp-sass'),
  cleanCSS  = require('gulp-clean-css'),
  uglify    = require('gulp-uglify'),
  concat    = require('gulp-concat'),
  pug       = require('gulp-pug');

// Server task
const server = () => {
  connect.server({
    root: 'build',
    livereload: true
  });
}

// Live-reload for HTML
const livereload = () =>
  src([
    './build/**/*.html',
    './build/**/*.css',
    './build/**/*.js',
  ])
  .pipe(connect.reload())

// Clean build
const clean = () =>
  src('build', {
    read: false,
    allowEmpty: true
  })
  .pipe(gulpClean());

// Copy assets
const copy = () =>
  src('./src/asset/**/*')
  .pipe(dest('build'))

// Compile Pug template to HTML
const pugBundle = () =>
  src('./src/pug/*.pug')
    .pipe(pug())
    .pipe(dest('build'));

// Compile sass
const cssBundle = () =>
  src('./src/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(concat('styles.css'))
    .pipe(dest('build'))

// Compress JS
const jsBundle = () =>
  src('./src/js/**/*.js')
    .pipe(src('vendor/*.js'))
    .pipe(uglify())
    .pipe(concat('main.js'))
    .pipe(dest('build'));

const watchFiles = (cb) => {
  // Re-build
  watch('./src/js/**/*.js', jsBundle);
  watch('./src/sass/**/*.scss', cssBundle);
  watch('./src/pug/*.pug', pugBundle);

  // Livereload
  watch([
    './build/**/*.html',
    './build/**/*.css',
    './build/**/*.js'
  ], livereload);

  return cb();
}

exports.build = series(
  clean,
  parallel(
    pugBundle,
    cssBundle,
    jsBundle
  ),
  copy
)

exports.default = series(
  clean,
  this.build,
  watchFiles,
  server
)
