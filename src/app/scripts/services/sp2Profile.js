 /*jshint unused:false*/
'use strict';

/**
 * @ngdoc service
 * @name nextgensp2.appService
 * @description
 * # appService
 * Service in the nextgensp2.
 */
angular.module('nextgensp2')
  .config(function($httpProvider){
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.withCredentials = false;
    delete $httpProvider.defaults.headers.common["X-Requested-With"];
    $httpProvider.defaults.headers.common["Accept"] = "application/json";
    $httpProvider.defaults.headers.common["Content-Type"] = "application/json";

  })
  .service('sp2Profile', function ($http, $cookies, $location, uuid2, $rootScope) {

    var apiURL = "http://"+$location.host()+":9191/api/";
    /**
     * Get all fields for a profile
     * 
     */
    this.profile_getFields = function () {
        return $http({ method  : "GET",
                url     : apiURL+"fields",
                withCredentials: true
               });
    };

    /**
     * Get all agencies
     * 
     */
    this.profile_getAgencies = function () {
        return $http({ method  : "GET",
                url     : apiURL+"agencies",
                withCredentials: true
               });
    };

    /**
     * Get fields categories
     * 
     */
    this.profile_getFieldCategories = function () {
        return $http({ method  : "GET",
                url     : apiURL+"fieldCategories",
                withCredentials: true
               });
    };

    /**
     * Get allowed agency fields
     * 
     */
    this.profile_getAllowedAgencyFields = function (userID) {
        return $http({ method  : "GET",
                url     : apiURL+"allowedAgencyFields?userId="+userID,
                withCredentials: true
               });
    };

    /**
     * Get user agencys connected
     * 
     */
    this.profile_getUserAgencies = function (userID) {
        return $http({ method  : "GET",
                url     : apiURL+"useragencies?userId="+userID,
                withCredentials: true
               });
    };
    /**
     * Get user agencys connected
     * 
     */
    this.profile_updateUserAgencies = function (userID, agencyIds ) {
        //userId, agencies

        return $http({ method  : "POST",
                url     : apiURL+"useragencies",
                data: {userId:userID,agencies:agencyIds},
                withCredentials: true
               });
    };


});