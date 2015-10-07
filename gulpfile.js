/*
  _       __  __         _      _ ___      _ _    _
 | |__ __|  \/  |___  __| |__ _| | _ )_  _(_) |__| |___ _ _
 | '_ (_-< |\/| / _ \/ _` / _` | | _ \ || | | / _` / -_) '_|
 |_.__/__/_|  |_\___/\__,_\__,_|_|___/\_,_|_|_\__,_\___|_|


List of possible actions:
  <empty> - same as 'build',
  build   - will recompile all CoffeeScript files,
  clean   - will remove compiled JavaScript files,
  help    - will output this list.
*/

var gulp = require('gulp');
var coffee = require('gulp-coffee');
var coffeelint = require('gulp-coffeelint');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var util = require('gulp-util');
var del = require('del');
var pkg = require('./package.json');

console.log('----- ' + pkg.name + ' v' + pkg.version + ' -----');
console.log(util.colors.yellow('#----------> '  +  pkg.name  +  util.colors.green(' v'  +  pkg.version)  +  ' <----------#'));

// ----- task: build -----
// Recompile CoffeeScript files to JavaScript.
gulp.task('build', ['clean'], function() {
  return gulp.src('bsModalBuilder.coffee')
  .pipe(coffeelint())
  .pipe(coffeelint.reporter())
  .pipe(coffee({ bare: true }))
  .pipe(gulp.dest('.'))
  .pipe(rename({ suffix: '.min' }))
  .pipe(uglify())
  .pipe(gulp.dest('.'));
});

// ----- task: clean -----
// Remove compiled JavaScript files.
gulp.task('clean', function(cb) {
  del(['bsModalBuilder.js', 'bsModalBuilder.min.js'], cb);
});

// ----- task: help -----
// Display help text.
gulp.task('help', function() {
  console.log('');
  console.log('  _       __  __         _      _ ___      _ _    _');
  console.log(' | |__ __|  \\/  |___  __| |__ _| | _ )_  _(_) |__| |___ _ _');
  console.log(' | \'_ (_-< |\\/| / _ \\/ _` / _` | | _ \\ || | | / _` / -_) \'_|');
  console.log(' |_.__/__/_|  |_\\___/\\__,_\\__,_|_|___/\\_,_|_|_\\__,_\\___|_|');
  console.log('');
  console.log('');
  console.log(pkg.description + ' v' + pkg.version);
  console.log('----------------------------------------------------------------');
  console.log('');
  console.log('Repository: ' + pkg.repository.url);
  console.log('');
  console.log('Usage:');
  console.log('  gulp '  +  util.colors.cyan('<action>')  +  '');
  console.log('');
  console.log('List of possible actions:');
  console.log('  '  +  util.colors.gray('empty')  +  ' - same as \'build\',');
  console.log('  build - will recompile CoffeeScript files,');
  console.log('  clean - will remove compiled JavaScript files,');
  console.log('  help  - will output this list.');
  console.log('');
});

// ----- task: default -----
// Same as build - recompile CoffeeScript files.
gulp.task('default', ['clean'], function() {
  gulp.start('build');
});
