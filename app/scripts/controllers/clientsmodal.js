'use strict';

angular.module('openhimWebui2App')
  .controller('ClientsModalCtrl', function ($scope, $modalInstance, Api, Notify, client) {
    var update = false;
    if (client) {
      update = true;
    }

    $scope.client = client || new Api.Clients();

    var done = function () {
      // reset backing object and refresh clients list
      $scope.client = new Api.Clients();
      Notify.notify('clientsChanged');

      $modalInstance.close();
    };

    var saveClient = function (client) {
      if (update) {
        client.$update(done);
      } else {
        client.$save({ clientID: '' }, done);
      }
    };

    var setHashAndSave = function (client, hash, salt) {
      if (typeof salt !== 'undefined' && salt !== null) {
        client.passwordSalt = salt;
      }
      client.passwordHash = hash;
      saveClient(client);
    };

    var hashSHA512 = function (client, password) {
      var salt = CryptoJS.lib.WordArray.random(16).toString();
      var sha512 = CryptoJS.algo.SHA512.create();
      sha512.update(password);
      sha512.update(salt);
      var hash = sha512.finalize();
      client.passwordAlgorithm = 'sha512';
      setHashAndSave(client, hash.toString(CryptoJS.enc.Hex), salt);
    };

    $scope.save = function (client, password) {
      if (password) {
        hashSHA512(client, password);
      } else {
        saveClient(client);
      }

    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.isClientValid = function (client, password, passwordRetype) {
      return client.clientID && client.name && client.domain && client.roles && (password || client.passwordAlgorithm || client.cert) && !(password && password !== passwordRetype);
    };
  });