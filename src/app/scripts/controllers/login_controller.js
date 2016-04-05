'use strict';

/**
 * @ngdoc function
 * @name nextgensp2.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the nextgensp5
 */
angular.module('nextgensp2')
  .controller('LoginCtrl', function ($scope,$log,sp2Service, $location) {
  	
  	$scope.login = {
  		username:"",
  		password:"",
  		error:""
  	};

  	$scope.loginClick = function(){
  		$scope.login.error = "";
  		sp2Service.login({username:$scope.login.username}).then(function(response) {
                
                $log.debug(response);
                $location.path('/dashboard');
                
            }, function() {
                $scope.login.error = "There was an error with your Username/Password combination. Please try again.";
            });
  	}
});