'use strict';

angular.module('phoenixApp')
  .controller('MainCtrl', function ($scope, $http) {

    $http.get('/api/user_stats').success(function(userStats) {
      $scope.userStats = userStats;
    });

  });