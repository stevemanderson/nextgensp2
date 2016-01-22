'use strict';

/**
 * @ngdoc function
 * @name nextgensp2.controller:ChatCtrl
 * @description
 * # ChatCtrl
 * Controller of the nextgensp2
 */
angular.module('nextgensp2')
  .controller('Sprint2Ctrl', function ($scope, appService,  $compile) {
    
  	$scope.autoCompleteVal;
  	$scope.geolocation = "";

  	
    $scope.autoCompleteBlur =function(event){
    	$scope.geolocation = $scope.autoCompleteVal.geometry.location.lat()+","+$scope.autoCompleteVal.geometry.location.lng();
    }

    //Add contactbox
    function addContactBox(){
        angular.element(document.getElementById('chat-frame')).append($compile('<div class="chat-block"><contactbox></contactbox></div>')($scope)); 
    }
    
});

