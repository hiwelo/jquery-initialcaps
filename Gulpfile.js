(function () {
  'use strict';

  var gulp = require('gulp'),
      plugins = require('gulp-load-plugins')(),
      paths = {
        root: './',
        dist: {
          root: 'dist/',
          styles: 'dist/css/',
          scripts: 'dist/js/'
        },
        src: {
          root: 'src/',
          styles: 'src/less/',
          scripts: 'src/js/*.js'
        }
      };

  gulp.task('scripts', function () {
    return gulp.src(paths.src.scripts)
      .pipe(plugins.concat('jquery-initialcaps.min.js'))
      .pipe(plugins.uglify())
      .pipe(gulp.dest(paths.dist.scripts));
  });

  gulp.task('build', ['scripts']);
  gulp.task('default', ['build']);
  gulp.task('start', ['build', 'watch']);
  gulp.task('watch', function () {
    gulp.watch(paths.src.scripts, ['scripts']);
  });
})();
