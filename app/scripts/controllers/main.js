'use strict';

var app = angular.module('phoenixApp');

app.controller('MainCtrl', function ($scope, $http) {

  // get data and add to scope
  $http.get('/api/user_stats').success(function(userStats) {
    $scope.userStats = userStats;
  });

  // display chart for each user's event values
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

// include partial template
app.directive('userCards', function() {
  return {
    templateUrl: 'partials/user-card'
  };
});
