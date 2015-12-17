'use strict';
/*
 * Gulp components
 */

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import gSync from 'gulp-sync';


/*
 * Project configuration
 */
const project = {
  name: 'jquery-initialcaps', // project name for gulp-notify
  url: '', // project dev url
  conf: {
    suffix: '.min', // suffix add to prod concat & minified files
    globalJSFile: 'jquery-initialcaps', // name of the concat JS final file (w/o suffix)
    // gulp-uglify configuration
    uglify: {
      preserveComments: 'license',
    },
  },
};

const paths = {
  root: './',
  src: {
    root: './src',
    scripts: './src/js/*.js',
  },
  dist: {
    root: './dist',
    scripts: './dist/js',
  },
};


/*
 * Gulp components init
 */

const $ = gulpLoadPlugins();
const gulpSync = gSync(gulp);


/*
 * Error task
 */

const onError = (err) => {
  console.log(err);
  $.notify.onError({
    title: `Gulp ${project.name}`,
    subtitle: 'Erreur de compilation',
    message: 'Erreur : <%= error.message %>',
  })(err);
  this.emit('end');
};


/*
 * Gulp tasks: js
 */

// JS task: babel + (src -> dist)
gulp.task('js', () => {
  return gulp.src(paths.src.scripts)
    .pipe($.plumber({
      errorHandler: onError,
    }))
    .pipe($.babel({
      presets: ['es2015'],
    }))
    .pipe(gulp.dest(paths.dist.scripts));
});

// JS-min task: uglify + suffix
gulp.task('js-min', () => {
  return gulp.src([
    paths.dist.scripts + '/*.js',
    '!' + paths.dist.scripts + '/*.min.js',
  ])
    .pipe($.plumber({
      errorHandler: onError,
    }))
    .pipe($.uglify(project.conf.uglify))
    .pipe($.rename({
      suffix: project.conf.suffix,
    }))
    .pipe(gulp.dest(paths.dist.scripts));
});


/*
 * Watch task
 */

gulp.task('watch', () => {
  // JS watch task
  gulp.watch(paths.src.scripts, gulpSync.sync(['js', ['js-min']]));
});


/*
 * Global tasks
 */

gulp.task('build', gulpSync.sync(['js', ['js-min']]));
gulp.task('work', gulpSync.sync(['build', ['watch']]));
gulp.task('start', ['work']);
gulp.task('default', ['build']);
