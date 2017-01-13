/**
 * Configuration
 */

import environment from './_environment';

export default (app) => {

  // common config
  app.constant('aws_access_key_id', '');
  app.constant('aws_secret_key', '');

  switch (environment) {
    case 'development':
      app.constant('api_endpoint', 'http://localhost:15000/api/v1');
      break;

    case 'production':
      app.constant('api_endpoint', 'http://--server--/api/v1');
      break;

    default:
      throw new Error(`Invalid environment "${environment}"`);
  }

  // material theme
  app.config( /* @ngInject */ ($mdThemingProvider) => {
    $mdThemingProvider.theme('default')
      .primaryPalette('indigo')
      .accentPalette('orange');
  });

  // google analytics
  app.config( /* @ngInject */ (AnalyticsProvider) => {
    AnalyticsProvider.setAccount('---ua-id--');
  }).run( /* @ngInject */ (Analytics) => {});

};
