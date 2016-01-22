'use strict';

/**
 * @ngdoc function
 * @name nextgensp2.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the nextgensp2
 */
angular.module('nextgensp2')
  .controller('LoginCtrl', function ($scope,$location) {
    $scope.loginBtnShow = true;

    $scope.continueClicked = function(){
    	//console.log("continueClicked");
    	$scope.loginBtnShow = false;
    	setTimeout(function() {
    		//console.log($location.path("/chat"));
    		$location.path("/account-summary");
    		$scope.$apply();
    	}, 1500);
    };
  });
