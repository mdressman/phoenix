'use strict';

var app = angular.module('phoenixApp');

app.controller('MainCtrl', function ($scope, $http) {

  $http.get('/api/user_stats').success(function(userStats) {
    $scope.userStats = userStats;
  });

  $scope.showChart = function(user) {
    console.log(user.events_by_day);
    $.plot(
      $('#flot-'+user.id),
      [ user.events_by_day ],
      { xaxis: { min: 1, max: 30 } }
    );
  }

});

app.directive('userCards', function() {
  return {
    templateUrl: 'partials/user-card'
  };
});
