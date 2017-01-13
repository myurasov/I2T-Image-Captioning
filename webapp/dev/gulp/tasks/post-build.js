/**
 * Execute post-build steps
 **/

'use strict';

var gulp = require('gulp');
var config = require('../config');
var fsExtra = require('fs-extra');

gulp.task('post-build', function () {
  // copy index.html to web root
  fsExtra.copySync(config.paths.web_build + '/index.html', config.paths.web + '/index.html');
});
