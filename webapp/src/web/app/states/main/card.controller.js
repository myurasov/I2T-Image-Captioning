/**
 * Card controller
 */

import AWS from 'aws-sdk';
import ChattyKathy from 'ChattyKathy';
import promiseWhile from '../../lib/promiseWhile';

export default /* @ngInject */ ($scope, api_endpoint, $http, $timeout,
  aws_access_key_id, aws_secret_key, $filter, $rootScope, Analytics) => {

  let kathy;

  function init() {
    kathy = ChattyKathy({
      awsCredentials: new AWS.Credentials(aws_access_key_id, aws_secret_key),
      awsRegion: 'us-west-2',
      pollyVoiceId: 'Salli',
      cacheSpeech: true
    });

    $scope.state = 'working';
  }

  function resolveCaption() {

    return new Promise((resolve, reject) => {

      $http.post(`${api_endpoint}/queues/i2t/tasks`, {
          file: $scope.v.uploadedFile,
          wait: 5
        }).then((r) => {
          if (r.data.delayed) {
            return promiseWhile(
                () => $scope.state === 'working',
                () => new Promise((resolve, reject) => {
                  $timeout(() => {
                    $http.get(`${api_endpoint}/queues/i2t/tasks/${r.data.task_id}`)
                      .then((r) => {
                        switch (r.data.state) {
                          case 'PENDING':
                            resolve();
                            break;

                          case 'SUCCESS':
                            $scope.state = 'done';
                            resolve(r);
                            break;

                          default:
                            // [ga]
                            Analytics.trackEvent('error', 'executing_task', JSON.stringify(r.data));
                            console.log('error:executing_task', r.data);
                            reject();
                        }
                      }, reject);
                  }, 1000);
                })
              )
              .then((r) => {
                $scope.result = r.data.result;
                resolve($scope.result);
              });
          } else {
            $scope.result = r.data.result;
            resolve($scope.result);
          }
        }, (e) => {
          // [ga]
          Analytics.trackEvent('error', 'api_request', JSON.stringify(e));
          console.log('error:api_request', JSON.stringify(e));
          reject(e);
        })
        .finally((e) => {
          $scope.state = 'done';
        });

    });
  }

  $scope.speak = () => {
    if ($scope.result) {
      // [ga]
      Analytics.trackEvent('caption', 'spoken', $scope.result[0].sentence);
      kathy.Speak($filter('formatCaption')($scope.result[0].sentence));
    }
  };

  //

  init();

  resolveCaption().then(() => {
    // [ga]
    Analytics.trackEvent('caption', 'generated', $scope.result[0].sentence);
    if ($rootScope.sound) $scope.speak();
  });

};
