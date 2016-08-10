var gulp = require('gulp');
var ghPages = require('gulp-gh-pages');
var htmlreplace = require('gulp-html-replace');
var cleanCSS = require('gulp-clean-css');
var del = require('del');
var uglifyJS = require('gulp-uglify');
var concat = require('gulp-concat');
var htmlmin = require('gulp-htmlmin');
var sourcemaps = require('gulp-sourcemaps');
var imagemin = require('gulp-imagemin');

gulp.task('clean', function () {
  return del(['dist']);
});

gulp.task('css', ['clean'], function () {
  return gulp.src('src/css/*.css')
    .pipe(sourcemaps.init())
    .pipe(cleanCSS())
    .pipe(concat('all.min.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/css'));
});

gulp.task('js', ['clean'], function () {
  return gulp.src(['src/apis.js', 'src/js/model.js', 'src/js/view.js', 'src/js/listview.js', 'src/js/controller.js'])
    .pipe(sourcemaps.init())
    .pipe(uglifyJS())
    .pipe(concat('all.min.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/js'));
});

gulp.task('html', ['clean'], function () {
  return gulp.src('src/index.html')
    .pipe(htmlreplace({
      css: 'css/all.min.css',
      js: 'js/all.min.js'
    }))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'));
});

gulp.task('img', ['clean'], function () {
  return gulp.src('src/img/*.png')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/img'));
});

gulp.task('favicon', ['clean'], function () {
  return gulp.src('src/favicon.png')
    .pipe(gulp.dest('dist'));
});

gulp.task('deploy', function () {
  return gulp.src('./dist/**/*')
    .pipe(ghPages());
});

gulp.task('default', ['clean', 'css', 'js', 'html', 'img', 'favicon']);
