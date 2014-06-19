'use strict';

var app = angular.module('phoenixApp');

app.controller('MainCtrl', function ($scope, $http) {

  $http.get('/api/user_stats').success(function(userStats) {
    $scope.userStats = userStats;
  });

  $scope.showChart = function(user) {
    $.plot(
      $('#flot-'+user.id), [{
        data: user.events_by_day,
        color: "#393939"
      }],
      { 
        xaxis: { min: 1, max: 30 },
        series: {
          lines: { show: true },
          points: { show:false }
        },
        grid: { show: false }
      }
    );
  }

});

app.directive('userCards', function() {
  return {
    templateUrl: 'partials/user-card'
  };
});
