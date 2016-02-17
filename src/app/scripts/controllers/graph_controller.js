'use strict';

/**
 * @ngdoc function
 * @name nextgensp2.controller:ChatCtrl
 * @description
 * # ChatCtrl
 * Controller of the nextgensp2
 */
angular.module('nextgensp2')
  .controller('GraphController', function ($scope, $compile, $rootScope, $location) {
  	$scope.location = "http://"+$location.host()+":9191/api/tree";  	
  	console.log($scope.location);
});
