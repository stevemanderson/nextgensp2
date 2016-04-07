'use strict';

/**
 * @ngdoc function
 * @name nextgensp2.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the nextgensp2
 */
angular.module('nextgensp2')
  .controller('ProfileCtrl', function ($scope,sp2Service, sp2Profile, $location) {

  	
  	sp2Profile.profile_getFields().then(function(response) {
                $scope.fields = response.data;
            }, function() {
                console.log("error getting fields");
            });

  	sp2Profile.profile_getAgencies().then(function(response) {
                $scope.agencies = response.data;
            }, function() {
                console.log("error getting agencies");
            });

  	sp2Profile.profile_getFieldCategories().then(function(response) {
                $scope.fieldCategories = response.data;
            }, function() {
                console.log("error getting fieldCategories");
            });

  	sp2Profile.profile_getAllowedAgencyFields(sp2Service.getLoginData()._userID).then(function(response) {
                $scope.allowedAgencyFields = response.data;
            }, function() {
                console.log("error getting allowedAgencyFields");
            });
  	sp2Profile.profile_getUserAgencies(sp2Service.getLoginData()._userID).then(function(response) {
                $scope.userAgencies = response.data.agencies;
            }, function() {
                console.log("error getting UserAgencies");
            });

  	//
  	/*sp2Profile.profile_updateUserAgencies(sp2Service.getLoginData()._userID, [1]).then(function(response) {
                
            }, function() {
                console.log("error getting updateUserAgencies");
            });*/

  	


  	$scope.dashboardClicked = function(){
  		$location.path("/dashboard");
  	}

  });
