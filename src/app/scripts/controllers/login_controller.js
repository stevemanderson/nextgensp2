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
});