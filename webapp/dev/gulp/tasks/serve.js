/**
 * Serve the client with live reload
 **/

'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var config = require('../config');
var path = require('path');
var os = require('os');

gulp.task('serve', ['build:development'], function () {

  // serve with BrowserSync
  browserSync({
    server: {
      baseDir: config.paths.web,
      index  : path.relative(config.paths.web, config.paths.web_build) + '/index.html'
    },
    notify: true,
    open  : false
  });

  gulp.watch(config.templates.watch_src, ['compile-templates']);
  gulp.watch(config.sass.watch_src, ['compile-sass']);
  gulp.watch(config.ejs.src, ['compile-ejs']);
});
