'use strict';

/**
 * @ngdoc function
 * @name nextgensp2.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the nextgensp5
 */
angular.module('nextgensp2')
  .controller('LoginCtrl', function ($scope,$log,sp2Service) {
  	$scope.login = {
  		username:"",
  		password:""
  	};

  	$scope.loginClick = function(){
  		$log.debug($scope.login);
  		sp2Service.login({username:$scope.login.username}).then(function(response) {
                
                $log.debug(response);
            }, function() {
                $log.debug("Login Error");
            });
  	}
});