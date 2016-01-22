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
  .service('sp2Service', function ($http, $cookies, uuid2) {
    
    var _userSession = {};
    var _userData = {};
    var _schemaData ={};
    var _responsesData ={};
    var apiURL = "http://127.0.0.1:9090/api/responses/";


    //Check for a user session otherwise create a new one
    if($cookies.get('userSession')){
      _userSession = JSON.parse($cookies.get('userSession'));
    }else{
      _userSession.guid = uuid2.newguid();
      $cookies.put('userSession', JSON.stringify(_userSession));
    }
    console.log("User Session > "+_userSession.guid);


    /**
     * Get responses for chat
     * @param {jSON} device
     */
    this.postAnswer = function (data) {
        console.log(data);
        return $http({ method  : "POST",
                url     : apiURL,
                data    : data
               });
    };

});
 
