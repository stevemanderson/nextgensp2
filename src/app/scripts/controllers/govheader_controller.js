'use strict';

/**
 * @ngdoc function
 * @name nextgensp2.controller:GovheaderCtrl
 * @description
 * # GovheaderCtrl
 * Controller of the nextgensp2
 */
angular.module('nextgensp2')
  .controller('GovheaderCtrl', function ($scope,$rootScope,ngDialog, $location,sp2Service) {
    $scope.userLoggedIn = sp2Service.getLoginStatus();
    $scope.userData = sp2Service.getLoginData();
    $scope.headerNav = "";

    console.log($location.path());
    console.log($scope.userData );

  	$scope.signUpClicked =  function(){
  		ngDialog.open({
            template:"partials/popup_login.html",
            controller:"LoginCtrl",
            className: "ngdialog-theme-default",
            appendClassName: "ngdialog-login",
            data: {login:false}
          });
  	}
	$scope.loginClicked =  function(){
		ngDialog.open({
            template:"partials/popup_login.html",
            controller:"LoginCtrl",
            className: "ngdialog-theme-default",
            appendClassName: "ngdialog-login",
            data: {login:true}
          });
  	}

  $scope.profileClicked = function(){
    $location.path('/profile');
  }

  $scope.logoutClicked = function(){
    $scope.userLoggedIn = sp2Service.logout();
    $location.path('/dashboard');
  }

  //Close window
  $rootScope.$on('closeDialog', function(event) { 
    ngDialog.close();
  });

  $rootScope.$on('UserLoggedIn', function(event) { 
    $scope.userLoggedIn = true; 
  });


  });
