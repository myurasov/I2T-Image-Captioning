/**
 * Content controller
 */

export default /* @ngInject */ ($scope, Upload, api_endpoint, $http) => {

  $scope.state = 'ready';
  $scope.cards = [];

  $scope.upload = (file) => {
    if (file) {
      $scope.state = 'resizing';
      let thumbDataUrl, uploadFile;

      Upload.resize(file, {
          width: 299 * 1.5,
          height: 299 * 1.5,
          quality: 0.9
        })
        .then((r) => {
          uploadFile = r;
        })
        .then(() => Upload.resize(file, {
          width: 1024,
          height: 1024
        }))
        .then(Upload.base64DataUrl)
        .then((r) => {
          thumbDataUrl = r;
        })

        .then(() => {
          $scope.state = 'uploading';
          return Upload.upload({
            url: `${api_endpoint}/uploads`,
            file: uploadFile
          });
        })

        .then(
          /* ok */
          (r) => {
            Upload.dataUrl(file).then((url) => {
              $scope.cards.unshift({
                uploadedFile: r.data.file,
                thumbnailSrc: thumbDataUrl
              });
            });
          },
          /* error */
          (e) => {
            console.log('error', e);
          },
          /* events */
          (e) => {
            $scope.uploadProgress = parseInt(100.0 * e.loaded / e.total);
          })
        .finally(() => {
          $scope.state = 'ready';
        });
    }
  };
};
