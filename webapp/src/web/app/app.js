/**
 * Main application file
 */

import 'jquery';
import 'lodash';
import 'angular';
import 'angular-material';
import 'angular-ui-router';
import 'angular-material-icons';
import 'angular-google-analytics';
import 'ng-file-upload';

import states from './app.states';
import filters from './app.filters';
import config from './app.config.local';

import templatesModule from './_templates'; // cached templates

// define app module
const app = angular.module('app', [
  'ui.router',
  'ngMaterial',
  'ngMdIcons',
  'ngFileUpload',
  'angular-google-analytics',
  templatesModule.name
]);

// config
config(app);

// filters
filters(app);

// states
app.config(states);

// error reporting

app.factory('GAErrorLogger',
  /* @ngInject */
  ($log, $window, $injector) => {
    return function(exception, cause) {
      $log.error.apply($log, arguments);
      $injector.get('Analytics').trackEvent('error', 'unknown', exception.toString() + ' / ' + exception.stack, null, true);
    };
  }
);

app.provider('$exceptionHandler', {
  $get: /* @ngInject */ (GAErrorLogger) => {
    return (GAErrorLogger);
  }
});

// bootstrap app
angular
  .element(document)
  .ready(() => angular.bootstrap(document, [app.name]));

export default app;
