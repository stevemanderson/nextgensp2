'use strict';

/**
 * @ngdoc function
 * @name nextgensp2.controller:GovheaderCtrl
 * @description
 * # GovheaderCtrl
 * Controller of the nextgensp2
 */
angular.module('nextgensp2')
  .controller('GovheaderCtrl', function ($scope,ngDialog) {
    
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


  });
