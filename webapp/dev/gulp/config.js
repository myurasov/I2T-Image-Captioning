/**
 * Gulp configuration
 */

'use strict';

// paths
exports.paths = {};
exports.paths.root = __dirname + '/../..';
exports.paths.web = exports.paths.root + '/src/web';
exports.paths.web_build = exports.paths.root + '/src/web/build';
exports.paths.tests = exports.paths.root + '/src/tests';

exports.ejs = {
  src: [exports.paths.web + '/ejs/**/*.ejs', '!**/_*.ejs'],
  dest: exports.paths.web_build
};

exports.sass = {
  watch_src: exports.paths.web + '/sass/**/*.scss',
  src: exports.paths.web + '/sass/main.scss',
  dest: exports.paths.web_build
};

exports.compileScripts = {
  src: exports.paths.web + '/app/app.js',
  dest: exports.paths.web_build + '/build.js'
};

exports.templates = {
  src: [
    exports.paths.web + '/**/*.html', '!/**/vendor/**/',
    '!' + exports.paths.web_build + '/**',
    '!' + exports.paths.web + '/index.html'
  ],
  watch_src: [
    exports.paths.web + '/app/**/*.html',
  ],
  options: {
    filename: '_templates.js',
    standalone: true
  },
  dest: exports.paths.web + '/app'
};
