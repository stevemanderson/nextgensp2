'use strict';

/**
 * @ngdoc function
 * @name nextgensp2.controller:SigninpanelCtrl
 * @description
 * # SigninpanelCtrl
 * Controller of the nextgensp2
 */
angular.module('nextgensp2')
  .controller('SigninpanelCtrl', function ($scope, $location) {
    $scope.showDash = true;

    $scope.signinClick = function(){
    	$location.path("/login");
    }
    
  });
