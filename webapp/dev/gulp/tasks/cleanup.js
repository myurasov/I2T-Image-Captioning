/**
   * Cleanup build files
   **/

  'use strict';

  var gulp = require('gulp');
  var del = require('del');
  var config = require('../config');

  gulp.task('cleanup', function () {
    del.sync(config.paths.web_build);
    del.sync(config.paths.web + '/app/_*.js');
    del.sync(config.paths.web + '/index.html');
});
