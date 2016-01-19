'use strict';

/**
 * @ngdoc function
 * @name sprintOneApp.controller:SigninpanelCtrl
 * @description
 * # SigninpanelCtrl
 * Controller of the sprintOneApp
 */
angular.module('sprintOneApp')
  .controller('SigninpanelCtrl', function ($scope, $location) {
    $scope.showDash = true;

    $scope.signinClick = function(){
    	$location.path("/login");
    }
    
  });
