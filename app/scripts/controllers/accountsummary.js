'use strict';

/**
 * @ngdoc function
 * @name sprintOneApp.controller:AccountsummaryCtrl
 * @description
 * # AccountsummaryCtrl
 * Controller of the sprintOneApp
 */
angular.module('sprintOneApp')
  .controller('AccountSummaryCtrl', function ($scope, $location,loginservice) {
    $scope.hasServices= false;
    $scope.dashboard= true;

    $scope.serviceData = loginservice.getServiceData();
    $scope.selectedServices = [];
    $scope.dataSharingOn = loginservice.getDataSharingOn();
    
    function selectedDataFn(){
    	for(var i=0; i<$scope.serviceData.services.length;i++){
    		if($scope.serviceData.services[i].selected){
    			$scope.selectedServices.push($scope.serviceData.services[i]);
    		}
    	}
    	if($scope.selectedServices.length>0){
    		$scope.hasServices= true;
    	}
    }
    selectedDataFn();

    $scope.connectClick = function(){
    	$location.path('/available-survices');
    };
    $scope.privacyClick = function(){
    	$location.path('/account-privacy');
    };
    $scope.shareClick = function(){
    	$scope.dataSharingOn = !$scope.dataSharingOn;
    	loginservice.setDataSharingOn($scope.dataSharingOn);
    };

  });
