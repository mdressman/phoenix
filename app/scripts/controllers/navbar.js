'use strict';

angular.module('phoenixApp')
  .controller('NavbarCtrl', function ($scope, $location) {
    $scope.menu = [{
      'title': 'View this on GitHub',
      'link': 'https://github.com/mdressman/phoenix'
    }];
    
    $scope.isActive = function(route) {
      return route === $location.path() || 'https://github.com/mdressman/phoenix';
    };
  });
