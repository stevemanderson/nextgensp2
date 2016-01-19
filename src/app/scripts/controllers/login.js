'use strict';

/**
 * @ngdoc function
 * @name sprintOneApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the sprintOneApp
 */
angular.module('sprintOneApp')
  .controller('LoginCtrl', function ($scope,$location) {
    $scope.loginBtnShow = true;

    $scope.continueClicked = function(){
    	console.log("continueClicked");
    	$scope.loginBtnShow = false;
    	setTimeout(function() {
    		console.log($location.path("/chat"));
    		$location.path("/account-summary");
    		$scope.$apply();
    	}, 1500);
    };
  });
