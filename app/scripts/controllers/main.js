'use strict';

angular.module('phoenixApp')
  .controller('MainCtrl', function ($scope, $http) {

    $http.get('/data/users').success(function(userData) {
      $scope.userData = userData;
    });

    $http.get('/data/logs').success(function(logData) {
      $scope.logData = logData;
      debugger;
    });


  });
