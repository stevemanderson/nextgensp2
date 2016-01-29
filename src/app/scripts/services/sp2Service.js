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
    $httpProvider.defaults.withCredentials = true;
    delete $httpProvider.defaults.headers.common["X-Requested-With"];
    $httpProvider.defaults.headers.common["Accept"] = "application/json";
    $httpProvider.defaults.headers.common["Content-Type"] = "application/json";
  })
  .service('sp2Service', function ($http, $cookies, $location, uuid2) {

    var _userSession = "";
    var _userData = {};
    var _schemaData ={};
    var _responsesData ={};
    var apiURL = "http://"+$location.host()+":9090/api/";

    //API.AI
    var APIAI_accessToken = "314a4598924f462bab6b7b97689976b0 ";
    var APIAI_subscriptionKey = "a519146e-2e12-4440-8ab7-e410175ff118 ";
    var APIAI_baseUrl = "https://api.api.ai/v1/";


    //Check for a user session otherwise create a new one
    if($cookies.get('userSession')){
      _userSession = $cookies.get('userSession');
    }else{
      _userSession = uuid2.newguid();
      $cookies.put('userSession', _userSession);
    }
    console.log("User Session > "+_userSession);


    /**
     * Get responses for chat
     * @param {jSON} data
     */
    this.postQueries = function (data) {
        return $http({ method  : "POST",
                url     : apiURL+"queries/",
                data    : data
               });
    };

    /**
     * Get responses for chat
     * @param {jSON} data
     */
    this.postAnswer = function (data) {
        return $http({ method  : "POST",
                url     : apiURL+"responses/",
                data    : data
               });
    };

    /**
     * Get multiple response
     * @param {jSON} data
     */
    this.postMultiAnswer = function (data) {
        return $http({ method  : "POST",
                url     : apiURL+"multi/",
                data    : data
               });
    };

    /**
     * Get multiple response
     * @param {jSON} data
     */
    this.getServices = function () {
        return $http({ method  : "GET",
                url     : apiURL+"service/"
               });
    };

    /**
     * Get response from API.AI for first question branch guiding
     * @param {jSON} device
     */
    this.sendToAPIAI = function (data) {
        return $http({ method  : "POST",
                url     : APIAI_baseUrl+ "query/",
                headers : {
                  "Authorization": "Bearer " + APIAI_accessToken,
                  "ocp-apim-subscription-key": APIAI_subscriptionKey
                },
                data    : JSON.stringify({ q: data, lang: "en" })
               });


    };
});
