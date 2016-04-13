'use strict';

/**
 * @ngdoc function
 * @name nextgensp2.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the nextgensp5
 */
angular.module('nextgensp2')
  .controller('LoginCtrl', function ($scope,$log,sp2Service, $location,$rootScope) {
  	
  	$scope.login = {
  		username:"",
  		password:"",
  		error:""
  	};
    $scope.display = {
      signup:!$scope.ngDialogData.login,
      signup_email:false,
      login:$scope.ngDialogData.login,
      forgot_pass:false
    };
    

  	$scope.loginClick = function(){
  		$scope.login.error = "";
  		sp2Service.login({username:$scope.login.username}).then(function(response) {
                sp2Service.userLoggedIn(response.data.userId, $scope.login.username )
                $scope.$emit('closeDialog');
            }, function() {
                $scope.login.error = "There was an error with your Username/Password combination. Please try again.";
            });
  	}
    $scope.forgotClick = function(){
      $scope.display = {
        signup:false,
        signup_email:false,
        login:false,
        forgot_pass:true
      };
    }
    $scope.signupClick = function(){
      $scope.display = {
        signup:true,
        signup_email:false,
        login:false,
        forgot_pass:false
      };
    }
    $scope.loginViewClick = function(){
      $scope.display = {
        signup:false,
        signup_email:false,
        login:true,
        forgot_pass:false
      };
    }
});