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

var gulp = require('gulp'),
    coffee = require('gulp-coffee'),
    coffeelint = require('gulp-coffeelint'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    path = require('path'),
    del = require('del'),
    fs = require('fs'),
    pkg = require('./package.json');

console.log('----- '+pkg.name+' v'+pkg.version+' -----');

// ----- task: build -----
gulp.task('build', function() {
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
gulp.task('clean', function(cb) {
  del(['bsModalBuilder.js', 'bsModalBuilder.min.js'], cb);
});

// ----- task: help -----
gulp.task('help', function() {
  console.log(pkg.description+' v'+pkg.version+' Gulp project builder.');
  console.log('----------------------------------------------------------------');
  console.log('');
  console.log('Repository: '+pkg.repository.url);
  console.log('');
  console.log('Usage:');
  console.log('  gulp <action>');
  console.log('');
  console.log('List of possible actions:');
  console.log('  empty - same as \'build\',');
  console.log('  build - will recompile CoffeeScript files,');
  console.log('  clean - will remove compiled JavaScript files,');
  console.log('  help  - will output this list.');
  console.log('');
});

// ----- task: default -----
gulp.task('default', ['clean'], function() {
  gulp.start('build');
});
