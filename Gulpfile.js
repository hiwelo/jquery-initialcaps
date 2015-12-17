'use strict';
/*
 * Gulp components
 */

var _gulp = require('gulp');

var _gulp2 = _interopRequireDefault(_gulp);

var _gulpLoadPlugins = require('gulp-load-plugins');

var _gulpLoadPlugins2 = _interopRequireDefault(_gulpLoadPlugins);

var _gulpSync = require('gulp-sync');

var _gulpSync2 = _interopRequireDefault(_gulpSync);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Project configuration
 */
var project = {
  name: 'jquery-initialcaps', // project name for gulp-notify
  url: '', // project dev url
  conf: {
    suffix: '.min', // suffix add to prod concat & minified files
    globalJSFile: 'jquery-initialcaps', // name of the concat JS final file (w/o suffix)
    // gulp-uglify configuration
    uglify: {
      preserveComments: 'license'
    }
  }
};

var paths = {
  root: './',
  src: {
    root: './src',
    scripts: './src/js/*.js'
  },
  dist: {
    root: './dist',
    scripts: './dist/js'
  }
};

/*
 * Gulp components init
 */

var $ = (0, _gulpLoadPlugins2.default)();
var gulpSync = (0, _gulpSync2.default)(_gulp2.default);

/*
 * Error task
 */

var onError = function onError(err) {
  console.log(err);
  $.notify.onError({
    title: 'Gulp ' + project.name,
    subtitle: 'Erreur de compilation',
    message: 'Erreur : <%= error.message %>'
  })(err);
  undefined.emit('end');
};

/*
 * Gulp tasks: js
 */

// JS task: babel + (src -> dist)
_gulp2.default.task('js', function () {
  return _gulp2.default.src(paths.src.scripts).pipe($.plumber({
    errorHandler: onError
  })).pipe($.babel({
    presets: ['es2015']
  })).pipe(_gulp2.default.dest(paths.dist.scripts));
});

// JS-min task: uglify + suffix
_gulp2.default.task('js-min', function () {
  return _gulp2.default.src([paths.dist.scripts + '/*.js', '!' + paths.dist.scripts + '/*.min.js']).pipe($.plumber({
    errorHandler: onError
  })).pipe($.uglify(project.conf.uglify)).pipe($.rename({
    suffix: project.conf.suffix
  })).pipe(_gulp2.default.dest(paths.dist.scripts));
});

/*
 * Watch task
 */

_gulp2.default.task('watch', function () {
  // JS watch task
  _gulp2.default.watch(paths.src.scripts, gulpSync.sync(['js', ['js-min']]));
});

/*
 * Global tasks
 */

_gulp2.default.task('build', gulpSync.sync(['js', ['js-min']]));
_gulp2.default.task('work', gulpSync.sync(['build', ['watch']]));
_gulp2.default.task('start', ['work']);
_gulp2.default.task('default', ['build']);
