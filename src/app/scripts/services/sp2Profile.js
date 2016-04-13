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
     * Get all user fields for a profile
     * 
     */
    this.profile_getUserFields = function (userid) {
        return $http({ method  : "GET",
                url     : apiURL+"userfields?userId="+userid,
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
    /**
     *  addUserAgencyField 
     *  this is for each field, loop over to completly tick a category of fields
     */
    this.profile_addUserAgencyField = function (userId, agencyId, fieldId) {
        //userId, agencies

        return $http({ method  : "POST",
                url     : apiURL+"addUserAgencyField",
                data: {userId:userId,agencyId:agencyId,fieldId:fieldId},
                withCredentials: true
               });
    };

    /**
     *  removeUserAgencyField 
     *  this is for each field, loop over to completly untick a category of fields
     */
    this.profile_removeUserAgencyField = function (userId, agencyId, fieldId) {
        //userId, agencies

        return $http({ method  : "POST",
                url     : apiURL+"removeUserAgencyField",
                data: {userId:userId,agencyId:agencyId,fieldId:fieldId},
                withCredentials: true
               });
    };

});
